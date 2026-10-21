import json, requests, time

# YAHAN APNI DETAILS DAALO
SUPABASE_URL = 'https://mvelgzwtopfanrrdtxoo.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZWxnend0b3BmYW5ycmR0eG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2NjM5MywiZXhwIjoyMTA2NDQyMzkzfQ.ukPKWb6T7cKqc0Xsu6jrEsHNJe-lXb8Y3dU9EQSQauM'

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates' # Agar pehle se hai toh update karega
}

print('Reading JSON file...')
with open('/opt/bidwell/live_tenders.json', 'r') as f:
    tenders = json.load(f)

print(f'Total tenders to upload: {len(tenders)}')
url = f'{SUPABASE_URL}/rest/v1/live_tenders'

# Upload in chunks of 1000
chunk_size = 1000
for i in range(0, len(tenders), chunk_size):
    chunk = tenders[i:i+chunk_size]
    
    # Supabase ke liye data format karo
    payload = []
    for t in chunk:
        payload.append({
            'source': t.get('source'),
            'source_tender_id': t.get('source_tender_id'),
            'title': t.get('title'),
            'org_name': t.get('org_name'),
            'state': t.get('state'),
            'category': t.get('category'),
            'value': t.get('value'),
            'emd': t.get('emd'),
            'published_date': t.get('published_date'),
            'closing_date': t.get('closing_date'),
            'source_url': t.get('source_url'),
            'match_score': 50,
            'match_reasons': []
        })
        
    res = requests.post(url, headers=headers, json=payload, timeout=30)
    
    if res.status_code in [200, 201]:
        print(f'✅ Uploaded {min(i+chunk_size, len(tenders))} / {len(tenders)}')
    else:
        print(f'❌ Error at {i}: {res.text}')
        break # Agar error aaye toh ruk jao
        
    time.sleep(0.5) # Thoda delay taaki Supabase block na kare

print('UPLOAD_FINISHED')
