import requests
import re
from datetime import datetime

with open('/opt/bidwell/night_scraper_backup.py', 'r') as f:
    old_code = f.read()

SUPABASE_URL = re.search(r'SUPABASE_URL\s*=\s*[\'"]([^\'"]+)[\'"]', old_code).group(1)
SUPABASE_KEY = re.search(r'SUPABASE_KEY\s*=\s*[\'"]([^\'"]+)[\'"]', old_code).group(1)

sb_headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def get_todays_action_center(selected_state="All India"):
    print(f"--- 🎯 GENERATING TODAY'S ACTION CENTER FOR: {selected_state} ---")
    today_str = datetime.now().strftime('%Y-%m-%d')
    
    try:
        res = requests.get(
            f"{SUPABASE_URL}/rest/v1/live_tenders?select=source_tender_id,title,org_name,state,closing_date,match_score,source_url&order=match_score.desc&limit=100",
            headers=sb_headers,
            timeout=15
        )
        
        if res.status_code == 200:
            tenders = res.json()
            urgent_deadlines = []
            top_matches = []
            
            for t in tenders:
                closing = str(t.get("closing_date", ""))
                state = str(t.get("state", ""))
                score = t.get("match_score", 50)
                
                if closing.startswith(today_str):
                    urgent_deadlines.append(t)
                    
                # Agar All India hai toh sabhi aayenge, nahi toh selected state match hoga
                if selected_state.lower() == "all india" or selected_state.lower() in state.lower() or score >= 80:
                    top_matches.append(t)
                    
            action_center_data = {
                "date": today_str,
                "state_filter": selected_state,
                "urgent_deadlines_count": len(urgent_deadlines),
                "urgent_tenders": urgent_deadlines[:3],
                "top_recommended_tenders": top_matches[:5]
            }
            
            print("✅ Action Center Updated for All States Successfully!")
            print(f"   - Urgent Deadlines Today: {len(urgent_deadlines)}")
            print(f"   - Relevant Tenders Found: {len(top_matches)}")
            return action_center_data
        else:
            print(f"Error fetching tenders: {res.status_code}")
            return None
    except Exception as e:
        print(f"Action Center Error: {e}")
        return None

if __name__ == "__main__":
    get_todays_action_center("All India")
