import requests, psycopg2, time
from bs4 import BeautifulSoup
from datetime import datetime
from psycopg2.extras import execute_values
import hashlib

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
base_url = 'https://eprocure.gov.in/cppp/latestactivetenders'

for page in range(1, 100):
    print(f'Scraping CPPP Page {page}...', flush=True)
    url = f'{base_url}?page={page}'
    
    try:
        res = requests.get(url, headers=headers, timeout=20)
        if res.status_code != 200:
            break
            
        soup = BeautifulSoup(res.text, 'lxml')
        table = soup.find('table')
        if not table: break
            
        rows = table.find_all('tr')[1:]
        batch = []
        for row in rows:
            cols = row.find_all('td')
            if len(cols) < 6: continue
            
            title = cols[2].text.strip()
            org = cols[3].text.strip()
            closing_str = cols[5].text.strip()
            
            # Generate unique ID from title + org
            tid_hash = hashlib.md5((title + org).encode()).hexdigest()[:16]
            tid = f'CPPP-{tid_hash}'
            
            try: closing_date = datetime.strptime(closing_str, '%d-%b-%Y %I:%M %p')
            except: closing_date = None
                
            batch.append(('CPPP', tid, title[:2000], org[:500], 'India', 'General', None, None, None, closing_date, 'https://eprocure.gov.in/cppp/', 'active'))
            
        if batch:
            execute_values(cur, '''
                INSERT INTO active_tenders (source, source_tender_id, title, org_name, state, category, value, emd, published_date, closing_date, source_url, status)
                VALUES %s
                ON CONFLICT (source, source_tender_id) DO NOTHING
            ''', batch)
            conn.commit()
            print(f'✅ Inserted {cur.rowcount} new CPPP tenders.', flush=True)
            
        time.sleep(2)
        
    except Exception as e:
        print(f'Error: {e}')
        time.sleep(5)

print('DONE')
cur.close()
conn.close()
