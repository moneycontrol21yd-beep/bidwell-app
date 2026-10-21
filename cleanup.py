import requests
import datetime
import os

# Supabase Credentials
SUPABASE_URL = "https://mvelgzwtopfanrrdtxoo.supabase.co"
# key.txt se key read karo
with open('key.txt', 'r') as f:
    SUPABASE_KEY = f.read().strip()

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Aaj ki date
today = datetime.date.today().isoformat()

print(f"Checking for expired tenders before {today}...")

# Supabase se expired tenders delete karo
# (Ye data VPS me safe hai, isliye app se delete karna safe hai)
url = f"{SUPABASE_URL}/rest/v1/live_tenders?closing_date=lt.{today}"
response = requests.delete(url, headers=headers)

if response.status_code in [200, 204]:
    print("✅ Successfully deleted expired tenders from App (Supabase).")
    print("🔒 Original data is 100% safe in VPS Brain.")
else:
    print(f"❌ Error: {response.status_code} - {response.text}")

