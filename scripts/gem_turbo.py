import requests, psycopg2, time
from bs4 import BeautifulSoup
from datetime import datetime
from psycopg2.extras import execute_values
import concurrent.futures

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

def fetch_total():
    cur.execute("SELECT COUNT(*) FROM active_tenders WHERE source = 'GEM'")
    return cur.fetchone()[0]

def parse_date(s):
    if not s: return None
    try: return datetime.strptime(s.strip(), '%d/%m/%Y %I:%M %p')
    except: return None

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch_page(page_no):
    url = f'https://bidplus.gem.gov.in/bidlists?bidlists&page_no={page_no}'
    try:
        res = requests.get(url, headers=headers, timeout=20)
        if res.status_code != 200: 
            print(f'Page {page_no} Error: {res.status_code}', flush=True)
            return []
            
        soup = BeautifulSoup(res.text, 'lxml')
        content = soup.find('div', {'id': 'pagi_content'})
        if not content or len(content) == 0: return []
            
        page_batch = []
        for idx in range(len(content)):
            if idx % 2 == 1:
                bid_text = content.contents[idx].text.strip().split('\n')
                if len(bid_text) < 18: continue
                    
                bid_no = bid_text[0].strip()
                items = bid_text[5].strip()
                dept = bid_text[10].strip() + ' ' + bid_text[12].strip()
                start_date = parse_date(bid_text[16])
                end_date = parse_date(bid_text[17])
                
                if not bid_no: continue
                page_batch.append((
                    'GEM', bid_no, items[:2000], dept[:500], 'India', 'General',
                    None, None, start_date, end_date, 'https://bidplus.gem.gov.in/all-bids', 'active'
                ))
        print(f'Fetched Page {page_no} | Found {len(page_batch)} bids', flush=True)
        return page_batch
    except Exception as e:
        print(f'Page {page_no} Failed: {e}', flush=True)
        return []

# Total 2000 pages, 5 parallel workers
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(fetch_page, page) for page in range(1, 2001)]
    
    for future in concurrent.futures.as_completed(futures):
        batch = future.result()
        if batch:
            try:
                execute_values(cur, '''
                    INSERT INTO active_tenders (source, source_tender_id, title, org_name, state, category, value, emd, published_date, closing_date, source_url, status)
                    VALUES %s
                    ON CONFLICT (source, source_tender_id) DO NOTHING
                ''', batch)
                inserted = cur.rowcount
                conn.commit()
                if inserted > 0:
                    print(f'✅ Inserted {inserted} new bids. Total GEM: {fetch_total()}', flush=True)
            except Exception as e:
                conn.rollback()
                print(f'DB Error: {e}', flush=True)
        time.sleep(0.5)

print('[DONE] Turbo Scraping Finished.')
cur.close()
conn.close()
