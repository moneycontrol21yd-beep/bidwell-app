import psycopg2
import requests
import re

with open('/opt/bidwell/night_scraper_backup.py', 'r') as f:
    old_code = f.read()

SUPABASE_URL = re.search(r'SUPABASE_URL\s*=\s*[\'"]([^\'"]+)[\'"]', old_code).group(1)
SUPABASE_KEY = re.search(r'SUPABASE_KEY\s*=\s*[\'"]([^\'"]+)[\'"]', old_code).group(1)

sb_headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def sync_similar_tenders_to_supabase():
    print("--- 🔄 SYNCING SIMILAR TENDERS FROM SUPABASE ---")
    try:
        # Fetch active tenders directly from Supabase live counter
        res = requests.get(f"{SUPABASE_URL}/rest/v1/live_tenders?select=source_tender_id,org_name,state", headers=sb_headers, timeout=15)
        if res.status_code == 200:
            tenders = res.json()
            synced_count = 0
            
            for t in tenders:
                tid = t.get("source_tender_id")
                org = t.get("org_name")
                state = t.get("state")
                if not org:
                    continue
                
                # Find similar tenders from the same Supabase table list
                similar_list = []
                for other in tenders:
                    if other.get("source_tender_id") != tid and (str(org)[:10].lower() in str(other.get("org_name", "")).lower() or str(state).lower() == str(other.get("state", "")).lower()):
                        similar_list.append({
                            "tender_id": other.get("source_tender_id"),
                            "title": other.get("title", "Similar Tender"),
                            "value": other.get("value"),
                            "closing_date": other.get("closing_date"),
                            "source_url": other.get("source_url")
                        })
                        if len(similar_list) >= 3:
                            break
                
                if similar_list:
                    requests.patch(
                        f"{SUPABASE_URL}/rest/v1/live_tenders?source_tender_id=eq.{requests.utils.quote(str(tid))}",
                        headers=sb_headers,
                        json={"similar_tenders": similar_list},
                        timeout=5
                    )
                    synced_count += 1
            print(f"✅ Successfully updated similar tenders for {synced_count} listings!")
    except Exception as e:
        print(f"Sync error: {e}")

if __name__ == "__main__":
    sync_similar_tenders_to_supabase()
