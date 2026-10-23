import requests, re, json, time
from datetime import datetime

SUPABASE_URL = "https://mvelgzwtopfanrrdtxoo.supabase.co"
# Yahan apni Supabase Anon Key daalna (NEXT_PUBLIC_SUPABASE_ANON_KEY)
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZWxnend0b3BmYW5ycmR0eG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2NjM5MywiZXhwIjoyMTA2NDQyMzkzfQ.ukPKWb6T7cKqc0Xsu6jrEsHNJe-lXb8Y3dU9EQSQauM"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def detect_state(text):
    text = text.lower()
    if "delhi" in text or "nct" in text: return "Delhi"
    if "mumbai" in text or "maharashtra" in text: return "Maharashtra"
    if "bhopal" in text or "madhya pradesh" in text: return "Madhya Pradesh"
    if "jaipur" in text or "rajasthan" in text: return "Rajasthan"
    if "chennai" in text or "tamil nadu" in text: return "Tamil Nadu"
    if "lucknow" in text or "uttar pradesh" in text: return "Uttar Pradesh"
    if "bengaluru" in text or "karnataka" in text: return "Karnataka"
    if "kolkata" in text or "west bengal" in text: return "West Bengal"
    if "gujarat" in text or "ahmedabad" in text: return "Gujarat"
    return "All India"

def get_csrf_token(session):
    try:
        r = session.get("https://bidplus.gem.gov.in/all-bids", headers=HEADERS, timeout=30)
        return session.cookies.get('csrf_gem_cookie') if r.status_code == 200 else None
    except: return None

def fetch_bids_page(session, csrf, page):
    url = "https://bidplus.gem.gov.in/all-bids-data"
    data = {
        "page": page, "param": "", "filter": "",
        "searchBid": "", "searchType": "fullText",
        "csrf_test_name": csrf, "csrf_bd_gem_nk": csrf
    }
    headers = {**HEADERS, "X-Requested-With": "XMLHttpRequest",
               "Referer": "https://bidplus.gem.gov.in/all-bids",
               "Origin": "https://bidplus.gem.gov.in",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
    try:
        r = session.post(url, headers=headers, data=data, timeout=30)
        return r.json() if r.status_code == 200 else None
    except: return None

def parse_bid(item):
    try:
        # Screenshot se mili exact keys
        bid_id = item.get("b_id", "")
        title = item.get("b_category_name", "")[0] if isinstance(item.get("b_category_name"), list) else item.get("b_category_name", "")
        dept = item.get("ba_official_details_deptName", "GeM")
        end_date = item.get("final_end_date_sort", "")

        if not title or len(str(title)) < 5: return None

        url = f"https://bidplus.gem.gov.in/showbidDocument/{bid_id}" if bid_id else ""
        
        return {
            "source": "GeM",
            "source_tender_id": f"gem_{bid_id}",
            "title": str(title)[:500],
            "org_name": str(dept)[:300],
            "state": detect_state(str(title) + " " + str(dept)),
            "category": "Goods",
            "source_url": url,
            "closing_date": end_date or None
        }
    except: return None

def push_to_supabase(rows):
    if not rows: return 0
    url = f"{SUPABASE_URL}/rest/v1/live_tenders?on_conflict=source,source_tender_id"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates,return=minimal",
    }
    try:
        r = requests.post(url, headers=headers, json=rows, timeout=30)
        return len(rows) if r.status_code in (200, 201, 204) else 0
    except: return 0

def main():
    print(f"[GEM START] {datetime.now()}")
    session = requests.Session()
    csrf = get_csrf_token(session)
    if not csrf: print("CSRF nahi mila"); return

    for page in range(1, 21): # 20 pages
        data = fetch_bids_page(session, csrf, page)
        if not data: break
        
        # Sahi jagah se data nikalo
        docs = data.get("response", {}).get("docs", [])
        if not docs: break

        rows = [parse_bid(item) for item in docs if parse_bid(item)]
        if rows:
            ins = push_to_supabase(rows)
            print(f"Page {page}: {len(docs)} bids, Pushed {ins} to Supabase")
        time.sleep(2)

if __name__ == "__main__":
    main()
