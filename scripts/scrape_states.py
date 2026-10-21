import os, re, sys, time, requests, urllib3
from datetime import datetime
from bs4 import BeautifulSoup

urllib3.disable_warnings()
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
    "Connection": "close",
}

STATES = {
    "Maharashtra": "https://mahatenders.gov.in",
    "Uttar Pradesh": "https://etender.up.nic.in",
    "Madhya Pradesh": "https://mptenders.gov.in",
    "Rajasthan": "https://eproc.rajasthan.gov.in",
    "West Bengal": "https://wbtenders.gov.in",
    "Kerala": "https://etenders.kerala.gov.in",
    "Tamil Nadu": "https://tntenders.gov.in",
    "Haryana": "https://etenders.hry.nic.in",
    "Punjab": "https://eproc.punjab.gov.in",
    "Odisha": "https://tendersodisha.gov.in",
    "Jharkhand": "https://jharkhandtenders.gov.in",
    "Uttarakhand": "https://uktenders.gov.in",
    "Himachal Pradesh": "https://hptenders.gov.in",
    "Assam": "https://assamtenders.gov.in",
    "Bihar": "https://eproc2.bihar.gov.in",
    "Gujarat": "https://tender.gujarat.gov.in",
    "Karnataka": "https://eproc.karnataka.gov.in",
}

def parse_tenders(html, state_name):
    soup = BeautifulSoup(html, "lxml")
    tenders = []
    for table in soup.find_all("table"):
        for row in table.find_all("tr"):
            cells = row.find_all("td")
            if len(cells) < 5:
                continue
            texts = [c.get_text(" ", strip=True) for c in cells]
            texts = [t for t in texts if t]
            title, link = "", ""
            for i in [4, 3, 5, 2]:
                if i < len(cells):
                    t = cells[i].get_text(" ", strip=True)
                    if 30 < len(t) < 600:
                        a = cells[i].find("a")
                        title = t
                        if a and a.get("href"):
                            link = a["href"]
                        break
            if len(title) < 30:
                continue
            tl = title.lower()
            if any(j in tl for j in ["as per order", "guide line", "circular", "corrigendum"]):
                continue
            dates = [t for t in texts if re.match(r"^\d{2}[-/]\d{2}[-/]\d{4}", t)]
            deadline = dates[1] if len(dates) > 1 else (dates[0] if dates else "")
            org = ""
            for t in texts:
                if t != title and 5 < len(t) < 200 and not re.match(r"^\d", t):
                    org = t[:150]
                    break
            if link.startswith("/"):
                link = "https://eprocure.gov.in" + link
            elif not link.startswith("http"):
                continue
            tenders.append({
                "title": title[:350],
                "department": org,
                "deadline": deadline or None,
                "source": state_name,
                "source_url": link,
                "status": "active",
                "state": state_name,
            })
    return tenders

def fetch_state(state_name, base, session):
    url = f"{base}/nicgep/app?page=FrontEndLatestActiveTenders&service=page"
    try:
        r = session.get(url, timeout=15, verify=False, allow_redirects=True)
        if r.status_code != 200:
            return []
        return parse_tenders(r.text, state_name)
    except Exception as e:
        print(f"  [FAIL] {state_name}: {type(e).__name__}", flush=True)
        return []

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
            r = requests.post(url, headers=headers, json=batch, timeout=30)
            if r.status_code in (200, 201, 204):
                inserted += len(batch)
        except Exception as e:
            print(f"  push err: {e}", flush=True)
    return inserted

def main():
    # Single state mode (from GitHub Actions matrix)
    target_state = sys.argv[1] if len(sys.argv) > 1 else None

    print(f"[START] {datetime.now()}", flush=True)
    all_rows = []
    session = requests.Session()
    session.headers.update(HEADERS)

    if target_state:
        if target_state not in STATES:
            print(f"[SKIP] Unknown state: {target_state}", flush=True)
            return
        items = [(target_state, STATES[target_state])]
    else:
        items = STATES.items()

    for state, base in items:
        print(f"[{state}]...", flush=True)
        batch = fetch_state(state, base, session)
        print(f"  Found {len(batch)}", flush=True)
        all_rows.extend(batch)
        time.sleep(1)

    print(f"\n[SCRAPED] {len(all_rows)} total", flush=True)
    unique = {t["source_url"]: t for t in all_rows if t["source_url"]}
    ins = push_supabase(list(unique.values()))
    print(f"[DONE] Inserted {ins}", flush=True)

if __name__ == "__main__":
    main()
