import requests, re, time, sys
import urllib3
from datetime import datetime
from bs4 import BeautifulSoup
urllib3.disable_warnings()

# Yahan apni Supabase Anon Key daalna (NEXT_PUBLIC_SUPABASE_ANON_KEY)
SUPABASE_URL = "https://mvelgzwtopfanrrdtxoo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZWxnend0b3BmYW5ycmR0eG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2NjM5MywiZXhwIjoyMTA2NDQyMzkzfQ.ukPKWb6T7cKqc0Xsu6jrEsHNJe-lXb8Y3dU9EQSQauM"

H = {"User-Agent": "Mozilla/5.0 Chrome/120.0"}

def detect_state(text, default_state):
    text = text.lower()
    if "delhi" in text or "nct" in text: return "Delhi"
    if "mumbai" in text or "maharashtra" in text: return "Maharashtra"
    if "bhopal" in text or "indore" in text or "madhya pradesh" in text: return "Madhya Pradesh"
    if "jaipur" in text or "rajasthan" in text: return "Rajasthan"
    if "chennai" in text or "tamil nadu" in text: return "Tamil Nadu"
    return default_state

STATES = {
  "Maharashtra": "https://mahatenders.gov.in",
  "Rajasthan": "https://eproc.rajasthan.gov.in",
  "Kerala": "https://etenders.kerala.gov.in",
  "Tamil Nadu": "https://tntenders.gov.in",
  "Haryana": "https://etenders.hry.nic.in",
  "Punjab": "https://eproc.punjab.gov.in",
  "Odisha": "https://tendersodisha.gov.in",
  "Uttarakhand": "https://uktenders.gov.in",
  "Himachal Pradesh": "https://hptenders.gov.in",
  "Assam": "https://assamtenders.gov.in",
}

def parse(html, st):
  s = BeautifulSoup(html, "lxml"); out = []
  for tb in s.find_all("table"):
    for tr in tb.find_all("tr"):
      c = tr.find_all("td")
      if len(c) < 5: continue
      tx = [x.get_text(" ", strip=True) for x in c]
      tx = [x for x in tx if x]
      t, l = "", ""
      for i in [4,3,5,2]:
        if i < len(c):
          v = c[i].get_text(" ", strip=True)
          if 30 < len(v) < 600:
            a = c[i].find("a"); t = v
            if a and a.get("href"): l = a["href"]
            break
      if len(t) < 30: continue
      if any(j in t.lower() for j in ["guide line","circular","as per order"]): continue
      
      d = [x for x in tx if re.match(r"^\d{2}[-/]\d{2}[-/]\d{4}", x)]
      dl = d[-1] if d else ""
      
      o = ""
      for x in tx:
        if x != t and 5 < len(x) < 200 and not re.match(r"^\d", x): o = x; break
      
      if l.startswith("/"): l = "https://eprocure.gov.in" + l
      elif not l.startswith("http"): continue
      
      actual_state = detect_state(t + " " + (o or ""), st)
      
      # Supabase schema ke hisaab se data format
      out.append({
          "source": "State Portal", 
          "source_tender_id": f"{st[:3].lower()}_{abs(hash(l))%10**12}", 
          "title": t[:500], 
          "org_name": (o or st)[:300], 
          "state": actual_state, 
          "category": "Works", 
          "source_url": l
      })
  return out

def fetch(name, base, s):
  try:
    r = s.get(f"{base}/nicgep/app?page=FrontEndLatestActiveTenders&service=page", timeout=15, verify=False)
    return parse(r.text, name) if r.status_code == 200 else []
  except: return []

def push(rows):
  if not rows: return 0
  url = f"{SUPABASE_URL}/rest/v1/live_tenders?on_conflict=source_tender_id"
  headers = {
      "apikey": SUPABASE_KEY,
      "Authorization": f"Bearer {SUPABASE_KEY}",
      "Content-Type": "application/json",
      "Prefer": "resolution=ignore-duplicates" # ON CONFLICT DO NOTHING ke barabar
  }
  try:
      r = requests.post(url, headers=headers, json=rows, timeout=20)
      if r.status_code in [200, 201]:
          return len(rows)
      else:
          print(f"  [Supabase Error] {r.status_code}: {r.text}")
          return 0
  except Exception as e:
      print(f"  [Network Error] {e}")
      return 0

def main():
  tgt = sys.argv[1] if len(sys.argv) > 1 else None
  print(f"[START] {datetime.now()}", flush=True)
  s = requests.Session(); s.headers.update(H)
  items = [(tgt, STATES[tgt])] if tgt and tgt in STATES else STATES.items()
  tot = 0
  for n, b in items:
    r = fetch(n, b, s)
    print(f"[{n}] Found: {len(r)}", flush=True)
    if r:
      i = push(r); print(f"  Inserted: {i}", flush=True); tot += i
    time.sleep(1)
  print(f"[TOTAL INSERTED] {tot}", flush=True)

if __name__ == "__main__": main()
