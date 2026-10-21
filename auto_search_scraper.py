import requests, json, re
from playwright.sync_api import sync_playwright

# --- 1. Direct Supabase se data lo (API bypass) ---
print("1. Fetching Tender from Supabase Database...")

# Night scraper file se key nikalo
with open('/opt/bidwell/night_scraper.py', 'r') as f:
    content = f.read()
SUPABASE_KEY = re.search(r"SUPABASE_KEY = '([^']+)'", content).group(1)
SUPABASE_URL = 'https://mvelgzwtopfanrrdtxoo.supabase.co'

# Ek tender fetch karo jisme source_url ho
url = f"{SUPABASE_URL}/rest/v1/live_tenders?select=*&limit=1"
headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}

try:
    res = requests.get(url, headers=headers, timeout=10)
    data = res.json()
    if not data:
        print("   ❌ Supabase me koi data nahi hai.")
        exit()
    
    tender = data[0]
    search_query = tender.get('source_tender_id') or tender.get('title')
    print(f"   ✅ Found: {search_query[:60]}...")

except Exception as e:
    print("   ❌ Supabase Error:", e)
    exit()


# --- 2. Playwright se CPPP portal par search karo ---
print("\n2. Launching Browser to search CPPP portal...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        page.goto("https://eprocure.gov.in/cppp/tendersearch", timeout=60000)
        
        # Search box me ID daalo
        page.wait_for_selector('input[name="searchtxt"]', timeout=10000)
        page.fill('input[name="searchtxt"]', search_query)
        
        # Search dabao
        page.click('input[name="Search"]')
        
        # Results load hone ka wait karo
        page.wait_for_timeout(5000) 
        
        # Link dhundho
        links = page.locator(f'a:has-text("{search_query}")')
        
        if links.count() > 0:
            print("   ✅ Found match on CPPP! Clicking...")
            links.first.click()
            page.wait_for_timeout(3000)
            
            text = page.locator("body").inner_text()
            
            emd_match = re.search(r"(?:EMD|Earnest Money)\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
            val_match = re.search(r"(?:Estimated Cost|Tender Value|Amount)\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
            
            print("\n--- RESULTS ---")
            print(f"   EMD: {emd_match.group(1) if emd_match else 'Not Found'}")
            print(f"   Value: {val_match.group(1) if val_match else 'Not Found'}")
            
            # Print 500 chars of page to see what's there
            print("\n   Page Preview:")
            print("   ", text[:500].replace('\n', ' '))
            
        else:
            print("   ❌ Tender not found in CPPP search results. (Maybe it's a State tender, not CPPP)")
            print("   Page Title:", page.title())
            
    except Exception as e:
        print("   ❌ Playwright Error:", e)
    finally:
        browser.close()
