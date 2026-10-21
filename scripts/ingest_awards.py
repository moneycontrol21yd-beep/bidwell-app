import sqlite3, json, psycopg2, sys, re
from datetime import datetime
from psycopg2.extras import execute_values

SQLITE = '/opt/bidwell/data/aoc_tenders.db'
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
BATCH = 5000

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

def qscore(r):
    s = 0
    if r.get('title'): s += 20
    if r.get('org_name'): s += 15
    if r.get('aoc_date'): s += 10
    if r.get('tender_id'): s += 5
    if r.get('contract_value') and r['contract_value'] > 0: s += 20
    if r.get('winner_name'): s += 15
    if r.get('bid_count') and r['bid_count'] > 0: s += 10
    if r.get('description'): s += 5
    return s

def main():
    print('[START] Connecting...', flush=True)
    sq = sqlite3.connect(SQLITE)
    cn = psycopg2.connect(DB, connect_timeout=60)
    cu = cn.cursor()
    print('[OK] Connected. Loading...', flush=True)

    query = '''SELECT t.internal_id, t.tender_id, t.portal_type, t.year,
                      t.aoc_date, t.closing_date, t.title, t.org_name,
                      t.detail_url, d.details_json
               FROM aoc_tenders t
               LEFT JOIN aoc_details d ON t.internal_id = d.internal_id'''

    cur = sq.execute(query)
    total = 0
    inserted = 0
    failed = 0

    while True:
        rows = cur.fetchmany(BATCH)
        if not rows: break
        batch_data = []
        for r in rows:
            total += 1
            try:
                (internal_id, tender_id, portal_type, year, aoc_date, closing_date,
                 title, org_name, detail_url, dj) = r
                if not tender_id:
                    failed += 1; continue
                d = json.loads(dj) if dj else {}
                rec = {
                    'tender_id': tender_id,
                    'portal_type': portal_type,
                    'year': year,
                    'aoc_date': parse_date(aoc_date),
                    'title': (title or d.get('Tender Description') or '')[:2000] or None,
                    'org_name': (org_name or d.get('Organisation Name') or '')[:500] or None,
                    'tender_type': d.get('Tender Type'),
                    'contract_date': parse_date(d.get('Contract Date')),
                    'contract_value': parse_value(d.get('Contract Value')),
                    'published_date': parse_date(d.get('Published Date')),
                    'tender_doc_url': detail_url or d.get('Tender Document'),
                    'ref_no': d.get('Tender Ref. No.'),
                    'description': d.get('Tender Description'),
                    'bid_count': parse_int(d.get('Number of bids received')),
                    'winner_name': d.get('Name of the selected bidder(s)'),
                    'winner_address': d.get('Address of the selected bidder(s)'),
                    'completion_period': d.get('Date of Completion/Completion Period in Days'),
                }
                rec['quality_score'] = qscore(rec)
                batch_data.append((
                    rec['tender_id'], rec['portal_type'], rec['year'],
                    rec['aoc_date'], rec['title'], rec['org_name'],
                    rec['tender_type'], rec['contract_date'], rec['contract_value'],
                    rec['published_date'], rec['tender_doc_url'], rec['ref_no'],
                    rec['description'], rec['bid_count'], rec['winner_name'],
                    rec['winner_address'], rec['completion_period'], rec['quality_score']
                ))
            except Exception as e:
                failed += 1
                continue

        if batch_data:
            try:
                execute_values(cu, '''
                    INSERT INTO awards (tender_id, portal_type, year, aoc_date, title,
                        org_name, tender_type, contract_date, contract_value,
                        published_date, tender_doc_url, ref_no, description,
                        bid_count, winner_name, winner_address, completion_period,
                        quality_score)
                    VALUES %s
                    ON CONFLICT (tender_id) DO NOTHING
                ''', batch_data)
                inserted += cu.rowcount
                cn.commit()
            except Exception as e:
                cn.rollback()
                failed += len(batch_data)
                print(f'[BATCH ERROR] {e}', flush=True)

        if total % 50000 == 0:
            print(f'[PROGRESS] total={total} inserted={inserted} failed={failed}', flush=True)

    cu.close(); cn.close(); sq.close()
    print(f'[DONE] total={total} inserted={inserted} failed={failed}', flush=True)

if __name__ == '__main__':
    main()
