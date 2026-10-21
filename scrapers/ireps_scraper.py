import requests
from bs4 import BeautifulSoup
import psycopg2
from datetime import datetime, timedelta

def fetch_ireps_tenders():
    date_to = datetime.now().strftime('%d/%m/%Y')
    date_from = (datetime.now() - timedelta(days=15)).strftime('%d/%m/%Y')
    
    data = {
        'searchOption': '1',
        'searchOptorOption': '0',
        'advancedSearch': '',
        'organization': '01',
        'workArea': '-1',
        'railwayZone': '-1',
        'division': '-1',
        'unit': '-1',
        'tenderStage': '-1',
        'tenderType': '-1',
        'bidding': '-1',
        'selectDate': 'TENDER_OPENING_DATE',
        'dateFrom': date_from,
        'dateTo': date_to,
        'submit': 'Show+Results',
        'searchParam': ''
    }
    
    url = 'https://www.ireps.gov.in/epsn/anonymSearch.do'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    
    try:
        response = requests.post(url, data=data, headers=headers, timeout=30)
        soup = BeautifulSoup(response.content, 'lxml')
        rows = soup.select("table[bordercolor='#4D817A'] tr")
        return rows
    except Exception as e:
        print(f'Error: {e}')
        return []

def save_to_db(rows):
    conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
    cur = conn.cursor()
    inserted = 0
    
    for row in rows[1:]:
        cols = [td.get_text(strip=True) for td in row.find_all('td')]
        if len(cols) < 6: continue
        
        source_tender_id = cols[1]
        title = cols[2]
        closing_date_str = cols[5]
        
        try:
            closing_date = datetime.strptime(closing_date_str, '%d/%m/%Y %H:%M')
        except:
            closing_date = None
            
        cur.execute('''
            INSERT INTO active_tenders (source, source_tender_id, title, org_name, state, closing_date, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (source, source_tender_id) DO NOTHING
        ''', ('IREPS', source_tender_id, title, cols[0], 'All India', closing_date, 'active'))
        inserted += cur.rowcount
        
    conn.commit()
    cur.close()
    conn.close()
    print(f'IREPS: {inserted} naye tenders insert hue.')

if __name__ == '__main__':
    print('Fetching IREPS data...')
    rows = fetch_ireps_tenders()
    if rows:
        save_to_db(rows)
    else:
        print('Data nahi mila ya website blocked hai.')
