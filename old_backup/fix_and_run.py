import re
import time
import urllib3
import requests
import psycopg2

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

with open('/opt/bidwell/night_scraper_backup.py', 'r') as f:
    old_code = f.read()

SUPABASE_URL = re.search(r'SUPABASE_URL\s*=\s*[\'"]([^\'"]+)[\'"]', old_code).group(1)
SUPABASE_KEY = re.search(r'SUPABASE_KEY\s*=\s*[\'"]([^\'"]+)[\'"]', old_code).group(1)

sb_headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def get_smart_numbers(org_name, title=""):
    try:
        conn = psycopg2.connect(host="127.0.0.1", database="brain", user="bidwell", password="bidwell2026", connect_timeout=5)
        cur = conn.cursor()
        clean_org = re.sub(r'[^a-zA-Z0-9\s]', ' ', str(org_name)).split()
        search_term = clean_org[0] if clean_org else "India"
        cur.execute("""
            SELECT AVG(CAST(NULLIF(REGEXP_REPLACE(contract_value::text, '[^0-9.]', '', 'g'), '') AS NUMERIC))
            FROM (SELECT contract_value FROM awards WHERE org_name ILIKE %s AND contract_value IS NOT NULL LIMIT 200) sub
        """, (f"%{search_term}%",))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row and row[0] and float(row[0]) > 10000:
            val = int(float(row[0]))
            return int(val * 0.02), val
    except Exception:
        pass
    
    t_low = str(title).lower()
    if any(k in t_low for k in ["construction", "highway", "road", "building", "bridge"]):
        return 250000, 12500000
    elif any(k in t_low for k in ["repair", "maintenance", "civil", "campus", "work"]):
        return 35000, 1750000
    else:
        return 50000, 2500000

def clean_num(val):
    if val is None:
        return None
    digits = re.sub(r'[^0-9]', '', str(val).split('.')[0])
    return int(digits) if digits and int(digits) > 0 else None

def backfill_existing_supabase_tenders():
    print("\n--- [BACKFILL] FILLING MISSING EMD & VALUES IN SUPABASE ---")
    try:
        res = requests.get(
            f"{SUPABASE_URL}/rest/v1/live_tenders?or=(emd.is.null,value.is.null)&select=id,source_tender_id,org_name,title,emd,value&limit=300",
            headers=sb_headers,
            timeout=15
        )
        if res.status_code == 200:
            missing_list = res.json()
            fixed = 0
            for item in missing_list:
                row_id = item.get("id")
                est_emd, est_val = get_smart_numbers(item.get("org_name"), item.get("title"))
                update_payload = {
                    "emd": clean_num(item.get("emd")) or est_emd,
                    "value": clean_num(item.get("value")) or est_val
                }
                u_res = requests.patch(f"{SUPABASE_URL}/rest/v1/live_tenders?id=eq.{row_id}", headers=sb_headers, json=update_payload, timeout=10)
                if u_res.status_code in [200, 204]:
                    fixed += 1
            print(f"✅ Successfully filled EMD/Value for {fixed} tenders!")
    except Exception as e:
        print(f"Backfill Error: {e}")

if __name__ == '__main__':
    backfill_existing_supabase_tenders()
