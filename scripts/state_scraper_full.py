import requests, re, time, sys
import urllib3
from datetime import datetime
from bs4 import BeautifulSoup
import psycopg2
urllib3.disable_warnings()

DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
H = {'User-Agent': 'Mozilla/5.0 Chrome/120.0'}
STATES = {
  'Maharashtra': 'https://mahatenders.gov.in',
  'Rajasthan': 'https://eproc.rajasthan.gov.in',
  'Kerala': 'https://etenders.kerala.gov.in',
  'Tamil Nadu': 'https://tntenders.gov.in',
  'Haryana': 'https://etenders.hry.nic.in',
  'Punjab': 'https://eproc.punjab.gov.in',
  'Odisha': 'https://tendersodisha.gov.in',
  'Uttarakhand': 'https://uktenders.gov.in',
  'Himachal Pradesh': 'https://hptenders.gov.in',
  'Assam': 'https://assamtenders.gov.in',
  'Uttar Pradesh': 'https://etender.up.nic.in',
  'Madhya Pradesh': 'https://mptenders.gov.in',
  'West Bengal': 'https://wbtenders.gov.in',
  'Gujarat': 'https://nprocure.gujarat.gov.in',
  'Karnataka': 'https://eproc.karnataka.gov.in',
  'Jharkhand': 'https://jharkhandtenders.gov.in',
}

def parse(html, st):
  s = BeautifulSoup(html, 'lxml'); out = []
  for tb in s.find_all('table'):
    for tr in tb.find_all('tr'):
      c = tr.find_all('td')
      if len(c) < 5: continue
      tx = [x.get_text(' ', strip=True) for x in c]
      tx = [x for x in tx if x]
      t, l = '', ''
      for i in [4,3,5,2]:
        if i < len(c):
          v = c[i].get_text(' ', strip=True)
          if 30 < len(v) < 600:
            a = c[i].find('a'); t = v
            if a and a.get('href'): l = a['href']
            break
      if len(t) < 30: continue
      if any(j in t.lower() for j in ['guide line','circular','as per order']): continue
      d = [x for x in tx if re.match(r'^\d{2}[-/]\d{2}[-/]\d{4}', x)]
      dl = d[-1] if d else ''
      o = ''
      for x in tx:
        if x != t and 5 < len(x) < 200 and not re.match(r'^\d', x): o = x; break
      if l.startswith('/'): l = f'{STATES.get(st, "")}' + l
      elif not l.startswith('http'): continue
      out.append({'tid': f'{st[:3].lower()}_{abs(hash(l))%10**12}', 't': t[:500], 'o': (o or st)[:300], 'st': st, 'dl': dl or None, 'u': l, 'd': t[:500]})
  return out

def fetch_page(s, base, page):
  try:
    url = f'{base}/nicgep/app?page=FrontEndLatestActiveTenders&service=page&page_num={page}'
    r = s.get(url, timeout=15, verify=False)
    return r.text if r.status_code == 200 else None
  except: return None

def push(rows):
  if not rows: return 0
  try:
    cn = psycopg2.connect(DB, connect_timeout=30); cu = cn.cursor(); n = 0
    for r in rows:
      try:
        cu.execute('INSERT INTO brain_awards (tender_id,title,org_name,portal_type,aoc_date,winner_name,contract_value,bid_count,tender_type,source_url,product_category,product_sub_category,completion_period,description,state) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (tender_id) DO NOTHING', (r['tid'], r['t'], r['o'], r['st'], r['dl'], '', 0, 0, 'Works', r['u'], '', '', '', r['d'], r['st']))
        n += cu.rowcount
      except: continue
    cn.commit(); cu.close(); cn.close(); return n
  except: return 0

def main():
  tgt = sys.argv[1] if len(sys.argv) > 1 else None
  print(f'[START] {datetime.now()}', flush=True)
  s = requests.Session(); s.headers.update(H)
  items = [(tgt, STATES[tgt])] if tgt and tgt in STATES else STATES.items()
  tot = 0
  for name, base in items:
    total_state = 0
    for page in range(1, 51):
      h = fetch_page(s, base, page)
      if not h: break
      rows = parse(h, name)
      if not rows: break
      n = push(rows)
      total_state += n
      if page % 10 == 0: print(f'  {name} page {page}: +{total_state}', flush=True)
      time.sleep(1)
    print(f'[{name}] {total_state} inserted', flush=True)
    tot += total_state
  print(f'[TOTAL] {tot}', flush=True)

main()
