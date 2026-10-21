import requests, psycopg2, time, json
from datetime import datetime
from psycopg2.extras import execute_values

url = 'https://gateway.pipeworx.io/v1/tools/india_search_tenders'
conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

def parse_date(s):
    if not s: return None
    try: return datetime.strptime(s.strip()[:19], '%Y-%m-%dT%H:%M:%S')
    except: return None

# 50+ Keywords covering all sectors
keywords = [
    'road', 'construction', 'security', 'manpower', 'furniture', 'IT', 'medical', 'cleaning', 'water', 'electrical', 
    'supply', 'printing', 'vehicle', 'safety', 'uniform', 'school', 'stationery', 'sports', 'garden', 'maintenance', 
    'repair', 'lab', 'cctv', 'network', 'catering', 'food', 'clothing', 'steel', 'cement', 'pipe', 
    'pump', 'machine', 'software', 'hardware', 'medicine', 'hospital', 'transport', 'insurance', 'consulting', 'training',
    'bridge', 'dam', 'irrigation', 'solar', 'renewable', 'railway', 'airport', 'port', 'sanitation', 'waste', 'mining', 'oil', 'gas'
]

# Available Portals in Pipeworx
portals = ['central', 'defence', 'maharashtra', 'uttar-pradesh', 'tamil-nadu', 'karnataka', 'gujarat', 'rajasthan', 'west-bengal', 'telangana', 'madhya-pradesh']

total_inserted = 0

for portal in portals:
    for keyword in keywords:
        print(f'Fetching: {keyword} in {portal}...', flush=True)
        
        payload = {
            'arguments': {
                'query': keyword,
                'portal': portal,
                'limit': 50 # Max limit per call
            }
        }
        
        try:
            res = requests.post(url, json=payload, timeout=30)
            if res.status_code != 200:
                print(f'  Error {res.status_code}')
                time.sleep(2)
                continue
                
            data = res.json()
            tenders = data.get('tenders', [])
            
            if not tenders: 
                time.sleep(1)
                continue
                
            batch = []
            for t in tenders:
                tid = t.get('tender_id')
                title = t.get('title', 'No Title')
                org = t.get('organisation', 'Unknown Org')
                close_date = parse_date(t.get('bid_submission_closes_at'))
                source_url = t.get('source_url', '')
                
                if not tid: continue
                
                batch.append((
                    portal.upper(), tid, title[:2000], org[:500], 'India', keyword.capitalize(),
                    None, None, None, close_date, source_url, 'active'
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
                if inserted > 0:
                    print(f'  ✅ Inserted {inserted} new tenders.', flush=True)
                    
            time.sleep(1) # 1 second delay to avoid rate limits
            
        except Exception as e:
            print(f'  Exception: {e}')
            time.sleep(3)

print(f'[DONE] Total new tenders inserted: {total_inserted}')
cur.close()
conn.close()
