import requests, re, time
from datetime import datetime
from bs4 import BeautifulSoup
import psycopg2, urllib3
urllib3.disable_warnings()
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
H = {'User-Agent': 'Mozilla/5.0 Chrome/120.0'}
PSU = {
  'BHEL': 'https://www.bhel.com/tenders',
  'NTPC': 'https://www.ntpc.co.in/en/tenders',
  'ONGC': 'https://ongcindia.com/web/eng/tenders',
  'SAIL': 'https://sail.co.in/en/tenders',
  'GAIL': 'https://gailonline.com/CRAllTenders.html',
  'IOCL': 'https://iocl.com/latest-tenders',
  'BPCL': 'https://www.bharatpetroleum.in/tenders',
  'HPCL': 'https://www.hindustanpetroleum.com/tenders',
  'CoalIndia': 'https://coalindia.in/tenders',
  'NHAI': 'https://nhai.gov.in/tenders',
}
def parse(h, src):
    s = BeautifulSoup(h, 'lxml'); out = []
    for tb in s.find_all('table'):
        for tr in tb.find_all('tr'):
            c = tr.find_all('td')
            if len(c) < 3: continue
            tx = [x.get_text(' ', strip=True) for x in c]
            tx = [x for x in tx if x]
            t, l = '', ''
            for i in range(len(c)):
                v = c[i].get_text(' ', strip=True)
                if 20 < len(v) < 600:
                    a = c[i].find('a')
                    if a and a.get('href'):
                        t = v; l = a['href']; break
            if len(t) < 20: continue
            if l.startswith('/'):
                from urllib.parse import urlparse
                p = urlparse(PSU.get(src, 'https://example.com'))
                l = f'{p.scheme}://{p.netloc}' + l
            elif not l.startswith('http'): continue
            out.append({'tid': f'{src.lower()}_{abs(hash(l))%10**12}', 't': t[:500], 'o': src, 'u': l, 'd': t[:500]})
    return out
s = requests.Session(); s.headers.update(H)
print(f'[START] {datetime.now()}', flush=True)
all_r = []
for name, url in PSU.items():
    try:
        r = s.get(url, timeout=15, verify=False)
        print(f'{name}: {r.status_code}', flush=True)
        if r.status_code == 200:
            rows = parse(r.text, name)
            print(f'  {len(rows)} records', flush=True)
            all_r.extend(rows)
    except Exception as e: print(f'{name}: err', flush=True)
    time.sleep(1)
if all_r:
    cn = psycopg2.connect(DB, connect_timeout=30); cu = cn.cursor(); n = 0
    for r in all_r:
        try:
            cu.execute('INSERT INTO brain_awards (tender_id,title,org_name,portal_type,aoc_date,winner_name,contract_value,bid_count,tender_type,source_url,product_category,product_sub_category,completion_period,description,state) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (tender_id) DO NOTHING', (r['tid'], r['t'], r['o'], 'PSU', None, '', 0, 0, 'Works', r['u'], '', '', '', r['d'], ''))
            n += cu.rowcount
        except: continue
    cn.commit(); cu.close(); cn.close()
    print(f'[DONE] Inserted {n}', flush=True)
else:
    print('[DONE] 0 records', flush=True)
