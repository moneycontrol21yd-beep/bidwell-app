import requests, psycopg2, time
from datetime import datetime
from psycopg2.extras import execute_values

with open('/opt/bidwell/.parse_env') as f:
    api_key = f.read().split('=')[1].strip()

base_url = 'https://api.parse.bot/scraper/29570b37-410d-4b85-a51b-07d0c266c6d9/search_tenders'
headers = {'X-API-Key': api_key, 'API-Snapshot-Version': '1'}

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

def parse_iso_date(date_str):
    if not date_str: return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d %H:%M')
    except:
        return None

total_inserted = 0

# Hum 15 pages tak fetch karte hain
for page in range(1, 16):
    print(f'Fetching page {page}...', flush=True)
    
    url = f'{base_url}?list_type=active&page={page}'
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
                'CPPP',
                t.get('tender_id'),
                t.get('title', '')[:2000],
                t.get('organisation'),
                None, None, None, None,
                parse_iso_date(t.get('published_at')),
                parse_iso_date(t.get('bid_submission_closing_at')),
                'https://eprocure.gov.in/cppp/',
                'active'
            ))
            
        execute_values(cur, '''
            INSERT INTO active_tenders (source, source_tender_id, title, org_name, state, category, value, emd, published_date, closing_date, source_url, status)
            VALUES %s
            ON CONFLICT (source, source_tender_id) DO NOTHING
        ''', batch)
        
        inserted = cur.rowcount
        conn.commit()
        total_inserted += inserted
        print(f'Page {page}: Inserted {inserted} new tenders.')
        
        time.sleep(2)
        
    except Exception as e:
        print(f'Exception on page {page}: {e}')
        break

print(f'[DONE] Total new tenders inserted: {total_inserted}')
cur.close()
conn.close()
