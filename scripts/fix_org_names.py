import requests, psycopg2, time

with open('/opt/bidwell/.parse_env') as f:
    api_key = f.read().split('=')[1].strip()

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

print('Fixing Maharashtra org_names...')
mh_url = 'https://api.parse.bot/scraper/abb87e50-3d46-43a2-a900-2c9ec9928084/list_tenders_by_closing_date'
for page in range(1, 14):
    res = requests.get(f'{mh_url}?page={page}', headers={'X-API-Key': api_key, 'API-Snapshot-Version': '5'})
    if res.status_code == 200:
        tenders = res.json().get('data', {}).get('tenders', [])
        for t in tenders:
            tid = t.get('tender_id')
            org = t.get('organisation_name')
            if org and tid:
                cur.execute('UPDATE active_tenders SET org_name = %s WHERE source_tender_id = %s', (org, tid))
        conn.commit()
    time.sleep(1)

print('Fixing UP org_names...')
base_url = 'https://api.parse.bot/scraper/ebc8e6a2-d9bf-40cb-bc03-6b5af7311831'
headers = {'X-API-Key': api_key}

res_org = requests.get(f'{base_url}/list_organisations', headers=headers)
orgs = res_org.json().get('data', {}).get('organisations', [])

for org_data in orgs:
    org_name = org_data.get('organisation_name')
    params = {'organisation': org_name, 'page': 1}
    res = requests.get(f'{base_url}/list_active_tenders', headers=headers, params=params)
    if res.status_code == 200:
        tenders = res.json().get('data', {}).get('tenders', [])
        for t in tenders:
            tid = t.get('tender_id')
            if org_name and tid:
                cur.execute('UPDATE active_tenders SET org_name = %s WHERE source_tender_id = %s', (org_name, tid))
        conn.commit()
    time.sleep(1)

print('✅ DONE! All org_names fixed.')
cur.close()
conn.close()
