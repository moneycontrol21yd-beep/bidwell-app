import requests, json, re
from playwright.sync_api import sync_playwright

# --- 1. Supabase se GeM ka data lo ---
print("1. Fetching GeM Tender from Supabase Database...")

with open('/opt/bidwell/night_scraper.py', 'r') as f:
    content = f.read()
SUPABASE_KEY = re.search(r"SUPABASE_KEY = '([^']+)'", content).group(1)
SUPABASE_URL = 'https://mvelgzwtopfanrrdtxoo.supabase.co'

url = f"{SUPABASE_URL}/rest/v1/live_tenders?select=*&source=eq.GEM&limit=1"
headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}

try:
    res = requests.get(url, headers=headers, timeout=10)
    data = res.json()
    if not data:
        print("   ❌ Supabase me GEM ka koi data nahi mila.")
        exit()
    
    tender = data[0]
    search_query = tender.get('source_tender_id')
    print(f"   ✅ Found GEM Tender: {search_query}")

except Exception as e:
    print("   ❌ Supabase Error:", e)
    exit()

# --- 2. Playwright se GeM portal par search karo ---
print("\n2. Launching Browser to search GeM portal...")
with sync_playwright() as p:
    # User-Agent daal rahe hain taaki bot na lage
    browser = p.chromium.launch(
        headless=True,
        args=['--disable-blink-features=AutomationControlled']
    )
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = context.new_page()

    try:
        # wait_until="domcontentloaded" lagaya hai taaki images ka wait na kare
        print("   Opening GeM Portal...")
        page.goto("https://bidplus.gem.gov.in/all-bids", timeout=90000, wait_until="domcontentloaded")
        page.wait_for_timeout(5000) # Extra time for JS to render
        
        # Search box dhundho
        search_input = page.locator('input[placeholder*="Search"]').first
        search_input.wait_for(state="visible", timeout=15000)
        search_input.fill(search_query)
        search_input.press('Enter')
        
        print("   Searching for ID on GeM...")
        page.wait_for_timeout(8000) # Result aane ka wait
        
        links = page.locator(f'a:has-text("{search_query}")')
        
        if links.count() > 0:
            print("   ✅ Found exact match on GeM! Opening details...")
            links.first.click()
            page.wait_for_timeout(5000)
            
            text = page.locator("body").inner_text()
            
            emd_match = re.search(r"(?:EMD Amount|EMD)\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
            val_match = re.search(r"(?:Estimated Bid Value|Bid Value|Value)\s*:?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
            
            print("\n--- RESULTS ---")
            print(f"   EMD: {emd_match.group(1) if emd_match else 'Not Found'}")
            print(f"   Value: {val_match.group(1) if val_match else 'Not Found'}")
            
            print("\n   Page Preview (first 500 chars):")
            print("   ", text[:500].replace('\n', ' '))
            
        else:
            print("   ❌ Tender not found in GeM search results. (Maybe Bot Blocked or Captcha)")
            print("   Page Title:", page.title())
            print("   Current URL:", page.url)
            
    except Exception as e:
        print("   ❌ Playwright Error:", e)
    finally:
        browser.close()
