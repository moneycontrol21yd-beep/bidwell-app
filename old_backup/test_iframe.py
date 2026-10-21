import requests
from bs4 import BeautifulSoup

test_url = "https://eprocure.gov.in/cppp/tendersfullview/MTEwMzg5MDE=" 
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print(f"Fetching: {test_url}")
res = requests.get(test_url, headers=headers, timeout=15)

if res.status_code == 200:
    soup = BeautifulSoup(res.text, 'html.parser')
    
    # 1. Check for Iframes
    iframes = soup.find_all('iframe')
    print(f"\nFound {len(iframes)} iframes:")
    for i, iframe in enumerate(iframes):
        print(f"  {i+1}. SRC: {iframe.get('src')}")

    # 2. Check for PDF or Download links
    links = soup.find_all('a', href=True)
    print("\nSearching for PDF/Download links in the page:")
    found_pdf = False
    for a in links:
        href = a['href'].lower()
        if '.pdf' in href or 'download' in href or 'tenderdoc' in href:
            print(f"  -> Found: {a['href']}")
            found_pdf = True
            
    if not found_pdf:
        print("  No direct PDF links found.")

    # 3. Print a snippet of the body to see what it *does* have
    print("\n--- BODY TEXT SNIPPET ---")
    body_text = soup.body.get_text(' ', strip=True) if soup.body else "No body found"
    print(body_text[:500] + "...")
else:
    print("Failed to load page.")
