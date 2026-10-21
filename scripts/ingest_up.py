import requests, psycopg2, time
from datetime import datetime
from psycopg2.extras import execute_values

with open('/opt/bidwell/.parse_env') as f:
    api_key = f.read().split('=')[1].strip()

base_url = 'https://api.parse.bot/scraper/ebc8e6a2-d9bf-40cb-bc03-6b5af7311831'
headers = {'X-API-Key': api_key}

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

def parse_date(s):
    if not s: return None
    try:
        # Format: '27-Oct-2026 05:00 PM'
        return datetime.strptime(s.strip(), '%d-%b-%Y %I:%M %p')
    except:
        return None

print('Fetching UP Organisations...', flush=True)
res_org = requests.get(f'{base_url}/list_organisations', headers=headers, timeout=30)
orgs = res_org.json().get('data', {}).get('organisations', [])
print(f'Total orgs to process: {len(orgs)}', flush=True)

total_inserted = 0

for i, org in enumerate(orgs):
    org_name = org.get('organisation_name')
    print(f'[{i+1}/{len(orgs)}] Fetching: {org_name}...', end=' ', flush=True)
    
    params = {'organisation': org_name, 'page': 1}
    try:
        res = requests.get(f'{base_url}/list_active_tenders', headers=headers, params=params, timeout=30)
        if res.status_code == 200:
            data = res.json().get('data', {})
            tenders = data.get('tenders', [])
            
            if not tenders:
                print('0 tenders.')
                continue
                
            batch = []
            for t in tenders:
                batch.append((
                    'UP', # source
                    t.get('tender_id'),
                    t.get('title', '')[:2000],
                    'Uttar Pradesh', # state
                    parse_date(t.get('published_date')),
                    parse_date(t.get('closing_date')),
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
            print(f'✅ {inserted} tenders.')
        else:
            print(f'❌ Error {res.status_code}')
            
        time.sleep(1) # Rate limit
        
    except Exception as e:
        print(f'Exception: {e}')

print(f'[DONE] Total tenders processed for UP: {total_inserted}')
cur.close()
conn.close()
