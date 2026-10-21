import re
import requests

# 1. Night Scraper file se key nikalo
with open('/opt/bidwell/night_scraper.py', 'r') as f:
    content = f.read()
key = re.search(r"SUPABASE_KEY = '([^']+)'", content).group(1)

# 2. Supabase se 1 real tender fetch karo
url = "https://mvelgzwtopfanrrdtxoo.supabase.co/rest/v1/live_tenders?select=source_url,title&limit=1"
headers = {"apikey": key, "Authorization": f"Bearer {key}"}

print("Fetching a real tender URL from Supabase...")
res = requests.get(url, headers=headers)

if res.status_code == 200:
    data = res.json()
    if data and len(data) > 0:
        print("\n✅ Real Tender URL Mil Gaya!")
        print(f"Title: {data[0]['title'][:50]}...")
        print(f"URL: {data[0]['source_url']}")
        print("\nAb is URL ko copy karo aur agle step me use karo.")
    else:
        print("❌ Supabase me abhi koi data nahi hai.")
else:
    print(f"❌ Error: {res.text}")
