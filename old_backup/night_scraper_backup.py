import requests, json, re, time
from bs4 import BeautifulSoup

SUPABASE_URL = 'https://mvelgzwtopfanrrdtxoo.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZWxnend0b3BmYW5ycmR0eG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2NjM5MywiZXhwIjoyMTA2NDQyMzkzfQ.ukPKWb6T7cKqc0Xsu6jrEsHNJe-lXb8Y3dU9EQSQauM'
PIPEWORX_URL = 'https://gateway.pipeworx.io/v1/tools/india_search_tenders'

sb_headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}

def extract_money(text, keyword):
    pattern = rf'(?i)(?:{keyword})\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d+)?(?:\s*(?:Lakh|Crore|Cr|Lacs))?)'
    match = re.search(pattern, text)
    if match:
        return match.group(1).strip()
    return None

def get_tenders_from_pipeworx():
    all_tenders = []
    portals = ['central', 'maharashtra', 'uttar-pradesh', 'tamil-nadu', 'defence']
    
    for p in portals:
        payload = {
            'arguments': {
                'query': '',
                'portal': p,
                'limit': 50
            }
        }
        try:
            res = requests.post(PIPEWORX_URL, json=payload, timeout=30)
            if res.status_code == 200:
                data = res.json()
                tenders = data.get('tenders', [])
                print(f'[{p}] Got {len(tenders)} list items.')
                all_tenders.extend(tenders)
            else:
                print(f'[{p}] API Error: {res.status_code}')
            time.sleep(2)
        except Exception as e:
            print(f'Error fetching {p}: {e}')
    return all_tenders

def enrich_and_upload(tenders):
    for t in tenders:
        tid = t.get('tender_id')
        title = t.get('title')
        source_url = t.get('source_url')
        
        if not tid or not source_url:
            continue
            
        print(f'Processing: {tid}')
        
        emd = None
        val = None
        
        try:
            detail_res = requests.get(source_url, timeout=15, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            if detail_res.status_code == 200:
                soup = BeautifulSoup(detail_res.text, 'lxml')
                page_text = soup.get_text(' ', strip=True)
                
                emd = extract_money(page_text, 'EMD|Earnest Money')
                val = extract_money(page_text, 'Estimated Cost|Tender Value|Amount')
                
                if emd or val:
                    print(f'  -> Found EMD: {emd} | Value: {val}')
        except Exception as e:
            print(f'  -> Detail scrape failed: {e}')
            
        payload = {
            'source': t.get('portal', 'UNKNOWN').upper(),
            'source_tender_id': tid,
            'title': title,
            'org_name': t.get('organisation', 'N/A'),
            'state': t.get('state', 'India'),
            'closing_date': t.get('bid_submission_closes_at'),
            'source_url': source_url,
            'emd': emd,
            'value': val,
            'match_score': 50
        }
        
        try:
            sb_res = requests.post(f'{SUPABASE_URL}/rest/v1/live_tenders?on_conflict=source_tender_id', headers=sb_headers, json=[payload], timeout=10)
            if sb_res.status_code in [200, 201]:
                print(f'  -> ✅ Saved to Supabase')
            else:
                print(f'  -> ❌ Supabase Error: {sb_res.text}')
        except Exception as e:
            print(f'  -> ❌ Upload failed: {e}')
            
        time.sleep(2)

if __name__ == '__main__':
    print('--- STARTING OVERNIGHT SCRAPE ---')
    while True:
        try:
            raw_tenders = get_tenders_from_pipeworx()
            if raw_tenders:
                enrich_and_upload(raw_tenders)
            print('--- BATCH DONE, SLEEPING FOR 10 MINS ---')
            time.sleep(600) 
        except Exception as e:
            print(f'Main Loop Error: {e}')
            time.sleep(60)
