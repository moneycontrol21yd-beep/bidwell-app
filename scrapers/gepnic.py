import requests, re, sys, time, json
from bs4 import BeautifulSoup
from datetime import datetime
import psycopg2
from psycopg2.extras import execute_values

DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

SOURCES = {
    'MAHARASHTRA': ('https://mahatenders.gov.in', 'Maharashtra'),
    'UP':          ('https://etender.up.nic.in', 'Uttar Pradesh'),
    'KERALA':      ('https://etenders.kerala.gov.in', 'Kerala'),
    'TAMILNADU':   ('https://tntenders.gov.in', 'Tamil Nadu'),
    'WESTBENGAL':  ('https://wbtenders.gov.in', 'West Bengal'),
    'ODISHA':      ('https://tendersodisha.gov.in', 'Odisha'),
    'JHARKHAND':   ('https://jharkhandtenders.gov.in', 'Jharkhand'),
    'HARYANA':     ('https://etenders.hry.nic.in', 'Haryana'),
    'PUNJAB':      ('https://eproc.punjab.gov.in', 'Punjab'),
    'HIMACHAL':    ('https://hptenders.gov.in', 'Himachal Pradesh'),
    'UTTARAKHAND': ('https://uktenders.gov.in', 'Uttarakhand'),
    'ASSAM':       ('https://assamtenders.gov.in', 'Assam'),
    'DELHI':       ('https://govtprocurement.delhi.gov.in', 'Delhi'),
    'DEFPROC':     ('https://defproc.gov.in', 'Defence'),
}

def parse_date(s):
    if not s: return None
    s = s.strip()
    for fmt in ('%d-%b-%Y %I:%M %p', '%d-%b-%Y', '%d/%m/%Y %H:%M', '%d/%m/%Y'):
        try: return datetime.strptime(s, fmt)
        except: continue
    return None

def scrape_source(name, base_url, state, max_pages=1):
    s = requests.Session()
    try:
        s.get(f'{base_url}/nicgep/app', headers=HEADERS, timeout=20)
    except Exception as e:
        print(f'[{name}] homepage fail: {e}')
        return []
    
    url = f'{base_url}/nicgep/app?page=FrontEndLatestActiveTenders&service=page'
    try:
        r = s.get(url, headers=HEADERS, timeout=30)
    except Exception as e:
        print(f'[{name}] list fail: {e}')
        return []
    
    if r.status_code != 200:
        print(f'[{name}] bad status: {r.status_code}')
        return []
    
    soup = BeautifulSoup(r.text, 'lxml')
    tenders = []
    
    for table in soup.find_all('table'):
        rows = table.find_all('tr')
        if not rows: continue
        header = rows[0].get_text(' ', strip=True)
        if 'Tender ID' in header and 'Tender Title' in header and 'Closing Date' in header:
            for tr in rows[1:]:
                tds = tr.find_all('td')
                if len(tds) < 5: continue
                cells = [td.get_text(' ', strip=True) for td in tds]
                # NIC GePNIC columns: S.No | Tender ID | Title | Sort | Published | Closing
                # Filter out any cell count mismatch
                if len(cells) < 5: continue
                # Skip if last cell doesn't look like a date
                try:
                    tender_id = cells[1].strip()
                    title = cells[2].strip()
                    pub_date = parse_date(cells[-2])
                    close_date = parse_date(cells[-1])
                except: continue
                if not tender_id or not title: continue
                if not re.match(r'^[0-9]{4}_', tender_id) and len(tender_id) < 6: continue
                
                # find link
                link = tds[1].find('a')
                detail_url = ''
                if link and link.get('href'):
                    href = link['href']
                    if href.startswith('http'):
                        detail_url = href
                    else:
                        detail_url = base_url + '/nicgep/' + href.lstrip('/')
                
                tenders.append({
                    'source': name,
                    'source_tender_id': tender_id,
                    'title': title[:2000],
                    'org_name': None,
                    'state': state,
                    'category': None,
                    'value': None,
                    'emd': None,
                    'published_date': pub_date,
                    'closing_date': close_date,
                    'source_url': detail_url or url,
                })
            break  # found the table
    return tenders

def save(tenders):
    if not tenders: return 0
    cn = psycopg2.connect(DB, connect_timeout=30)
    cu = cn.cursor()
    rows = [(t['source'], t['source_tender_id'], t['title'], t['org_name'], t['state'],
             t['category'], t['value'], t['emd'], t['published_date'], t['closing_date'],
             t['source_url']) for t in tenders]
    execute_values(cu, '''
        INSERT INTO active_tenders (source, source_tender_id, title, org_name, state,
            category, value, emd, published_date, closing_date, source_url)
        VALUES %s
        ON CONFLICT (source, source_tender_id) DO UPDATE SET
            title = EXCLUDED.title,
            closing_date = EXCLUDED.closing_date,
            last_seen_at = NOW()
    ''', rows)
    n = cu.rowcount
    cn.commit(); cu.close(); cn.close()
    return n

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'test'
    
    if mode == 'test':
        name = 'MAHARASHTRA'
        url, state = SOURCES[name]
        print(f'Testing {name}...')
        tenders = scrape_source(name, url, state)
        print(f'Extracted: {len(tenders)}')
        for t in tenders[:5]:
            print(json.dumps({k: str(v) if v else None for k, v in t.items()}, ensure_ascii=False)[:300])
    else:
        total_inserted = 0
        for name, (url, state) in SOURCES.items():
            print(f'=== {name} ===', flush=True)
            try:
                tenders = scrape_source(name, url, state)
                n = save(tenders)
                total_inserted += n
                print(f'  extracted={len(tenders)} saved={n}', flush=True)
            except Exception as e:
                print(f'  ERROR: {e}', flush=True)
            time.sleep(2)
        print(f'TOTAL INSERTED/UPDATED: {total_inserted}', flush=True)
