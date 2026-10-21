import requests, re
from datetime import datetime
from bs4 import BeautifulSoup
import psycopg2, urllib3
urllib3.disable_warnings()
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
H = {'User-Agent': 'Mozilla/5.0 Chrome/120.0'}
def parse(h):
    s = BeautifulSoup(h, 'lxml'); out = []
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
            d = [x for x in tx if re.match(r'^\d{2}[-/]\d{2}[-/]\d{4}', x)]
            dl = d[-1] if d else ''
            o = ''
            for x in tx:
                if x != t and 5 < len(x) < 200 and not re.match(r'^\d', x): o = x; break
            if l.startswith('/'): l = 'https://defproc.gov.in' + l
            elif not l.startswith('http'): continue
            out.append({'tid': f'def_{abs(hash(l))%10**12}', 't': t[:500], 'o': (o or 'Defence')[:300], 'dl': dl or None, 'u': l, 'd': t[:500]})
    return out
s = requests.Session(); s.headers.update(H)
print(f'[START] {datetime.now()}', flush=True)
all_r = []
urls = [
    'https://defproc.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page',
    'https://defproc.gov.in/nicgep/app?page=FrontEndAdvancedSearchResult&service=page',
]
for u in urls:
    try:
        r = s.get(u, timeout=20, verify=False)
        print(f'{r.status_code} - {u[:70]}', flush=True)
        if r.status_code == 200:
            rows = parse(r.text); print(f'  {len(rows)} records', flush=True)
            all_r.extend(rows)
    except Exception as e: print(f'  err: {str(e)[:60]}', flush=True)
if all_r:
    cn = psycopg2.connect(DB, connect_timeout=30); cu = cn.cursor(); n = 0
    for r in all_r:
        try:
            cu.execute('INSERT INTO brain_awards (tender_id,title,org_name,portal_type,aoc_date,winner_name,contract_value,bid_count,tender_type,source_url,product_category,product_sub_category,completion_period,description,state) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (tender_id) DO NOTHING', (r['tid'], r['t'], r['o'], 'DefProc', r['dl'], '', 0, 0, 'Works', r['u'], '', '', '', r['d'], ''))
            n += cu.rowcount
        except: continue
    cn.commit(); cu.close(); cn.close()
    print(f'[DONE] Inserted {n}', flush=True)
else:
    print('[DONE] 0 records', flush=True)
