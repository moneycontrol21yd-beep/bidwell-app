import os, json, re, time, sys
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import requests
from urllib.parse import urlparse

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

SOURCES = [
    ("Maharashtra", "https://mahatenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Delhi", "https://govtprocurement.delhi.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("UP", "https://etender.up.nic.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("MP", "https://mptenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("WB", "https://wbtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Kerala", "https://etenders.kerala.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Haryana", "https://etenders.hry.nic.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Punjab", "https://eproc.punjab.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Odisha", "https://tendersodisha.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Jharkhand", "https://jharkhandtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Assam", "https://assamtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Uttarakhand", "https://uktenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("HP", "https://hptenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Bihar", "https://eproc2.bihar.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Rajasthan", "https://eproc.rajasthan.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Gujarat", "https://tender.gujarat.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Karnataka", "https://eproc.karnataka.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("TN", "https://tntenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Telangana", "https://tender.telangana.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Chhattisgarh", "https://eproc.cgstate.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Chandigarh", "https://etenders.chd.nic.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Goa", "https://tender.goa.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Meghalaya", "https://meghatenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Manipur", "https://manipurtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Mizoram", "https://mizoramtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Nagaland", "https://nagalandtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Tripura", "https://tripuratenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
    ("Sikkim", "https://sikkimtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page"),
]

REQUIRED = ["supply", "installation", "construction", "service", "maintenance", "repair", "work", "project", "tender", "procurement", "contract", "equipment", "material", "civil", "electrical", "security", "cleaning", "housekeeping", "transportation", "software", "network", "manpower", "catering", "facility", "guard", "road", "building", "water", "hospital", "school", "vehicle", "computer", "furniture", "printing", "medical", "food"]

JUNK = ["version :", "rights reserved", "site best viewed", "instruction to bidders", "correspondence address", "e-procurement cell", "published date closing", "tenders nic", "screen reader", "search | active", "results of tenders", "kind attention", "as per order", "mis reports", "tenders by location", "designed, developed", "national informatics", "etendering system", "eprocurement system", "welcome to", "cancellation or finalization", "regarding publishing", "bidder manual", "standard bid", "guidelines", "request for proposal", "online payment", "provide captcha", "fee collection"]


def clean(t):
    return re.sub(r"\s+", " ", t).strip() if t else ""

def is_date(t):
    return bool(re.match(r"^\d{2}[-/]\d{2}[-/]\d{4}", t.strip()))

def valid(t):
    if not t:
        return False
    t = t.strip()
    if len(t) < 30 or len(t) > 500:
        return False
    tl = t.lower()
    if any(j in tl for j in JUNK):
        return False
    if is_date(t):
        return False
    if not any(k in tl for k in REQUIRED):
        return False
    if t.count(" ") < 5:
        return False
    return True

def parse_page(html, source_url):
    soup = BeautifulSoup(html, "lxml")
    out = []
    src_name = urlparse(source_url).netloc.split(".")[0].title()
    for table in soup.find_all("table"):
        for row in table.find_all("tr"):
            cells = row.find_all("td")
            if len(cells) < 3:
                continue
            texts = [clean(c.get_text(" ", strip=True)) for c in cells]
            if any("tender title" in t.lower() for t in texts[:3]):
                continue
            title = None
            for t in texts:
                if valid(t):
                    if title is None or len(t) > len(title):
                        title = t
            if not title:
                continue
            ref = ""
            for t in texts:
                if t == title:
                    continue
                if re.search(r"(NIT|NNK|REF|NO)[\s\./]", t) and len(t) < 100:
                    ref = t
                    break
            dates = [t for t in texts if is_date(t)]
            pub = dates[0] if dates else ""
            dl = dates[1] if len(dates) > 1 else ""
            link = row.find("a")
            url = ""
            if link and link.get("href"):
                h = link["href"]
                if h.startswith("http"):
                    url = h
                elif h.startswith("/"):
                    p = urlparse(source_url)
                    url = f"{p.scheme}://{p.netloc}{h}"
            out.append({
                "title": title[:350],
                "department": ref[:150],
                "published_date": pub,
                "deadline": dl,
                "source": src_name,
                "source_url": url,
                "status": "active",
                "scraped_at": datetime.now().isoformat()
            })
    return out


def new_driver():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0")
    return webdriver.Chrome(options=opts)


def push_to_supabase(tenders):
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Missing SUPABASE credentials")
        return
    url = f"{SUPABASE_URL}/rest/v1/tenders"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    imported = 0
    for t in tenders:
        try:
            r = requests.post(url, headers=headers, json=t, timeout=15)
            if r.status_code in [200, 201, 204]:
                imported += 1
        except:
            pass
    print(f"Pushed {imported}/{len(tenders)} to Supabase")


def main():
    print("=" * 60)
    print(f"BidWell All-India Scraper - {datetime.now().strftime('%d %b %Y %I:%M %p')}")
    print("=" * 60)

    all_tenders = []
    driver = new_driver()
    driver.set_page_load_timeout(60)

    for i, (name, url) in enumerate(SOURCES, 1):
        print(f"[{i}/{len(SOURCES)}] {name}...", flush=True)
        try:
            driver.get(url)
            time.sleep(4)
            html = driver.page_source
            if len(html) < 15000:
                print(f"   small page - skip")
                continue
            tenders = parse_page(html, url)
            print(f"   {len(tenders)} tenders", flush=True)
            all_tenders.extend(tenders)
        except Exception as e:
            print(f"   error: {str(e)[:60]}", flush=True)
            try:
                driver.quit()
            except:
                pass
            time.sleep(2)
            driver = new_driver()
            driver.set_page_load_timeout(60)

        if i % 7 == 0:
            try:
                driver.quit()
            except:
                pass
            time.sleep(2)
            driver = new_driver()
            driver.set_page_load_timeout(60)
            print("   browser restarted", flush=True)

    try:
        driver.quit()
    except:
        pass

    seen = set()
    unique = []
    for t in all_tenders:
        k = t["title"][:70].lower()
        if k not in seen:
            seen.add(k)
            unique.append(t)

    print(f"\nTotal: {len(all_tenders)} | Unique: {len(unique)}")

    if unique:
        fn = f"all_india_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
        with open(fn, "w", encoding="utf-8") as f:
            json.dump(unique, f, indent=2, ensure_ascii=False)
        print(f"Saved: {fn}")
        counts = {}
        for t in unique:
            counts[t["source"]] = counts.get(t["source"], 0) + 1
        for s, c in sorted(counts.items(), key=lambda x: -x[1]):
            print(f"   {s}: {c}")
        
        push_to_supabase(unique)


if __name__ == "__main__":
    main()
