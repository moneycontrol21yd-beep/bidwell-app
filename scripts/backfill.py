import os, sqlite3, json, psycopg2
from huggingface_hub import hf_hub_download
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
print('[DL] Downloading SQLite...', flush=True)
path = hf_hub_download(repo_id='fireboy21/tenders_aoc', filename='aoc_tenders.db', repo_type='dataset', local_dir='/tmp/data', resume_download=True)
print(f'[DL] Size: {os.path.getsize(path)//1024//1024} MB', flush=True)
sq = sqlite3.connect(path); cq = sq.cursor()
cq.execute('SELECT t.tender_id, d.details_json FROM aoc_tenders t LEFT JOIN aoc_details d ON t.tender_id = d.tender_id')
cn = psycopg2.connect(DB, connect_timeout=60); cu = cn.cursor()
updated = 0; total = 0
while True:
    rows = cq.fetchmany(5000)
    if not rows: break
    for tid, dj in rows:
        total += 1
        if not tid or not dj: continue
        try:
            d = json.loads(dj)
            val = d.get('Contract Value') or '0'
            try: val = float(str(val).replace(',', '').replace(chr(8377), '').strip())
            except: val = 0
            if val > 0:
                cu.execute('UPDATE brain_awards SET contract_value = %s, value_missing = FALSE WHERE tender_id = %s AND contract_value = 0', (val, tid))
                updated += cu.rowcount
        except: continue
    if total % 100000 == 0:
        cn.commit()
        print(f'Processed: {total}, Updated: {updated}', flush=True)
cn.commit()
print(f'[DONE] Total processed: {total}, Updated: {updated}', flush=True)
cu.close(); cn.close()
