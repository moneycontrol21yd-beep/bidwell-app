import sqlite3, json, psycopg2, re
from datetime import datetime

SQLITE = '/opt/bidwell/data/aoc_tenders.db'
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'

def parse_date(s):
    if not s: return None
    s = str(s).strip()
    for fmt in ('%d-%b-%Y %I:%M %p', '%d-%b-%Y', '%Y-%m-%d', '%d/%m/%Y'):
        try: return datetime.strptime(s, fmt)
        except: continue
    return None

def parse_value(v):
    if v is None or v == '': return None
    s = re.sub(r'[^\d.\-]', '', str(v))
    if not s: return None
    try:
        n = float(s)
        return n if n > 0 else None
    except: return None

def parse_int(v):
    if v is None or v == '': return None
    try:
        n = int(re.sub(r'[^\d\-]', '', str(v)))
        return n if n >= 0 else None
    except: return None

sq = sqlite3.connect(SQLITE)
cn = psycopg2.connect(DB, connect_timeout=60)
cu = cn.cursor()

cur = sq.execute('''SELECT t.internal_id, t.tender_id, t.portal_type, t.year,
                           t.aoc_date, t.title, t.org_name, t.detail_url, d.details_json
                    FROM aoc_tenders t
                    LEFT JOIN aoc_details d ON t.internal_id = d.internal_id
                    LIMIT 1000''')

inserted = 0
for r in cur.fetchall():
    (internal_id, tender_id, portal_type, year, aoc_date, title, org_name, detail_url, dj) = r
    if not tender_id: continue
    d = json.loads(dj) if dj else {}
    try:
        cu.execute('''INSERT INTO awards
            (tender_id, portal_type, year, aoc_date, title, org_name,
             tender_type, contract_date, contract_value, published_date,
             tender_doc_url, ref_no, description, bid_count,
             winner_name, winner_address, completion_period)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (tender_id) DO NOTHING''',
            (tender_id, portal_type, year,
             parse_date(aoc_date), title, org_name,
             d.get('Tender Type'), parse_date(d.get('Contract Date')),
             parse_value(d.get('Contract Value')), parse_date(d.get('Published Date')),
             detail_url or d.get('Tender Document'), d.get('Tender Ref. No.'),
             d.get('Tender Description'), parse_int(d.get('Number of bids received')),
             d.get('Name of the selected bidder(s)'), d.get('Address of the selected bidder(s)'),
             d.get('Date of Completion/Completion Period in Days')))
        inserted += cu.rowcount
    except Exception as e:
        print(f'FAIL {tender_id}: {e}')

cn.commit()
print(f'Inserted: {inserted}')
cu.close(); cn.close(); sq.close()
