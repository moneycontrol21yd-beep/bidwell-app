from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Maharashtra ke 'Tenders by Organisation' page pe jao
        url = 'https://mahatenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page'
        print(f'Navigating to {url}...')
        page.goto(url, timeout=60000)
        page.wait_for_timeout(5000)
        
        content = page.content()
        if 'captcha' in content.lower():
            print('❌ Captcha found on Organisation page.')
        else:
            print('✅ No Captcha on Organisation page!')
            # Yahan humein saare departments ki list milegi
            links = page.locator('a').all()
            print(f'Total links found: {len(links)}')
            # Top 3 department links print karo
            for link in links[:5]:
                text = link.inner_text()
                if text.strip():
                    print(f'Department: {text}')
        
        browser.close()

if __name__ == '__main__':
    run()
