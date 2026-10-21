import requests, re, time
from datetime import datetime
from bs4 import BeautifulSoup
import psycopg2

DB_URL = "postgresql://bidwell:bidwell2026@localhost:5432/brain"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
}

def get_page(session, page=1):
    """Fetch IREPS latest tenders"""
    url = f"https://www.ireps.gov.in/epsn/loadLatestTenders.do?page={page}"
    try:
        r = session.get(url, headers=HEADERS, timeout=30, verify=False)
        return r.text if r.status_code == 200 else None
    except Exception as e:
        print(f"  page {page} error: {e}")
        return None

def parse_page(html):
    soup = BeautifulSoup(html, "lxml")
    rows = []
    # IREPS uses tables with tender rows
    for table in soup.find_all("table"):
        for tr in table.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) < 4:
                continue
            texts = [t.get_text(" ", strip=True) for t in tds]
            texts = [t for t in texts if t]
            # Look for tender-like rows (title 30+ chars)
            title = ""
            link = ""
            for i, t in enumerate(texts):
                if 30 < len(t) < 600 and not t.isdigit():
                    a = tds[i].find("a")
                    if a and a.get("href"):
                        title = t
                        link = a["href"]
                        break
            if not title:
                continue
            if not link.startswith("http"):
                link = "https://www.ireps.gov.in" + link if link.startswith("/") else ""
            if not link:
                continue
            # Date
            dates = [t for t in texts if re.match(r"^\d{2}[-/]\d{2}[-/]\d{4}", t)]
            deadline = dates[-1] if dates else ""
            # Org
            org = ""
            for t in texts:
                if t != title and 5 < len(t) < 200 and not re.match(r"^\d", t):
                    org = t
                    break
            rows.append({
                "tender_id": f"ireps_{hash(link) % 10**12}",
                "title": title[:500],
                "org_name": (org or "Indian Railways")[:300],
                "portal_type": "IREPS",
                "aoc_date": deadline or None,
                "winner_name": "",
                "contract_value": 0,
                "bid_count": 0,
                "tender_type": "Works",
                "source_url": link,
                "product_category": "",
                "product_sub_category": "",
                "completion_period": "",
                "description": title[:500],
                "state": "",
            })
    return rows

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
            except:
                continue
        conn.commit()
        cur.close()
        conn.close()
        return inserted
    except Exception as e:
        print(f"  DB error: {e}")
        return 0

def main():
    import urllib3
    urllib3.disable_warnings()
    print(f"[IREPS START] {datetime.now()}")
    session = requests.Session()
    session.headers.update(HEADERS)
    all_rows = []
    for page in range(1, 11):
        print(f"Fetching page {page}...")
        html = get_page(session, page)
        if not html:
            break
        rows = parse_page(html)
        if not rows:
            print(f"  no rows on page {page}")
            break
        all_rows.extend(rows)
        print(f"  page {page}: {len(rows)} (total {len(all_rows)})")
        time.sleep(2)
    print(f"\n[SCRAPED] {len(all_rows)}")
    seen = set()
    unique = []
    for r in all_rows:
        if r["tender_id"] not in seen:
            seen.add(r["tender_id"])
            unique.append(r)
    print(f"[UNIQUE] {len(unique)}")
    inserted = push_to_db(unique)
    print(f"[DONE] Inserted {inserted}")

if __name__ == "__main__":
    main()
