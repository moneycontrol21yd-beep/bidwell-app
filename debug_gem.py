from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = context.new_page()

    try:
        print("Opening GeM Portal...")
        page.goto("https://bidplus.gem.gov.in/all-bids", timeout=60000, wait_until="domcontentloaded")
        
        # Page ko thoda settle hone do
        page.wait_for_timeout(10000) 
        
        print("\n--- PAGE TITLE ---")
        print(page.title())
        
        print("\n--- PAGE TEXT (First 1000 chars) ---")
        text = page.locator("body").inner_text()
        print(text[:1000].replace('\n', ' '))
        
        print("\n--- ALL INPUT TAGS (Checking search box) ---")
        inputs = page.locator("input").all()
        for i, inp in enumerate(inputs):
            if i > 10: break # Sirf pehle 10 dikhao
            print(f"Input {i+1}: Name={inp.get_attribute('name')}, Id={inp.get_attribute('id')}, Placeholder={inp.get_attribute('placeholder')}, Type={inp.get_attribute('type')}")
            
    except Exception as e:
        print("Debug Error:", e)
    finally:
        browser.close()
