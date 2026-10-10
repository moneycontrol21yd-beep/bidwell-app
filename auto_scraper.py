import requests
import json
from bs4 import BeautifulSoup
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# --- SUPABASE REST API CONFIG ---
SUPABASE_URL = "https://mvelgzwtopfanrrdtxoo.supabase.co"
SUPABASE_KEY = "Sb_publishable_gs-68TaywZkFvQ7sPNMstw_u1OkGh1A"

SUPABASE_API_URL = f"{SUPABASE_URL}/rest/v1/tenders"
SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

BASE_URL = "https://eprocure.gov.in/cppp/latestactivetendersnew/cpppdata"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": BASE_URL
}

def fetch_page(page):
    session = requests.Session()
    tenders = []
    try:
        res = session.get(BASE_URL, headers=HEADERS, timeout=25) if page == 1 else session.post(BASE_URL, data={"page": str(page)}, headers=HEADERS, timeout=25)
        if res.status_code != 200:
            return tenders
        
        soup = BeautifulSoup(res.text, "html.parser")
        table = soup.find("table", {"id": "table"}) or soup.find("table", {"class": "list_table"}) or soup.find("table")
        if not table:
            return tenders

        rows = table.find_all("tr")[1:]
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 6:
                title_col = cols[4]
                link_tag = title_col.find("a")
                link = link_tag["href"] if link_tag and link_tag.has_attr("href") else ""
                if link and not link.startswith("http"):
                    link = "https://eprocure.gov.in" + link

                tenders.append({
                    "title": title_col.text.strip(),
                    "tender_id": cols[5].text.strip(),
                    "closing_date": cols[2].text.strip(),
                    "opening_date": cols[3].text.strip(),
                    "e_published_date": cols[1].text.strip(),
                    "link": link,
                    "source": "CPPP"
                })
    except Exception:
        pass
    return tenders

def push_to_supabase_rest(batch):
    if batch:
        try:
            res = requests.post(SUPABASE_API_URL, headers=SUPABASE_HEADERS, data=json.dumps(batch), timeout=15)
            if res.status_code in [200, 201]:
                print(f"✅ Success: Synced {len(batch)} tenders to Supabase!")
            else:
                print(f"Sync issue: {res.status_code} - {res.text}")
        except Exception as e:
            print(f"API Error: {e}")

def run():
    print(f"[{datetime.now()}] 🚀 Launching Direct Sync to Supabase...")
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_page, page): page for page in range(1, 1001)}
        for future in as_completed(futures):
            data = future.result()
            if data:
                push_to_supabase_rest(data)

    print(f"\n[{datetime.now()}] 🎉 Direct App Sync Finished!")

if __name__ == "__main__":
    run()
