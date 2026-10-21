import requests, psycopg2, time
from datetime import datetime
from psycopg2.extras import execute_values

with open('/opt/bidwell/.parse_env') as f:
    api_key = f.read().split('=')[1].strip()

base_url = 'https://api.parse.bot/scraper/abb87e50-3d46-43a2-a900-2c9ec9928084/list_tenders_by_closing_date'
headers = {
    'X-API-Key': api_key,
    'API-Snapshot-Version': '5'
}

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

def parse_date(s):
    if not s: return None
    try:
        # Format: '10-Oct-2026 01:00 PM'
        return datetime.strptime(s.strip(), '%d-%b-%Y %I:%M %p')
    except:
        return None

total_inserted = 0
# API response me 13 pages aaye the
for page in range(1, 14): 
    print(f'Fetching Maharashtra Page {page}...', flush=True)
    url = f'{base_url}?page={page}'
    
    try:
        res = requests.get(url, headers=headers, timeout=60)
        if res.status_code != 200:
            print(f'Error on page {page}: {res.status_code}')
            break
            
        data = res.json()
        tenders = data.get('data', {}).get('tenders', [])
        
        if not tenders:
            print('No more tenders found.')
            break
            
        batch = []
        for t in tenders:
            batch.append((
                'MAHARASHTRA', # source
                t.get('tender_id'),
                t.get('title', '')[:2000],
                'Maharashtra', # state
                parse_date(t.get('e_published_date')),
                parse_date(t.get('bid_submission_closing_date')),
                t.get('detail_url'),
                'active'
            ))
            
        execute_values(cur, '''
            INSERT INTO active_tenders (source, source_tender_id, title, state, published_date, closing_date, source_url, status)
            VALUES %s
            ON CONFLICT (source, source_tender_id) DO UPDATE SET
                title = EXCLUDED.title,
                closing_date = EXCLUDED.closing_date,
                last_seen_at = NOW()
        ''', batch)
        
        inserted = cur.rowcount
        conn.commit()
        total_inserted += inserted
        print(f'Page {page}: Inserted/Updated {inserted} tenders.')
        
        time.sleep(2) # Rate limit
        
    except Exception as e:
        print(f'Exception on page {page}: {e}')
        break

print(f'[DONE] Total tenders processed: {total_inserted}')
cur.close()
conn.close()
