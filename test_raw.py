import requests

# Wahi test URL
test_url = "https://eprocure.gov.in/cppp/tendersfullview/MTEwMzg5MDE=" 
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

print(f"Fetching: {test_url}")
res = requests.get(test_url, headers=headers, timeout=15)

if res.status_code == 200:
    # Check if EMD or Earnest Money is in the raw HTML
    if "EMD" in res.text or "Earnest" in res.text:
        print("✅ Found 'EMD' keyword in raw HTML!")
        
        # Find where it is and print surrounding code
        idx = res.text.find("EMD")
        if idx == -1: idx = res.text.find("Earnest")
        
        print("\n--- HTML CONTEXT AROUND 'EMD' ---")
        print(res.text[max(0, idx-500):idx+500])
    else:
        print("❌ 'EMD' not found in raw HTML. It might be inside an iframe or loaded via Javascript.")
        print("First 500 chars of HTML:", res.text[:500])
