import sqlite3, psycopg2
from psycopg2.extras import execute_values
from datetime import datetime

SQLITE = '/opt/bidwell/data/hf/fireboy21_tenders_aoc/tenders_vps.db'
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
BATCH = 10000

def parse_date(s):
    if not s: return None
    s = str(s).strip()
    for fmt in ('%d-%b-%Y %I:%M %p', '%d-%b-%Y', '%Y-%m-%d', '%d/%m/%Y'):
        try: return datetime.strptime(s, fmt)
        except: continue
    return None

sq = sqlite3.connect(SQLITE)
cn = psycopg2.connect(DB, connect_timeout=60)
cu = cn.cursor()

print('Reading from SQLite...', flush=True)
cur = sq.execute('SELECT tender_id, portal_type, organisation_name, title, e_published_date, bid_submission_closing_date, detail_url, status FROM tenders')

total = 0
inserted = 0

while True:
    rows = cur.fetchmany(BATCH)
    if not rows: break
    
    batch_data = []
    for r in rows:
        total += 1
        tender_id = r[0]
        if not tender_id: continue
        
        source = r[1] or 'UNKNOWN'
        org = r[2]
        title = r[3]
        if not title: continue
        
        pub_date = parse_date(r[4])
        close_date = parse_date(r[5])
        url = r[6]
        status = r[7] if r[7] else 'active'
        
        batch_data.append((
            source, tender_id, title[:2000], org, None, None, None, None,
            pub_date, close_date, url, False, status
        ))
        
    if batch_data:
        try:
            execute_values(cu, '''
                INSERT INTO active_tenders (source, source_tender_id, title, org_name, state, category, value, emd, published_date, closing_date, source_url, detail_fetched, status)
                VALUES %s
                ON CONFLICT (source, source_tender_id) DO NOTHING
            ''', batch_data)
            inserted += cu.rowcount
            cn.commit()
        except Exception as e:
            cn.rollback()
            print(f'[ERROR] {e}', flush=True)
            
    if total % 100000 == 0:
        print(f'Processed: {total}, Inserted: {inserted}', flush=True)

print(f'[DONE] Total: {total}, Inserted: {inserted}', flush=True)
cu.close(); cn.close(); sq.close()
