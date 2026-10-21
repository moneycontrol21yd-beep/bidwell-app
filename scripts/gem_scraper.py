import requests, re, json, time
from datetime import datetime
from bs4 import BeautifulSoup
import psycopg2

DB_URL = "postgresql://bidwell:bidwell2026@localhost:5432/brain"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
}

def get_csrf_token(session):
    """Fetch GeM page and extract CSRF token"""
    try:
        r = session.get("https://bidplus.gem.gov.in/all-bids", headers=HEADERS, timeout=30)
        if r.status_code != 200:
            print(f"  CSRF page status: {r.status_code}")
            return None
        # Look for csrf token in meta or form
        match = re.search(r'name=["\']csrf_test_name["\']\s+value=["\']([^"\']+)', r.text)
        if not match:
            match = re.search(r'"csrf_test_name"\s*:\s*"([^"]+)"', r.text)
        if match:
            return match.group(1)
        return None
    except Exception as e:
        print(f"  CSRF error: {e}")
        return None

def fetch_bids_page(session, csrf, page=1):
    """Fetch bids list from GeM"""
    url = "https://bidplus.gem.gov.in/all-bids-data"
    data = {
        "page": page,
        "param": "",
        "filter": "",
        "searchBid": "",
        "searchType": "fullText",
        "csrf_test_name": csrf or "",
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
            print(f"  Page {page} status: {r.status_code}")
            return None
        try:
            return r.json()
        except:
            return None
    except Exception as e:
        print(f"  Page {page} error: {e}")
        return None

def parse_bid(item):
    """Parse single bid JSON into our schema"""
    try:
        bid_id = item.get("b_id", "") or item.get("id", "")
        title = item.get("b_category_name", "") or item.get("b_title", "") or item.get("b_bid_number", "")
        dept = item.get("ba_official_details_deptName", "") or item.get("b_department", "") or "GeM"
        end_date = item.get("b_end_date", "") or item.get("b_bid_end_date", "")
        
        if not title or len(title) < 5:
            return None
        
        url = f"https://bidplus.gem.gov.in/showbidDocument/{bid_id}" if bid_id else ""
        if not url:
            return None
        
        return {
            "tender_id": f"gem_{bid_id}",
            "title": title[:500],
            "org_name": dept[:300],
            "portal_type": "GeM",
            "aoc_date": end_date or None,
            "winner_name": "",
            "contract_value": 0,
            "bid_count": 0,
            "tender_type": "Goods",
            "source_url": url,
            "product_category": "",
            "product_sub_category": "",
            "completion_period": "",
            "description": title[:500],
            "state": "",
        }
    except:
        return None

def push_to_db(rows):
    if not rows:
        return 0
    try:
        conn = psycopg2.connect(DB_URL, connect_timeout=30)
        cur = conn.cursor()
        inserted = 0
        for r in rows:
            try:
                cur.execute("""
                    INSERT INTO brain_awards 
                    (tender_id, title, org_name, portal_type, aoc_date, winner_name,
                     contract_value, bid_count, tender_type, source_url,
                     product_category, product_sub_category, completion_period, description, state)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (tender_id) DO NOTHING
                """, (
                    r["tender_id"], r["title"], r["org_name"], r["portal_type"],
                    r["aoc_date"], r["winner_name"], r["contract_value"], r["bid_count"],
                    r["tender_type"], r["source_url"], r["product_category"],
                    r["product_sub_category"], r["completion_period"], r["description"], r["state"]
                ))
                inserted += cur.rowcount
            except Exception as e:
                continue
        conn.commit()
        cur.close()
        conn.close()
        return inserted
    except Exception as e:
        print(f"  DB error: {e}")
        return 0

def main():
    print(f"[GEM START] {datetime.now()}")
    session = requests.Session()
    csrf = get_csrf_token(session)
    print(f"CSRF: {'found' if csrf else 'not found'}")
    
    all_rows = []
    for page in range(1, 21):
        print(f"Fetching page {page}...")
        data = fetch_bids_page(session, csrf, page)
        if not data:
            print(f"  Page {page} failed")
            break
        
        docs = data.get("docs", []) if isinstance(data, dict) else []
        if not docs:
            print(f"  No docs on page {page}")
            break
        
        for item in docs:
            row = parse_bid(item)
            if row:
                all_rows.append(row)
        
        print(f"  Page {page}: {len(docs)} bids (total {len(all_rows)})")
        time.sleep(2)
    
    print(f"\n[SCRAPED] {len(all_rows)} total GeM bids")
    
    # Deduplicate
    seen = set()
    unique = []
    for r in all_rows:
        if r["tender_id"] not in seen:
            seen.add(r["tender_id"])
            unique.append(r)
    
    print(f"[UNIQUE] {len(unique)} after dedup")
    inserted = push_to_db(unique)
    print(f"[DONE] Inserted {inserted} to database")

if __name__ == "__main__":
    main()
