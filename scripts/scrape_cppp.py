import os, re, time, base64, requests
from datetime import datetime
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Linux; Android 13) Chrome/120.0"}
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

def push_supabase(rows):
    if not rows:
        return 0
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
            else:
                print(f"Push error {r.status_code}: {r.text[:200]}", flush=True)
        except Exception as e:
            print(f"Batch error: {e}", flush=True)
    return inserted

def get_page(session, page_num):
    inner = f"page={page_num}"
    enc = base64.b64encode(inner.encode()).decode()
    url = f"https://eprocure.gov.in/cppp/latestactivetendersnew/cpppdata?url={enc}"
    try:
        r = session.get(url, headers=HEADERS, timeout=60)
        if r.status_code == 200:
            return r.text
    except Exception:
        pass
    return None

def parse(html):
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
            if any(j in tl for j in ["as per order", "guide line", "circular", "notice", "corrigendum", "screen reader", "click here"]):
                continue
            dates = [t for t in texts if re.match(r"^\d{2}[-/]\d{2}[-/]\d{4}", t)]
            deadline = dates[1] if len(dates) > 1 else (dates[0] if dates else "")
            org = ""
            for t in texts:
                if t != title and 5 < len(t) < 200 and not re.match(r"^\d", t):
                    org = t[:150]
                    break
            if not link.startswith("http"):
                link = "https://eprocure.gov.in" + link if link.startswith("/") else ""
            if not link:
                continue
            tenders.append({
                "title": title[:350],
                "department": org,
                "deadline": deadline or None,
                "source": "CPPP",
                "source_url": link,
                "status": "active",
            })
    return tenders

def main():
    s = requests.Session()
    s.headers.update(HEADERS)
    all_tenders = []
    print(f"[START] {datetime.now()}", flush=True)
    for page in range(1, 501):
        html = get_page(s, page)
        if not html:
            print(f"[STOP] Page {page} empty", flush=True)
            break
        batch = parse(html)
        all_tenders.extend(batch)
        if page % 50 == 0:
            print(f"[PROGRESS] Page {page}, total {len(all_tenders)}", flush=True)
        time.sleep(2)
    print(f"[SCRAPED] {len(all_tenders)} tenders", flush=True)
    unique = {}
    for t in all_tenders:
        unique[t["source_url"]] = t
    rows = list(unique.values())
    ins = push_supabase(rows)
    print(f"[DONE] Inserted {ins} to Supabase", flush=True)

if __name__ == "__main__":
    main()
