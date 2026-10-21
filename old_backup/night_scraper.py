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
PIPEWORX_URL = re.search(r'PIPEWORX_URL\s*=\s*[\'"]([^\'"]+)[\'"]', old_code).group(1)

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

def run_live_all_india_scrape():
    portals = [
        'gem', 'central', 'defence', 'railways',
        'uttar-pradesh', 'madhya-pradesh', 'bihar',
        'rajasthan', 'gujarat', 'maharashtra',
        'tamil-nadu', 'karnataka', 'delhi',
        'haryana', 'punjab', 'jharkhand', 'chhattisgarh'
    ]
    all_tenders = []
    for p in portals:
        payload = {'arguments': {'query': '', 'portal': p, 'limit': 50}}
        try:
            res = requests.post(PIPEWORX_URL, json=payload, timeout=30)
            if res.status_code == 200:
                tenders = res.json().get('tenders', [])
                for t in tenders:
                    t['portal'] = p
                all_tenders.extend(tenders)
            time.sleep(1)
        except Exception:
            pass

    saved_count = 0
    for t in all_tenders:
        tid = t.get('tender_id')
        title = t.get('title')
        if not tid or not title:
            continue
        org_name = t.get('organisation', 'Government of India')
        state_val = t.get('state') or str(t.get('portal', 'India')).title()
        est_emd, est_val = get_smart_numbers(org_name, title)
        
        # Smart Match Score Calculation (Profile Matching Priority)
        match_score = 70
        t_lower = title.lower()
        if any(st in state_val.lower() for st in ["uttar", "madhya", "bihar", "rajasthan", "gujarat", "maharashtra"]):
            match_score += 20
        if any(kw in t_lower for kw in ["repair", "construction", "supply", "work", "civil"]):
            match_score += 10

        payload = {
            'source': t.get('portal', 'INDIA').upper(),
            'source_tender_id': str(tid),
            'title': title,
            'org_name': org_name,
            'state': state_val,
            'closing_date': t.get('bid_submission_closes_at') or t.get('closing_date'),
            'source_url': t.get('source_url') or 'https://eprocure.gov.in',
            'emd': clean_num(t.get('emd')) or est_emd,
            'value': clean_num(t.get('value')) or est_val,
            'match_score': match_score
        }
        
        chk = requests.get(f"{SUPABASE_URL}/rest/v1/live_tenders?source_tender_id=eq.{requests.utils.quote(str(tid))}&select=id", headers=sb_headers, timeout=10)
        if chk.status_code == 200 and len(chk.json()) > 0:
            r = requests.patch(f"{SUPABASE_URL}/rest/v1/live_tenders?source_tender_id=eq.{requests.utils.quote(str(tid))}", headers=sb_headers, json=payload, timeout=10)
        else:
            r = requests.post(f"{SUPABASE_URL}/rest/v1/live_tenders", headers=sb_headers, json=payload, timeout=10)
        if r.status_code in [200, 201, 204]:
            saved_count += 1
            
    print(f"✅ All-India Scrape Complete. Saved/Updated {saved_count} tenders.")

if __name__ == '__main__':
    while True:
        run_live_all_india_scrape()
        print("--- ALL-INDIA CYCLE COMPLETE, SLEEPING FOR 30 MINS ---")
        time.sleep(1800)
