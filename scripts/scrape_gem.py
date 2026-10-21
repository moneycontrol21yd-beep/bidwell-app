import os, re, time, requests
from datetime import datetime
from bs4 import BeautifulSoup

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0",
    "Accept": "text/html,application/xhtml+xml",
}

def fetch_gem(page):
    """GeM all bids (AJAX POST)"""
    url = "https://bidplus.gem.gov.in/all-bids-data"
    headers = {
        **HEADERS,
        "X-Requested-With": "XMLHttpRequest",
        "Referer": "https://bidplus.gem.gov.in/all-bids",
        "Origin": "https://bidplus.gem.gov.in",
    }
    data = {
        "page": page,
        "param": "",
        "filter": "",
        "searchBid": "",
        "searchType": "fullText",
    }
    try:
        r = requests.post(url, headers=headers, data=data, timeout=30)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"  GeM err: {e}", flush=True)
    return None

def parse_gem_json(data, page):
    tenders = []
    if not data or "docs" not in data:
        return tenders
    for item in data.get("docs", []):
        try:
            bid_id = item.get("b_id", "")
            title = item.get("b_category_name", "") or item.get("b_title", "")
            if len(title) < 10:
                title = item.get("b_bid_number", "")
            dept = item.get("ba_official_details_deptName", "GeM")
            end_date = item.get("b_end_date", "")
            url = f"https://bidplus.gem.gov.in/showbidDocument/{bid_id}" if bid_id else ""
            if not url or not title:
                continue
            tenders.append({
                "title": title[:350],
                "department": dept[:300],
                "deadline": end_date or None,
                "source": "GeM",
                "source_url": url,
                "status": "active",
            })
        except:
            continue
    return tenders

def push_supabase(rows):
    if not rows: return 0
    url = f"{SUPABASE_URL}/rest/v1/tenders"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    inserted = 0
    for i in range(0, len(rows), 100):
        batch = rows[i:i+100]
        try:
            r = requests.post(url, headers=headers, json=batch, timeout=60)
            if r.status_code in (200, 201, 204):
                inserted += len(batch)
        except Exception as e:
            print(f"  Error: {e}", flush=True)
    return inserted

def main():
    print(f"[GEM START] {datetime.now()}", flush=True)
    all_rows = []
    for page in range(1, 51):
        data = fetch_gem(page)
        if not data:
            break
        batch = parse_gem_json(data, page)
        if not batch:
            break
        all_rows.extend(batch)
        if page % 10 == 0:
            print(f"  Page {page}, total {len(all_rows)}", flush=True)
        time.sleep(2)
    print(f"[SCRAPED] {len(all_rows)} from GeM", flush=True)
    unique = {t["source_url"]: t for t in all_rows}
    ins = push_supabase(list(unique.values()))
    print(f"[DONE] Inserted {ins}", flush=True)

if __name__ == "__main__":
    main()
