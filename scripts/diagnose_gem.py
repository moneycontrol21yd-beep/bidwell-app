import requests, json

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://bidplus.gem.gov.in/all-bids",
    "Origin": "https://bidplus.gem.gov.in",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
}

def main():
    print("GeM se connect ho raha hai...")
    session = requests.Session()
    
    # Token nikaalo
    r = session.get("https://bidplus.gem.gov.in/all-bids", headers=HEADERS)
    csrf = session.cookies.get('csrf_gem_cookie')
    if not csrf:
        print("❌ CSRF token nahi mila.")
        return

    print("Data fetch ho raha hai...")
    url = "https://bidplus.gem.gov.in/all-bids-data"
    
    # PURANA WALA PAYLOAD (Jo pehle kaam kar raha tha)
    data = {
        "page": 1,
        "param": "",
        "filter": "",
        "searchBid": "",
        "searchType": "fullText",
        "csrf_test_name": csrf,
        "csrf_bd_gem_nk": csrf
    }

    res = session.post(url, headers=HEADERS, data=data)
    
    try:
        json_data = res.json()
        
        # Data dhoondhne ka koshish karo
        docs = json_data.get("docs", []) or json_data.get("response", {}).get("docs", [])
        
        if docs:
            print("\n✅ Data mil gaya! Ye raha PEHLE TENDER ka raw data:\n")
            print("--------------------------------------------------")
            print(json.dumps(docs[0], indent=2))
            print("--------------------------------------------------")
            print("\nBhai, bas is upar wale code ko copy karke mujhe bhej do.")
        else:
            print("\n❌ Data list nahi mili. Ye raha raw response ka chhota hissa:")
            print(str(json_data)[:1000])
            
    except Exception as e:
        print("\n❌ JSON parse error. Ye raha raw HTML/Text response:")
        print(res.text[:1000])

if __name__ == "__main__":
    main()
