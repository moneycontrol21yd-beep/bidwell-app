import os, sqlite3, psycopg2, io, time, json
from huggingface_hub import hf_hub_download
DB_URL = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
print('[DL START]', flush=True)
path = hf_hub_download(repo_id='fireboy21/tenders_aoc', filename='aoc_tenders.db', repo_type='dataset', local_dir='/tmp/data', resume_download=True)
print(f'Downloaded: {os.path.getsize(path)//1024//1024} MB', flush=True)
conn = psycopg2.connect(DB_URL, connect_timeout=60)
cur = conn.cursor()
# Plain temp table WITHOUT constraints
cur.execute('DROP TABLE IF EXISTS tmp_h')
cur.execute('CREATE TABLE tmp_h (tender_id TEXT, title TEXT, org_name TEXT, portal_type TEXT, aoc_date TEXT, winner_name TEXT, contract_value NUMERIC, bid_count INT, tender_type TEXT, source_url TEXT, product_category TEXT, product_sub_category TEXT, completion_period TEXT, description TEXT, state TEXT)')
conn.commit()
sq = sqlite3.connect(path)
cq = sq.cursor()
cq.execute('SELECT t.tender_id, t.title, t.org_name, t.portal_type, t.aoc_date, d.details_json FROM aoc_tenders t LEFT JOIN aoc_details d ON t.tender_id = d.tender_id WHERE t.year < 2024')
total = 0
chunk = 0
seen = set()
while True:
    rows = cq.fetchmany(10000)
    if not rows: break
    chunk += 1
    buf = io.StringIO(); cnt = 0
    for tid, title, org, portal, aoc, dj in rows:
        try:
            if not tid or tid in seen: continue
            seen.add(tid)
            d = json.loads(dj) if dj else {}
            winner = (d.get('Name of the selected bidder(s)') or '').strip()
            val = d.get('Contract Value') or '0'
            try: val = float(str(val).replace(',', '').replace(chr(8377), '').strip())
            except: val = 0
            try: bids = int(str(d.get('Number of bids received') or '0'))
            except: bids = 0
            def clean(v):
                if not v: return ''
                return str(v).replace(chr(9), ' ').replace(chr(10), ' ').replace(chr(13), ' ')[:1000]
            buf.write(clean(tid) + chr(9) + clean(title) + chr(9) + clean(org) + chr(9) + clean(portal) + chr(9) + clean(aoc) + chr(9) + clean(winner) + chr(9) + str(val) + chr(9) + str(bids) + chr(9) + clean(d.get('Tender Type')) + chr(9) + clean(d.get('Tender Document')) + chr(9) + clean(d.get('Product Category')) + chr(9) + clean(d.get('Product Sub-Category')) + chr(9) + clean(d.get('Date of Completion/Completion Period in Days')) + chr(9) + clean(d.get('Tender Description')) + chr(9) + chr(10))
            cnt += 1
        except: continue
    if cnt == 0: continue
    try:
        buf.seek(0)
        cur.execute('TRUNCATE tmp_h')
        cur.copy_from(buf, 'tmp_h', columns=('tender_id','title','org_name','portal_type','aoc_date','winner_name','contract_value','bid_count','tender_type','source_url','product_category','product_sub_category','completion_period','description','state'), null='')
        cur.execute('INSERT INTO brain_awards (tender_id, title, org_name, portal_type, aoc_date, winner_name, contract_value, bid_count, tender_type, source_url, product_category, product_sub_category, completion_period, description, state) SELECT tender_id, title, org_name, portal_type, aoc_date, winner_name, contract_value, bid_count, tender_type, source_url, product_category, product_sub_category, completion_period, description, state FROM tmp_h ON CONFLICT (tender_id) DO NOTHING')
        conn.commit(); total += cnt
    except Exception as e:
        print(f'err: {str(e)[:80]}', flush=True)
        try: conn.rollback()
        except: pass
    if chunk % 10 == 0: print(f'Chunk {chunk}: {total}', flush=True)
    del buf, rows
print(f'[DONE] {total} records', flush=True)
