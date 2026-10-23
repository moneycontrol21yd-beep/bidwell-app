import requests, re, json, time
from datetime import datetime
from bs4 import BeautifulSoup

SUPABASE_URL = "https://mvelgzwtopfanrrdtxoo.supabase.co"
# Yahan apni Supabase Anon Key daalna (NEXT_PUBLIC_SUPABASE_ANON_KEY)
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZWxnend0b3BmYW5ycmR0eG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2NjM5MywiZXhwIjoyMTA2NDQyMzkzfQ.ukPKWb6T7cKqc0Xsu6jrEsHNJe-lXb8Y3dU9EQSQauM"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
}

def detect_state(text):
    text = text.lower()
    if "delhi" in text or "nct" in text: return "Delhi"
    if "mumbai" in text or "maharashtra" in text: return "Maharashtra"
    if "bhopal" in text or "indore" in text or "madhya pradesh" in text: return "Madhya Pradesh"
    if "jaipur" in text or "rajasthan" in text: return "Rajasthan"
    if "chennai" in text or "tamil nadu" in text: return "Tamil Nadu"
    if "lucknow" in text or "uttar pradesh" in text: return "Uttar Pradesh"
    if "bengaluru" in text or "karnataka" in text: return "Karnataka"
    if "kolkata" in text or "west bengal" in text: return "West Bengal"
    if "gujarat" in text or "ahmedabad" in text: return "Gujarat"
    return "All India"

def get_csrf_token(session):
    """Naya tarika: Cookie 'csrf_gem_cookie' se token nikaalna"""
    try:
        r = session.get("https://bidplus.gem.gov.in/all-bids", headers=HEADERS, timeout=30)
        if r.status_code != 200: return None
        # Token cookie me hota hai
        token = session.cookies.get('csrf_gem_cookie')
        if token:
            print(f"  CSRF token found (length: {len(token)})")
            return token
        return None
    except Exception as e:
        print(f"  CSRF error: {e}")
        return None

def fetch_bids_page(session, csrf, page=1):
    url = "https://bidplus.gem.gov.in/all-bids-data"
    # Naya payload format
    data = {
        "page": page,
        "param": json.dumps({"searchBid": "", "searchType": "fullText"}),
        "filter": json.dumps({"sort": "", "bidStatusType": "", "byType": ""}),
        "csrf_bd_gem_nk": csrf or "",  # Naya field name
    }
    headers = {
        **HEADERS,
        "X-Requested-With": "XMLHttpRequest",
        "Referer": "https://bidplus.gem.gov.in/all-bids",
        "Origin": "https://bidplus.gem.gov.in",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
    try:
        r = session.post(url, headers=headers, data=data, timeout=30)
        if r.status_code != 200:
            print(f"  HTTP {r.status_code}")
            return None
        try:
            return r.json()
        except:
            print(f"  JSON parse failed")
            return None
    except Exception as e:
        print(f"  Fetch error: {e}")
        return None

def parse_bid(item):
    try:
        bid_id = item.get("b_id", "") or item.get("id", "")
        title = item.get("b_category_name", "") or item.get("b_title", "") or item.get("b_bid_number", "")
        dept = item.get("ba_official_details_deptName", "") or item.get("b_department", "") or "GeM"
        end_date = item.get("b_end_date", "") or item.get("b_bid_end_date", "")

        if not title or len(title) < 5: return None

        url = f"https://bidplus.gem.gov.in/showbidDocument/{bid_id}" if bid_id else ""
        if not url: return None
        
        actual_state = detect_state(title + " " + dept)

        return {
            "source": "GeM",
            "source_tender_id": f"gem_{bid_id}",
            "title": title[:500],
            "org_name": dept[:300],
            "state": actual_state,
            "category": "Goods",
            "source_url": url,
            "closing_date": end_date or None
        }
    except:
        return None

def push_to_supabase(rows):
    if not rows: return 0
    url = f"{SUPABASE_URL}/rest/v1/live_tenders?on_conflict=source,source_tender_id"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates,return=minimal",
    }
    inserted = 0
    for i in range(0, len(rows), 100):
        batch = rows[i:i+100]
        try:
            r = requests.post(url, headers=headers, json=batch, timeout=30)
            if r.status_code in (200, 201, 204):
                inserted += len(batch)
            else:
                print(f"  Supabase Error {r.status_code}: {r.text}")
        except Exception as e:
            print(f"  Network error: {e}")
    return inserted

def main():
    print(f"[GEM START] {datetime.now()}")
    session = requests.Session()
    csrf = get_csrf_token(session)
    if not csrf:
        print("[STOP] CSRF token nahi mila. Check karo ki site accessible hai ya nahi.")
        return

    all_rows = []
    for page in range(1, 21): # 20 pages
        print(f"Fetching page {page}...")
        data = fetch_bids_page(session, csrf, page)
        if not data:
            print(f"  Page {page} failed")
            break

        # Naya response format: response.response.docs
        docs = []
        if isinstance(data, dict):
            try:
                docs = data.get("response", {}).get("response", {}).get("docs", [])
            except:
                docs = data.get("docs", []) # Fallback
        
        if not docs:
            print(f"  No docs on page {page}")
            break

        for item in docs:
            row = parse_bid(item)
            if row: all_rows.append(row)

        print(f"  Page {page}: {len(docs)} bids (total {len(all_rows)})")
        time.sleep(2)

    # Deduplicate
    seen = set()
    unique = []
    for r in all_rows:
        if r["source_tender_id"] not in seen:
            seen.add(r["source_tender_id"])
            unique.append(r)

    print(f"[UNIQUE] {len(unique)} after dedup")
    inserted = push_to_supabase(unique)
    print(f"[DONE] Inserted {inserted} to Supabase")

if __name__ == "__main__":
    main()
