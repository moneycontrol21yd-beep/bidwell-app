import os, sqlite3, json, io, time
from huggingface_hub import hf_hub_download
import psycopg2

NEON_URL = os.environ["NEON_URL"]

print("[1/4] Downloading...")
path = hf_hub_download(repo_id="fireboy21/tenders_aoc", filename="aoc_tenders.db", repo_type="dataset", local_dir="/tmp/data")
print(f"Downloaded: {os.path.getsize(path)//1024//1024} MB")

print("[2/4] Connecting Neon...")
conn = psycopg2.connect(NEON_URL, connect_timeout=60)
cur = conn.cursor()
cur.execute("""ALTER TABLE brain_awards ADD COLUMN IF NOT EXISTS product_category TEXT, ADD COLUMN IF NOT EXISTS product_sub_category TEXT, ADD COLUMN IF NOT EXISTS tender_category TEXT, ADD COLUMN IF NOT EXISTS completion_period TEXT, ADD COLUMN IF NOT EXISTS description TEXT;""")
cur.execute("""CREATE TABLE IF NOT EXISTS brain_staging (tender_id TEXT PRIMARY KEY, product_category TEXT, product_sub_category TEXT, tender_category TEXT, completion_period TEXT, description TEXT);""")
cur.execute("TRUNCATE brain_staging")
conn.commit()
print("Tables ready")

print("[3/4] Streaming...")
sq = sqlite3.connect(path)
cur_sq = sq.cursor()
cur_sq.execute("""SELECT t.tender_id, d.details_json FROM aoc_tenders t JOIN aoc_details d ON t.tender_id = d.tender_id""")
total = 0; chunk_n = 0
while True:
    rows = cur_sq.fetchmany(10000)
    if not rows: break
    chunk_n += 1
    buf = io.StringIO(); cnt = 0
    for tid, dj in rows:
        try:
            d = json.loads(dj)
            tid = (tid or "").replace("\t"," ").replace("\n"," ").strip()
            if not tid: continue
            pc=(d.get('Product Category') or '')[:200]; psc=(d.get('Product Sub-Category') or '')[:200]
            tc=(d.get('Tender Category') or '')[:100]; cp=(d.get('Date of Completion/Completion Period in Days') or '')[:100]
            desc=(d.get('Tender Description') or '')[:1000]
            for v in [pc,psc,tc,cp,desc]:
                v=v.replace("\t"," ").replace("\n"," ")
            buf.write(f"{tid}\t{pc}\t{psc}\t{tc}\t{cp}\t{desc}\n")
            cnt += 1
        except: continue
    if cnt == 0: continue
    for a in range(3):
        try:
            buf.seek(0)
            cur.copy_from(buf, 'brain_staging', columns=('tender_id','product_category','product_sub_category','tender_category','completion_period','description'), null='')
            conn.commit(); total += cnt; break
        except Exception as e:
            print(f"retry {a+1}: {str(e)[:80]}")
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
