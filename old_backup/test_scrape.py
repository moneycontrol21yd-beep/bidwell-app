import requests
from bs4 import BeautifulSoup
import re

# Ek dummy URL (jo hum database se le rahe hain, par test ke liye random CPPP URL lete hain)
test_url = "https://eprocure.gov.in/cppp/tendersfullview/MTEwMzg5MDE=" # Ek sample URL

print(f"Fetching test URL: {test_url}")
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

try:
    res = requests.get(test_url, headers=headers, timeout=15)
    print(f"Status Code: {res.status_code}")
    
    if res.status_code == 200:
        soup = BeautifulSoup(res.text, 'lxml')
        text = soup.get_text(' ', strip=True)
        
        # Search for the word EMD and print the context around it
        print("\n--- SEARCHING FOR 'EMD' IN PAGE TEXT ---")
        for match in re.finditer(r'(?i)EMD', text):
            start = max(0, match.start() - 50)
            end = min(len(text), match.end() + 100)
            print(f"Context: ...{text[start:end]}...")
            print("-" * 30)
            
        print("\n--- SEARCHING FOR 'VALUE' IN PAGE TEXT ---")
        for match in re.finditer(r'(?i)value', text):
            start = max(0, match.start() - 50)
            end = min(len(text), match.end() + 100)
            print(f"Context: ...{text[start:end]}...")
            print("-" * 30)
            
    else:
        print("Failed to fetch. Page might be down or blocking bots.")
except Exception as e:
    print(f"Error: {e}")
