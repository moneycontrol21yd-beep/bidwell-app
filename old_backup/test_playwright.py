from playwright.sync_api import sync_playwright

# Ek real CPPP search page (jo JS se load hota hai)
test_url = "https://eprocure.gov.in/eprocure/app?page=FrontEndTendersByOrganisation&service=page"

print("Browser start ho raha hai...")
with sync_playwright() as p:
    # Headless browser start karo
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    print(f"Fetching URL: {test_url}")
    page.goto(test_url, timeout=60000)
    
    # JavaScript load hone ka wait karo
    page.wait_for_timeout(5000) 
    
    # Page ka text nikalo
    text = page.locator("body").inner_text()
    print(f"\nPage Text Length: {len(text)} characters")
    
    # Check karo EMD ya Tender Value mila kya
    if "EMD" in text or "Tender Value" in text:
        print("\n✅ 'EMD' ya 'Tender Value' page par mila!")
        # Pehli 1000 characters print karo jahan data ho
        idx = text.find("EMD") if "EMD" in text else text.find("Tender Value")
        print(f"Context: ...{text[max(0, idx-100):idx+200]}...")
    else:
        print("\n❌ EMD/Value nahi mila. Page Preview:")
        print(text[:500])
        
    browser.close()
