import requests, json, re

# 1. API Key nikaalo
with open('/opt/bidwell/night_scraper.py', 'r') as f:
    content = f.read()
# (Ye line Pipeworx API ka URL bhi nikal legi agar change hua ho)
pipeworx_url = re.search(r"PIPEWORX_URL = '([^']+)'", content).group(1)

print(f"Testing API: {pipeworx_url}")

payload = {
    'arguments': {
        'query': '',
        'portal': 'central',
        'limit': 1  # Sirf 1 record chahiye check karne ke liye
    }
}

try:
    # Bina authorization ke try kar rahe hain, agar fail ho to key daalenge
    res = requests.post(pipeworx_url, json=payload, timeout=15)
    print(f"Status Code: {res.status_code}")
    
    if res.status_code == 200:
        data = res.json()
        tenders = data.get('tenders', [])
        if tenders:
            print("\n--- RAW API DATA (Pehla Tender) ---")
            print(json.dumps(tenders[0], indent=2))
        else:
            print("No tenders found in response.")
    else:
        print("Response:", res.text[:200])
except Exception as e:
    print("Error:", e)
