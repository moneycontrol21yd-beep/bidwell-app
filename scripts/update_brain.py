import os, sqlite3, json, io, time
from huggingface_hub import hf_hub_download
import psycopg2

NEON_URL = os.environ["NEON_URL"]

def clean(v):
    if not v: return ""
    return str(v).replace("\t"," ").replace("\n"," ").replace("\r"," ").strip()

print("[1/4] Downloading...")
path = hf_hub_download(repo_id="fireboy21/tenders_aoc", filename="aoc_tenders.db", repo_type="dataset", local_dir="/tmp/data")
print(f"Downloaded: {os.path.getsize(path)//1024//1024} MB")

print("[2/4] Connecting Neon...")
conn = psycopg2.connect(NEON_URL, connect_timeout=60)
cur = conn.cursor()
cur.execute("""ALTER TABLE brain_awards ADD COLUMN IF NOT EXISTS product_category TEXT, ADD COLUMN IF NOT EXISTS product_sub_category TEXT, ADD COLUMN IF NOT EXISTS tender_category TEXT, ADD COLUMN IF NOT EXISTS completion_period TEXT, ADD COLUMN IF NOT EXISTS description TEXT;""")
cur.execute("""DROP TABLE IF EXISTS brain_staging;""")
cur.execute("""CREATE TABLE brain_staging (tender_id TEXT PRIMARY KEY, product_category TEXT, product_sub_category TEXT, tender_category TEXT, completion_period TEXT, description TEXT);""")
conn.commit()
print("Tables ready")

print("[3/4] Streaming...")
sq = sqlite3.connect(path)
cur_sq = sq.cursor()
cur_sq.execute("""SELECT t.tender_id, d.details_json FROM aoc_tenders t JOIN aoc_details d ON t.tender_id = d.tender_id WHERE t.year >= 2025""")
total = 0; chunk_n = 0
while True:
    rows = cur_sq.fetchmany(10000)
    if not rows: break
    chunk_n += 1
    buf = io.StringIO(); cnt = 0
    for tid, dj in rows:
        try:
            d = json.loads(dj)
            tid = clean(tid)
            if not tid: continue
            buf.write(f"{tid}\t{clean(d.get('Product Category'))[:200]}\t{clean(d.get('Product Sub-Category'))[:200]}\t{clean(d.get('Tender Category'))[:100]}\t{clean(d.get('Date of Completion/Completion Period in Days'))[:100]}\t{clean(d.get('Tender Description'))[:1000]}\n")
            cnt += 1
        except: continue
    if cnt == 0: continue
    for a in range(3):
        try:
            buf.seek(0)
            cur.execute("CREATE TEMP TABLE tmp_stage (LIKE brain_staging INCLUDING ALL) ON COMMIT DROP")
            cur.copy_from(buf, 'tmp_stage', columns=('tender_id','product_category','product_sub_category','tender_category','completion_period','description'), null='')
            cur.execute("INSERT INTO brain_staging SELECT * FROM tmp_stage ON CONFLICT (tender_id) DO NOTHING")
            conn.commit(); total += cnt; break
        except Exception as e:
            print(f"retry {a+1}: {str(e)[:100]}")
            try: conn.rollback()
            except: pass
            try: conn.close()
            except: pass
            time.sleep(3)
            conn = psycopg2.connect(NEON_URL, connect_timeout=60); cur = conn.cursor()
    if chunk_n % 10 == 0: print(f"chunk {chunk_n}: {total:,}")
    del buf, rows
print(f"[STAGED] {total:,}")

print("[4/4] Updating...")
cur.execute("""UPDATE brain_awards a SET product_category=s.product_category, product_sub_category=s.product_sub_category, tender_category=s.tender_category, completion_period=s.completion_period, description=s.description FROM brain_staging s WHERE a.tender_id=s.tender_id""")
conn.commit()
print(f"[DONE] Updated: {cur.rowcount:,}")
cur.execute("DROP TABLE brain_staging")
conn.commit()
print("All done!")
