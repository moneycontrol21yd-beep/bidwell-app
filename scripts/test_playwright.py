from playwright.sync_api import sync_playwright

def run():
    print('Testing alternate NIC endpoint...')
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Tenders by Organisation URL (Aksar captcha free hota hai)
        url = 'https://mahatenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page'
        print(f'Navigating to {url}...')
        page.goto(url, timeout=60000)
        page.wait_for_timeout(5000) 
        
        content = page.content()
        print('Page loaded. Size:', len(content))
        
        if 'captcha' in content.lower():
            print('❌ CAPTCHA STILL PRESENT.')
        else:
            print('✅ SUCCESS! NO CAPTCHA.')
            # Check karo kya data aa raha hai
            print('Page Text Sample:')
            print(page.locator('body').inner_text()[:200])
        
        browser.close()

if __name__ == '__main__':
    run()
