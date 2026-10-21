import requests, psycopg2, time
from datetime import datetime
from psycopg2.extras import execute_values

with open('/opt/bidwell/.parse_env') as f:
    api_key = f.read().split('=')[1].strip()

base_url = 'https://api.parse.bot/scraper/e6207810-c4da-45c4-b6ea-024de7f6b7de/search_notices'
headers = {'X-API-Key': api_key, 'API-Snapshot-Version': '1'}

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

def parse_date(s):
    if not s: return None
    try:
        return datetime.strptime(s.strip()[:19], '%Y-%m-%d %H:%M:%S')
    except:
        return None

keywords = [
    'road', 'construction', 'security', 'manpower', 'furniture', 
    'IT', 'medical', 'cleaning', 'water', 'electrical', 
    'supply', 'printing', 'vehicle', 'safety', 'uniform', 
    'school', 'stationery', 'sports', 'garden', 'maintenance', 
    'repair', 'lab', 'cctv', 'network', 'catering', 
    'food', 'clothing', 'steel', 'cement', 'pipe', 
    'pump', 'machine', 'software', 'hardware', 'medicine', 
    'hospital', 'transport', 'insurance', 'consulting', 'training'
]

total_inserted = 0
request_count = 0

for keyword in keywords:
    print(f'--- Searching GeM for: {keyword} ---', flush=True)
    
    for page in range(1, 6):
        if request_count >= 200:
            break
            
        print(f'  Page {page}...', end=' ', flush=True)
        params = {'query': keyword, 'page': page}
        
        try:
            res = requests.get(base_url, headers=headers, params=params, timeout=60)
            request_count += 1
            
            if res.status_code == 429:
                print(f'Limit reached.')
                break
            elif res.status_code != 200:
                print(f'Error {res.status_code}')
                continue
                
            data = res.json().get('data', {})
            tenders = data.get('notices', [])
            
            if not tenders:
                print('0 tenders.')
                break
                
            batch = []
            for t in tenders:
                tid = t.get('bid_number') or t.get('reference_number') or t.get('id')
                title = t.get('description_title') or t.get('title') or f'GeM Tender for {keyword}'
                org = t.get('department_name') or t.get('organisation') or 'GeM Department'
                close_date = t.get('end_date') or t.get('bid_end_datetime')
                pub_date = t.get('start_date') or t.get('bid_start_datetime')
                detail_url = t.get('source_url') or t.get('detail_url') or 'https://bidplus.gem.gov.in/'
                
                if not tid: continue
                
                batch.append((
                    'GEM', tid, title[:2000], org[:500], 'India', keyword.capitalize(), 
                    None, None, parse_date(pub_date), parse_date(close_date), detail_url, 'active'
                ))
                
            if batch:
                execute_values(cur, '''
                    INSERT INTO active_tenders (source, source_tender_id, title, org_name, state, category, value, emd, published_date, closing_date, source_url, status)
                    VALUES %s
                    ON CONFLICT (source, source_tender_id) DO NOTHING
                ''', batch)
                
                inserted = cur.rowcount
                conn.commit()
                total_inserted += inserted
                print(f'{inserted} tenders.')
            else:
                print('No valid data.')
                
            time.sleep(1.5)
            
        except Exception as e:
            print(f'Exception: {e}')
            break
            
    if request_count >= 200:
        break

print(f'[DONE] Total GeM tenders inserted: {total_inserted}')
cur.close()
conn.close()
