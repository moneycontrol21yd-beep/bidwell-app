import csv, psycopg2
from psycopg2.extras import execute_values

CSV_FILE = '/opt/bidwell/data/hf/fireboy21_tenders_aoc/registered_companies.csv'
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
BATCH = 10000

cn = psycopg2.connect(DB, connect_timeout=60)
cu = cn.cursor()

print('Reading CSV...', flush=True)
total = 0
inserted = 0

def safe_float(val):
    try: return float(val) if val else 0.0
    except: return 0.0

with open(CSV_FILE, 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.reader(f)
    header = next(reader)
    
    batch_data = []
    for row in reader:
        total += 1
        if len(row) < 14: continue
        
        cin = row[0].strip()
        name = row[1].strip()
        if not cin or not name: continue
        
        batch_data.append((
            cin, name, row[2].strip(), row[3].strip(), row[4].strip(),
            row[5].strip(), row[6].strip(), row[7].strip(),
            safe_float(row[8]), safe_float(row[9]), row[10].strip(),
            row[11].strip(), row[12].strip(), row[13].strip()
        ))
        
        if len(batch_data) >= BATCH:
            try:
                execute_values(cu, '''
                    INSERT INTO registered_companies (corporate_id, company_name, status, class, category, sub_category, date_of_reg, state, authorized_cap, paidup_cap, activity, address, roc, email)
                    VALUES %s ON CONFLICT (corporate_id) DO NOTHING
                ''', batch_data)
                inserted += cu.rowcount
                cn.commit()
                batch_data = []
            except Exception as e:
                cn.rollback()
                print(f'Error: {e}', flush=True)
                batch_data = []
        
        if total % 200000 == 0:
            print(f'Processed: {total}, Inserted: {inserted}', flush=True)

    if batch_data:
        try:
            execute_values(cu, '''
                INSERT INTO registered_companies (corporate_id, company_name, status, class, category, sub_category, date_of_reg, state, authorized_cap, paidup_cap, activity, address, roc, email)
                VALUES %s ON CONFLICT (corporate_id) DO NOTHING
            ''', batch_data)
            inserted += cu.rowcount
            cn.commit()
        except Exception as e:
            cn.rollback()

print(f'[DONE] Total: {total}, Inserted: {inserted}', flush=True)
cu.close(); cn.close()
