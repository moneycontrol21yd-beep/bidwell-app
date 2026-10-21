import requests, psycopg2, time
from bs4 import BeautifulSoup
from datetime import datetime
from psycopg2.extras import execute_values

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

def parse_date(s):
    if not s: return None
    try:
        return datetime.strptime(s.strip(), '%d/%m/%Y %I:%M %p')
    except:
        return None

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for page_no in range(1, 2001):
    print(f'Scraping Page {page_no}...', flush=True)
    url = f'https://bidplus.gem.gov.in/bidlists?bidlists&page_no={page_no}'
    
    try:
        res = requests.get(url, headers=headers, timeout=30)
        if res.status_code != 200:
            time.sleep(10)
            continue
            
        soup = BeautifulSoup(res.text, 'lxml')
        content = soup.find('div', {'id': 'pagi_content'})
        
        if not content or len(content) == 0:
            print('No more bids found.')
            break
            
        batch = []
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
                    
                batch.append((
                    'GEM', bid_no, items[:2000], dept[:500], 'India', 'General',
                    None, None, start_date, end_date, 'https://bidplus.gem.gov.in/all-bids', 'active'
                ))

        if batch:
            execute_values(cur, '''
                INSERT INTO active_tenders (source, source_tender_id, title, org_name, state, category, value, emd, published_date, closing_date, source_url, status)
                VALUES %s
                ON CONFLICT (source, source_tender_id) DO NOTHING
            ''', batch)
            inserted = cur.rowcount
            conn.commit()
            print(f'✅ Inserted {inserted} new bids.', flush=True)
        else:
            print('No valid data in this page.', flush=True)
            
        time.sleep(2)
        
    except Exception as e:
        print(f'Exception: {e}')
        time.sleep(5)

print('[DONE] GeM Overnight Scraping Finished.')
cur.close()
conn.close()
