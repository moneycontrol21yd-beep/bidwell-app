import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

BASE_URL = "https://eprocure.gov.in/cppp/latestactivetendersnew/cpppdata"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Referer": BASE_URL
}

def fetch_page(page):
    session = requests.Session()
    tenders = []
    try:
        if page == 1:
            res = session.get(BASE_URL, headers=HEADERS, timeout=25)
        else:
            res = session.post(BASE_URL, data={"page": str(page)}, headers=HEADERS, timeout=25)

        if res.status_code != 200:
            return tenders

        soup = BeautifulSoup(res.text, 'html.parser')
        table = soup.find('table', {'id': 'table'}) or soup.find('table', {'class': 'list_table'}) or soup.find('table')

        if not table:
            return tenders

        rows = table.find_all('tr')[1:]
        for row in rows:
            cols = row.find_all('td')
            if len(cols) >= 6:
                title_col = cols[4]
                title = title_col.text.strip()
                link_tag = title_col.find('a')
                link = link_tag['href'] if link_tag and link_tag.has_attr('href') else ""
                if link and not link.startswith("http"):
                    link = "https://eprocure.gov.in" + link

                tenders.append({
                    "title": title,
                    "tender_id": cols[5].text.strip(),
                    "closing_date": cols[2].text.strip(),
                    "opening_date": cols[3].text.strip(),
                    "e_published_date": cols[1].text.strip(),
                    "link": link,
                    "source": "CPPP",
                    "scraped_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
    except Exception:
        pass
    return tenders

def scrape_mega_tenders(total_pages=1000, max_workers=10):
    print(f"[{datetime.now()}] 🚀 Launching 10,000+ All-India Tender Extraction Engine...")
    all_tenders = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(fetch_page, page): page for page in range(1, total_pages + 1)}
        
        completed = 0
        for future in as_completed(futures):
            completed += 1
            data = future.result()
            if data:
                all_tenders.extend(data)
            
            if completed % 50 == 0 or completed == total_pages:
                print(f"⚡ Fetched {completed}/{total_pages} pages | Total Tenders Collected: {len(all_tenders)}")

    # Save complete mega JSON
    filename = "latest_tenders.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(all_tenders, f, indent=4, ensure_ascii=False)

    print(f"\n[{datetime.now()}] 🎉 MEGA EXTRACTION FINISHED!")
    print(f"🔥 TOTAL TENDERS SAVED: {len(all_tenders)}")

if __name__ == "__main__":
    scrape_mega_tenders(total_pages=1000, max_workers=10)
