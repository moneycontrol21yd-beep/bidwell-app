import re

with open('/opt/bidwell/night_scraper_backup.py', 'r') as f:
    old_code = f.read()

sb_url_match = re.search(r'SUPABASE_URL\s*=\s*[\'"]([^\'"]+)[\'"]', old_code)
sb_key_match = re.search(r'SUPABASE_KEY\s*=\s*[\'"]([^\'"]+)[\'"]', old_code)
pw_url_match = re.search(r'PIPEWORX_URL\s*=\s*[\'"]([^\'"]+)[\'"]', old_code)

SUPABASE_URL = sb_url_match.group(1) if sb_url_match else "https://mvelgzwtopfanrrdtxoo.supabase.co"
SUPABASE_KEY = sb_key_match.group(1) if sb_key_match else ""
PIPEWORX_URL = pw_url_match.group(1) if pw_url_match else "https://gateway.pipeworx.io/api/mcp"

print(f"✅ Extracted SUPABASE_URL: {SUPABASE_URL}")
print(f"✅ Extracted SUPABASE_KEY: {SUPABASE_KEY[:15]}... (OK)")
print(f"✅ Extracted PIPEWORX_URL: {PIPEWORX_URL}")

new_script = f'''import re
import time
import json
import urllib3
import requests
import psycopg2
from bs4 import BeautifulSoup

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

SUPABASE_URL = "{SUPABASE_URL}"
SUPABASE_KEY = "{SUPABASE_KEY}"
PIPEWORX_URL = "{PIPEWORX_URL}"

sb_headers = {{
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {{SUPABASE_KEY}}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}}

def extract_money_from_soup(soup, page_text, is_emd=True):
    keywords = ["EMD Amount", "Earnest Money", "EMD in", "ePBG", "EMD"] if is_emd else ["Tender Value", "Estimated Cost", "Estimated Value", "Contract Value", "Total Value"]
    
    for td in soup.find_all(["td", "th", "span", "div"]):
        txt = td.get_text(" ", strip=True)
        if len(txt) < 45 and any(k.lower() in txt.lower() for k in keywords):
            nxt = td.find_next_sibling(["td", "span", "div"])
            if nxt:
                val_txt = nxt.get_text(" ", strip=True)
                m = re.search(r'(?:Rs\\.?|INR|₹)?\\s*([1-9][\\d,]*\\.?\\d*\\s*(?:Lakh|Crore|Cr|Lacs)?)', val_txt, re.I)
                if m and m.group(1).replace(",", "").replace(".", "").strip() not in ["0", "00", "000"]:
                    return f"₹ {{m.group(1).strip()}}"

    kw_pattern = "|".join(keywords)
    pattern = rf'(?i)(?:{{kw_pattern}})[^\\d₹]{{0,25}}(?:Rs\\.?|INR|₹)?\\s*([1-9][\\d,]*(?:\\.\\d+)?(?:\\s*(?:Lakh|Crore|Cr|Lacs))?)'
    match = re.search(pattern, page_text)
    if match:
        val = match.group(1).strip()
        if len(val) >= 3:
            return f"₹ {{val}}"
    return None

def get_brain_estimate(org_name):
    if not org_name or org_name == "N/A":
        return "As per NIT Document", "Refer Official NIT"
    try:
        conn = psycopg2.connect(host="127.0.0.1", database="brain", user="bidwell", password="bidwell2026", connect_timeout=3)
        cur = conn.cursor()
        cur.execute("""
            SELECT AVG(CAST(NULLIF(REGEXP_REPLACE(contract_value::text, '[^0-9.]', '', 'g'), '') AS NUMERIC))
            FROM awards
            WHERE org_name ILIKE %s
            LIMIT 100
        """, (f"%{{org_name[:20]}}%",))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row and row[0] and float(row[0]) > 1000:
            avg_val = int(float(row[0]))
            est_emd = int(avg_val * 0.02)
            return f"₹ {{est_emd:,}} (Est. 2%)", f"₹ {{avg_val:,}} (Dept Avg)"
    except Exception:
        pass
    return "As per NIT Document (1-2%)", "Refer Official NIT PDF"

def get_tenders_from_pipeworx():
    all_tenders = []
    portals = [
        "gem", "central", "defence", "railways",
        "maharashtra", "uttar-pradesh", "madhya-pradesh",
        "gujarat", "rajasthan", "tamil-nadu", "karnataka", "delhi"
    ]
    for p in portals:
        payload = {{"arguments": {{"query": "", "portal": p, "limit": 50}}}}
        try:
            res = requests.post(PIPEWORX_URL, json=payload, timeout=30)
            if res.status_code == 200:
                data = res.json()
                tenders = data.get("tenders", [])
                print(f"[{{p.upper()}}] Got {{len(tenders)}} live tenders.")
                for item in tenders:
                    if not item.get("portal"):
                        item["portal"] = p
                all_tenders.extend(tenders)
            time.sleep(1.5)
        except Exception as e:
            print(f"Error fetching {{p}}: {{e}}")
    return all_tenders

def safe_save_to_supabase(payload):
    tid = payload["source_tender_id"]
    try:
        chk = requests.get(
            f"{{SUPABASE_URL}}/rest/v1/live_tenders?source_tender_id=eq.{{requests.utils.quote(str(tid))}}&select=id",
            headers=sb_headers,
            timeout=10
        )
        if chk.status_code == 200 and len(chk.json()) > 0:
            upd = requests.patch(
                f"{{SUPABASE_URL}}/rest/v1/live_tenders?source_tender_id=eq.{{requests.utils.quote(str(tid))}}",
                headers=sb_headers,
                json=payload,
                timeout=10
            )
            return upd.status_code in [200, 204], upd.text
        else:
            ins = requests.post(
                f"{{SUPABASE_URL}}/rest/v1/live_tenders",
                headers=sb_headers,
                json=payload,
                timeout=10
            )
            return ins.status_code in [200, 201], ins.text
    except Exception as e:
        return False, str(e)

def enrich_and_upload(tenders):
    for t in tenders:
        tid = t.get("tender_id") or t.get("id")
        title = t.get("title")
        source_url = t.get("source_url") or t.get("url")
        if not tid or not title:
            continue

        print(f"Processing: {{tid}}")

        emd = t.get("emd") or t.get("emd_amount")
        val = t.get("value") or t.get("tender_value") or t.get("estimated_cost")

        if (not emd or not val) and source_url:
            try:
                detail_res = requests.get(
                    source_url,
                    timeout=12,
                    verify=False,
                    headers={{"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36"}}
                )
                if detail_res.status_code == 200:
                    soup = BeautifulSoup(detail_res.text, "lxml")
                    page_text = soup.get_text(" ", strip=True)
                    if not emd:
                        emd = extract_money_from_soup(soup, page_text, is_emd=True)
                    if not val:
                        val = extract_money_from_soup(soup, page_text, is_emd=False)
            except Exception as e:
                print(f" -> Detail page fetch skipped: {{e}}")

        org_name = t.get("organisation") or t.get("org_name") or "Government Department"
        if not emd or not val:
            est_emd, est_val = get_brain_estimate(org_name)
            if not emd:
                emd = est_emd
            if not val:
                val = est_val

        payload = {{
            "source": str(t.get("portal", "INDIA")).upper(),
            "source_tender_id": str(tid),
            "title": title,
            "org_name": org_name,
            "state": t.get("state") or str(t.get("portal", "India")).title(),
            "closing_date": t.get("bid_submission_closes_at") or t.get("closing_date"),
            "source_url": source_url or "https://eprocure.gov.in",
            "emd": str(emd),
            "value": str(val),
            "match_score": 75
        }}

        ok, msg = safe_save_to_supabase(payload)
        if ok:
            print(f" -> ✅ Saved/Updated: EMD={{emd}} | Value={{val}}")
        else:
            print(f" -> ❌ Supabase Error: {{msg}}")
        time.sleep(1)

if __name__ == "__main__":
    print("--- STARTING SMART ALL-INDIA SCRAPER ---")
    while True:
        try:
            raw_tenders = get_tenders_from_pipeworx()
            if raw_tenders:
                enrich_and_upload(raw_tenders)
            print("--- BATCH DONE, SLEEPING FOR 10 MINS ---")
            time.sleep(600)
        except Exception as e:
            print(f"Main Loop Error: {{e}}")
            time.sleep(60)
'''

with open('/opt/bidwell/night_scraper.py', 'w') as f:
    f.write(new_script)

print("🎉 SUCCESS! /opt/bidwell/night_scraper.py has been upgraded!")
