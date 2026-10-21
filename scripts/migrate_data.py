import os, sqlite3, json, io, time
from huggingface_hub import hf_hub_download
import psycopg2

# VPS PostgreSQL credentials
NEON_URL = "postgresql://bidwell:bidwell2026@localhost:5432/brain"

print("[1/4] Downloading aoc_tenders.db (6.3 GB)...")
path = hf_hub_download(
    repo_id="fireboy21/tenders_aoc",
    filename="aoc_tenders.db",
    repo_type="dataset",
    local_dir="/tmp/data"
)
print(f"✅ Downloaded: {os.path.getsize(path)//1024//1024} MB")

print("[2/4] Connecting PostgreSQL...")
conn = psycopg2.connect(NEON_URL, connect_timeout=60)
cur = conn.cursor()

# Truncate (fresh start)
cur.execute("TRUNCATE brain_awards")
conn.commit()
print("✅ Table cleared")

print("[3/4] Streaming data...")
sq = sqlite3.connect(path)
cur_sq = sq.cursor()
cur_sq.execute("""
    SELECT t.tender_id, t.title, t.org_name, t.portal_type, t.aoc_date,
           d.details_json
    FROM aoc_tenders t
    LEFT JOIN aoc_details d ON t.tender_id = d.tender_id
""")

CHUNK = 10000
total = 0
chunk_n = 0

while True:
    rows = cur_sq.fetchmany(CHUNK)
    if not rows:
        break
    chunk_n += 1
    buf = io.StringIO()
    cnt = 0
    for tid, title, org, portal, aoc_date, dj in rows:
        try:
            d = json.loads(dj) if dj else {}
            winner = (d.get("Name of the selected bidder(s)") or "").strip()
            val = d.get("Contract Value") or "0"
            try:
                val = float(str(val).replace(",", "").replace("₹", "").strip())
            except:
                val = 0
            bids = 0
            try:
                bids = int(str(d.get("Number of bids received") or "0"))
            except:
                bids = 0
            
            # Clean all values
            def clean(v):
                if not v: return ""
                return str(v).replace("\t"," ").replace("\n"," ").replace("\r"," ")[:1000]
            
            buf.write(f"{clean(tid)}\t{clean(title)}\t{clean(org)}\t{clean(portal)}\t{clean(aoc_date)}\t{clean(winner)}\t{val}\t{bids}\t{clean(d.get('Tender Type'))}\t{clean(d.get('Tender Document'))}\t{clean(d.get('Product Category'))}\t{clean(d.get('Product Sub-Category'))}\t{clean(d.get('Date of Completion/Completion Period in Days'))}\t{clean(d.get('Tender Description'))}\t\n")
            cnt += 1
        except:
            continue
    if cnt == 0: continue
    
    try:
        buf.seek(0)
        cur.copy_from(
            buf, 'brain_awards',
            columns=('tender_id','title','org_name','portal_type','aoc_date',
                    'winner_name','contract_value','bid_count','tender_type',
                    'source_url','product_category','product_sub_category',
                    'completion_period','description','state'),
            null=''
        )
        conn.commit()
        total += cnt
    except Exception as e:
        print(f"❌ Error: {str(e)[:150]}")
        try: conn.rollback()
        except: pass
        try: conn.close()
        except: pass
        time.sleep(3)
        conn = psycopg2.connect(NEON_URL, connect_timeout=60)
        cur = conn.cursor()
    
    if chunk_n % 10 == 0:
        print(f"  Chunk {chunk_n}: {total:,} rows")
    del buf, rows

print(f"\n✅ MIGRATION DONE! Total: {total:,} rows")
