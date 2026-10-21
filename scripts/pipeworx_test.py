import requests, json

# Pipeworx Gateway URL for searching tenders across multiple portals
url = 'https://gateway.pipeworx.io/v1/tools/india_search_tenders'

# Input payload: Search for 'road' across CPPP, GeM, and Maharashtra
payload = {
    'arguments': {
        'query': 'road',
        'portal': 'central', # Options: central, cpse, defence, maharashtra, tamil-nadu, etc.
        'limit': 5
    }
}

print('Fetching data from Pipeworx Unified API...')
try:
    res = requests.post(url, json=payload, timeout=30)
    print('Status Code:', res.status_code)
    
    if res.status_code == 200:
        data = res.json()
        print('✅ SUCCESS! Data received.')
        print(json.dumps(data, indent=2)[:1500]) # Print first 1500 chars to see structure
    else:
        print('❌ FAILED:', res.text)
except Exception as e:
    print('Error:', e)
