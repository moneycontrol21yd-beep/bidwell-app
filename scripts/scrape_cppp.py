import os, re, time, base64, requests
from datetime import datetime
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Linux; Android 13) Chrome/120.0"}
SUPABASE_URL = "https://mvelgzwtopfanrrdtxoo.supabase.co"
# Yahan apni Supabase Anon Key daalna (NEXT_PUBLIC_SUPABASE_ANON_KEY)
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZWxnend0b3BmYW5ycmR0eG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2NjM5MywiZXhwIjoyMTA2NDQyMzkzfQ.ukPKWb6T7cKqc0Xsu6jrEsHNJe-lXb8Y3dU9EQSQauM"

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
    return "All India" # Central tenders default

def push_supabase(rows):
    if not rows: return 0
    url = f"{SUPABASE_URL}/rest/v1/tenders?on_conflict=source_url" # Unique key handling
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
                print(f"Error {r.status_code}: {r.text}")
        except Exception as e:
            print(f"Network error: {e}")
    return inserted

def get_page(session, page_num):
    inner = f"page={page_num}"
    enc = base64.b64encode(inner.encode()).decode()
    url = f"https://eprocure.gov.in/cppp/latestactivetendersnew/cpppdata?url={enc}"
    try:
        r = session.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            return r.text
    except:
        pass
    return None

def parse(html):
    soup = BeautifulSoup(html, "lxml")
    tenders = []
    for table in soup.find_all("table"):
        for row in table.find_all("tr"):
            cells = row.find_all("td")
            if len(cells) < 5: continue
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
            if len(title) < 30: continue
            
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
                    
            if link.strip() in ["https://eprocure.gov.in", "https://eprocure.gov.in/", "https://eprocure.gov.in/cppp/latestactivetendersnew/"]: continue
            if not link.startswith("http"):
                link = "https://eprocure.gov.in" + link if link.startswith("/") else ""
            if not link: continue
            
            actual_state = detect_state(title + " " + org)
            
            tenders.append({
                "title": title[:350],
                "department": org,
                "deadline": deadline or None,
                "source": "CPPP",
                "source_url": link,
                "status": "active",
                "state": actual_state
            })
    return tenders

def main():
    s = requests.Session()
    s.headers.update(HEADERS)
    all_tenders = []
    print(f"[START] {datetime.now()}", flush=True)

    consecutive_empty = 0
    for page in range(1, 301):  # Reduced from 500 to 300
        html = get_page(s, page)
        if not html:
            consecutive_empty += 1
            if consecutive_empty >= 5:
                print(f"[STOP] 5 empty pages, breaking at page {page}", flush=True)
                break
            continue
        consecutive_empty = 0
        batch = parse(html)
        if not batch:
            consecutive_empty += 1
            if consecutive_empty >= 5:
                print(f"[STOP] 5 empty parses, breaking at page {page}", flush=True)
                break
            continue
        all_tenders.extend(batch)

        # Push every 50 pages to save progress
        if page % 50 == 0:
            unique = {t["source_url"]: t for t in all_tenders}
            ins = push_supabase(list(unique.values()))
            print(f"[PAGE {page}] Pushed {ins}, total scraped {len(all_tenders)}", flush=True)
            all_tenders = []  # reset to avoid double push

        time.sleep(1)  # 1 sec delay instead of 2

    # Final push
    if all_tenders:
        unique = {t["source_url"]: t for t in all_tenders}
        push_supabase(list(unique.values()))

    print(f"[DONE] {datetime.now()}", flush=True)

if __name__ == "__main__":
    main()
