from fastapi import FastAPI, HTTPException, Query, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from psycopg2 import pool
from typing import Optional
import os

API_TOKEN = os.getenv('BIDWELL_API_TOKEN', 'change-this-token-now')
DB_DSN = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'

pg_pool = pool.SimpleConnectionPool(1, 10, DB_DSN)

app = FastAPI(title='BidWell Brain API', version='1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://bidwell-app-six.vercel.app'],
    allow_methods=['GET'],
    allow_headers=['*'],
)

def auth(authorization: Optional[str] = Header(None)):
    if not authorization or authorization != f'Bearer {API_TOKEN}':
        raise HTTPException(401, 'Unauthorized')

def q(sql, params=None):
    conn = pg_pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute(sql, params or ())
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        return rows
    finally:
        pg_pool.putconn(conn)

@app.get('/health')
def health():
    try:
        r = q('SELECT COUNT(*) AS c FROM awards')
        return {'status': 'ok', 'awards_count': r[0]['c']}
    except Exception as e:
        raise HTTPException(500, str(e))

@app.get('/awards/org-history', dependencies=[Depends(auth)])
def org_history(org: str = Query(..., min_length=2), years: int = 5):
    return q('''
        SELECT 
            winner_name,
            COUNT(*) AS wins,
            ROUND(AVG(contract_value)) AS avg_value,
            ROUND(AVG(bid_count), 1) AS avg_bids,
            MAX(year) AS last_year
        FROM awards
        WHERE org_name ILIKE %s 
          AND year >= EXTRACT(YEAR FROM NOW()) - %s
          AND winner_name IS NOT NULL
        GROUP BY winner_name
        ORDER BY wins DESC
        LIMIT 10
    ''', (f'%{org}%', years))

@app.get('/awards/competitor', dependencies=[Depends(auth)])
def competitor(winner: str = Query(..., min_length=2)):
    return q('''
        SELECT 
            tender_id, title, org_name, year, contract_value, bid_count
        FROM awards
        WHERE winner_name ILIKE %s
        ORDER BY year DESC
        LIMIT 50
    ''', (f'%{winner}%',))

@app.get('/awards/price-benchmark', dependencies=[Depends(auth)])
def price_benchmark(category: Optional[str] = None, state: Optional[str] = None, years: int = 5):
    where = ['contract_value > 0', 'year >= EXTRACT(YEAR FROM NOW()) - %s']
    params = [years]
    if category:
        where.append('(title ILIKE %s OR description ILIKE %s)')
        params.extend([f'%{category}%', f'%{category}%'])
    if state:
        where.append('org_name ILIKE %s')
        params.append(f'%{state}%')
    sql = f'''
        SELECT 
            COUNT(*) AS sample_size,
            ROUND(MIN(contract_value)) AS min_value,
            ROUND(AVG(contract_value)) AS avg_value,
            ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY contract_value)) AS median_value,
            ROUND(MAX(contract_value)) AS max_value
        FROM awards
        WHERE {' AND '.join(where)}
    '''
    return q(sql, params)

@app.get('/brain/company-insights', dependencies=[Depends(auth)])
def company_insights(org_pattern: str = Query(..., min_length=2)):
    return {
        'recent_winners': q('''
            SELECT winner_name, COUNT(*) AS wins, MAX(year) AS last_win
            FROM awards WHERE org_name ILIKE %s AND winner_name IS NOT NULL
            GROUP BY winner_name ORDER BY wins DESC LIMIT 10
        ''', (f'%{org_pattern}%',)),
        'avg_bids': q('''
            SELECT ROUND(AVG(bid_count), 1) AS avg_bids, COUNT(*) AS sample
            FROM awards WHERE org_name ILIKE %s AND bid_count > 0
        ''', (f'%{org_pattern}%',)),
        'value_range': q('''
            SELECT ROUND(MIN(contract_value)) AS min_v, ROUND(AVG(contract_value)) AS avg_v,
                   ROUND(MAX(contract_value)) AS max_v, COUNT(*) AS sample
            FROM awards WHERE org_name ILIKE %s AND contract_value > 0
        ''', (f'%{org_pattern}%',)),
    }

@app.get('/tenders', dependencies=[Depends(auth)])
def get_tenders(limit: int = 50, offset: int = 0, search: Optional[str] = None, state: Optional[str] = None):
    where = ["status = 'active'"]
    params = []
    
    if search:
        where.append('(title ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{search}%', f'%{search}%'])
    if state:
        where.append('source ILIKE %s')
        params.append(f'%{state}%')
        
    where_clause = ' AND '.join(where)
    
    sql = f'''
        SELECT source, source_tender_id as id, title, org_name as department, 
               closing_date as deadline, source_url
        FROM active_tenders 
        WHERE {where_clause}
        ORDER BY closing_date DESC
        LIMIT %s OFFSET %s
    '''
    params.extend([limit, offset])
    
    # Count query
    count_sql = f'SELECT COUNT(*) as total FROM active_tenders WHERE {where_clause}'
    count_res = q(count_sql, tuple(params[:-2]))
    total = count_res[0]['total'] if count_res else 0
    
    return {'success': True, 'total': total, 'tenders': q(sql, tuple(params))}

@app.get('/tenders/{tender_id}', dependencies=[Depends(auth)])
def get_single_tender(tender_id: str):
    sql = "SELECT source, source_tender_id as id, title, org_name as department, closing_date as deadline, published_date, source_url FROM active_tenders WHERE source_tender_id = %s LIMIT 1"
    res = q(sql, (tender_id,))
    if not res:
        raise HTTPException(status_code=404, detail='Tender not found')
    return res[0]

@app.get('/brain/competitor-intel', dependencies=[Depends(auth)])
def get_competitor_intel(org_pattern: str):
    # Awards table se top winners nikalna
    winners = q('''
        SELECT 
            winner_name, 
            COUNT(*) AS total_wins, 
            ROUND(AVG(contract_value)) AS avg_winning_bid,
            MAX(year) AS last_won_year
        FROM awards 
        WHERE org_name ILIKE %s 
          AND winner_name IS NOT NULL
        GROUP BY winner_name 
        ORDER BY total_wins DESC 
        LIMIT 5
    ''', (f'%{org_pattern}%',))

    # Live active tenders ka count (is department ka)
    live_count = q('''
        SELECT COUNT(*) AS active_tenders
        FROM active_tenders 
        WHERE org_name ILIKE %s 
          AND status = 'active'
    ''', (f'%{org_pattern}%',))

    return {
        'status': 'success',
        'org_pattern': org_pattern,
        'live_active_tenders': live_count[0]['active_tenders'] if live_count else 0,
        'top_competitors': winners
    }

@app.get('/tenders/smart-match', dependencies=[Depends(auth)])
def smart_match(state: str = None, keyword: str = None, limit: int = 5):
    where = ["status = 'active'", "closing_date >= NOW()"]
    params = []
    
    if state:
        # 'UP' ya 'Maharashtra' ya 'Madhya Pradesh' match karega
        where.append('(state ILIKE %s OR source ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{state}%', f'%{state}%', f'%{state}%'])
        
    if keyword:
        where.append('(title ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{keyword}%', f'%{keyword}%'])
        
    where_clause = ' AND '.join(where)
    params.append(limit)
    
    sql = f'''
        SELECT source_tender_id as id, title, org_name as department, 
               state, closing_date as deadline, source_url
        FROM active_tenders 
        WHERE {where_clause}
        ORDER BY closing_date ASC
        LIMIT %s
    '''
    return {'success': True, 'tenders': q(sql, tuple(params))}

@app.get('/api/search-tenders', dependencies=[Depends(auth)])
def search_tenders(state: str = None, keyword: str = None, limit: int = 5):
    where = ["status = 'active'", "closing_date >= NOW()"]
    params = []
    
    if state:
        where.append('(state ILIKE %s OR source ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{state}%', f'%{state}%', f'%{state}%'])
        
    if keyword:
        where.append('(title ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{keyword}%', f'%{keyword}%'])
        
    where_clause = ' AND '.join(where)
    params.append(limit)
    
    sql = f'''
        SELECT source_tender_id as id, title, org_name as department, 
               state, closing_date as deadline, source_url
        FROM active_tenders 
        WHERE {where_clause}
        ORDER BY closing_date ASC
        LIMIT %s
    '''
    return {'success': True, 'tenders': q(sql, tuple(params))}

@app.get('/api/match-profile', dependencies=[Depends(auth)])
def match_profile(state: str = None, keyword: str = None, limit: int = 10):
    where = ["status = 'active'", "closing_date >= NOW()"]
    params = []
    
    if state and state != 'All India':
        where.append('(state ILIKE %s OR source ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{state}%', f'%{state}%', f'%{state}%'])
        
    if keyword:
        where.append('(title ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{keyword}%', f'%{keyword}%'])
        
    where_clause = ' AND '.join(where)
    params.append(limit * 3)
    
    sql = f"""
        SELECT source_tender_id as id, title, org_name as department, 
               state, source, closing_date as deadline, source_url
        FROM active_tenders 
        WHERE {where_clause}
        ORDER BY closing_date ASC
        LIMIT %s
    """
    tenders = q(sql, tuple(params))
    results = []
    
    for t in tenders:
        score = 0
        reasons = []
        
        if state and state != 'All India':
            st = state.lower()
            ts = (t['state'] or '').lower()
            sr = (t['source'] or '').lower()
            if st in ts or st in sr or (st == 'up' and 'uttar pradesh' in ts):
                score += 40
                reasons.append('Location match (+40)')
        else:
            score += 40
            
        if keyword:
            kw = keyword.lower()
            title = t['title'].lower()
            dept = (t['department'] or '').lower()
            if kw in title or kw in dept:
                score += 40
                reasons.append('Sector/Keyword match (+40)')
            else:
                score += 20
        else:
            score += 40
            
        score += 10
        reasons.append('Active Tender (+10)')
        
        if score >= 60:
            t['match_score'] = min(score, 99)
            t['match_reasons'] = reasons
            results.append(t)
            
    results = sorted(results, key=lambda x: x['match_score'], reverse=True)[:limit]
    return {'success': True, 'tenders': results, 'total_matched': len(results)}

@app.get('/api/future-radar', dependencies=[Depends(auth)])
def future_radar(keyword: str = None):
    where = ["year IS NOT NULL"]
    params = []
    
    if keyword:
        where.append('(title ILIKE %s OR org_name ILIKE %s)')
        params.extend([f'%{keyword}%', f'%{keyword}%'])
        
    where_clause = ' AND '.join(where)
    
    sql = f'''
        SELECT 
            org_name, 
            EXTRACT(MONTH FROM aoc_date) as month_num,
            COUNT(*) as historical_count,
            MAX(year) as last_active_year
        FROM awards 
        WHERE {where_clause} AND aoc_date IS NOT NULL
        GROUP BY org_name, EXTRACT(MONTH FROM aoc_date)
        HAVING COUNT(*) > 5
        ORDER BY historical_count DESC
        LIMIT 5
    '''
    
    trends = q(sql, tuple(params))
    
    results = []
    for t in trends:
        results.append({
            'department': t['org_name'],
            'predicted_month': int(t['month_num']),
            'historical_evidence': f"{t['historical_count']} tenders in past years",
            'last_active_year': t['last_active_year'],
            'type': 'Forecast (Historical Pattern)',
            'confidence': 'High' if t['historical_count'] > 20 else 'Medium'
        })
        
    return {'success': True, 'radar_data': results, 'keyword': keyword or 'All'}

@app.get('/api/brain-stats', dependencies=[Depends(auth)])
def brain_stats():
    # 1. Closing Soon (Next 7 days)
    closing = q("SELECT COUNT(*) as c FROM active_tenders WHERE status = 'active' AND closing_date IS NOT NULL")
    
    # 2. Total Live Tenders
    total_live = q("SELECT COUNT(*) as c FROM active_tenders WHERE status = 'active'")
    
    # 3. Total Awards (for historical)
    total_awards = q("SELECT COUNT(*) as c FROM awards")
    
    return {
        'success': True,
        'closing_soon': closing[0]['c'] if closing else 0,
        'total_live': total_live[0]['c'] if total_live else 0,
        'total_awards': total_awards[0]['c'] if total_awards else 0
    }

@app.get('/api/brain-stats', dependencies=[Depends(auth)])
def brain_stats():
    closing = q("SELECT COUNT(*) as c FROM active_tenders WHERE status = 'active' AND closing_date IS NOT NULL")
    return {'success': True, 'closing_soon': closing[0]['c'] if closing else 0}

@app.post('/api/smart-brain', dependencies=[Depends(auth)])
def smart_brain(request: dict):
    user_query = request.get('query', '').lower()
    profile_state = request.get('state', 'All India')
    profile_sector = request.get('sector', '')
    
    # 1. Intent Recognition (AI ka kaam, par abhi hum simple keyword match kar rahe hain)
    if 'competitor' in user_query or 'kaun jeeta' in user_query:
        # Competitor logic
        org_match = f'%{profile_sector}%'
        comps = q("SELECT winner_name, COUNT(*) as wins, ROUND(AVG(contract_value)) as avg_bid FROM awards WHERE org_name ILIKE %s GROUP BY winner_name ORDER BY wins DESC LIMIT 3", (org_match,))
        return {'type': 'competitor', 'reply': f'Aapke sector ({profile_sector}) me top winners ye hain:', 'data': comps}
        
    elif 'live' in user_query or 'tender' in user_query or 'dikhao' in user_query:
        # Live Tender Logic (Rule Engine)
        params = []
        where = ["status = 'active'"]
        
        if profile_state != 'All India':
            where.append("state ILIKE %s")
            params.append(f'%{profile_state}%')
            
        if profile_sector:
            where.append("(title ILIKE %s OR category ILIKE %s)")
            params.extend([f'%{profile_sector}%', f'%{profile_sector}%'])
            
        where_clause = ' AND '.join(where)
        tenders = q(f"SELECT title, org_name, closing_date, source_url FROM active_tenders WHERE {where_clause} ORDER BY closing_date ASC LIMIT 3", tuple(params))
        
        if tenders:
            return {'type': 'tenders', 'reply': f'Aapki profile ke hisaab se {len(tenders)} best matches mile hain:', 'data': tenders}
        else:
            return {'type': 'tenders', 'reply': 'Sorry, abhi aapki profile ke hisaab se koi live tender nahi mila. Aap apni profile update karein.', 'data': []}
            
    else:
        return {'type': 'general', 'reply': 'Main BidWell AI hoon. Aap mujhse apne sector ke live tenders ya competitors ke baare me pooch sakte hain.', 'data': []}

@app.get('/api/tender-analysis', dependencies=[Depends(auth)])
def tender_analysis(tender_id: str):
    tender_sql = "SELECT title, org_name, state, closing_date FROM active_tenders WHERE source_tender_id = %s LIMIT 1"
    tender_res = q(tender_sql, (tender_id,))
    if not tender_res:
        return {'success': False, 'error': 'Tender not found'}
    
    tender = tender_res[0]
    org = tender['org_name'] or ''
    
    hist_sql = """
        SELECT winner_name, COUNT(*) as wins, ROUND(AVG(contract_value)) as avg_bid, MAX(year) as last_win
        FROM awards 
        WHERE org_name ILIKE %s AND winner_name IS NOT NULL
        GROUP BY winner_name 
        ORDER BY wins DESC 
        LIMIT 3
    """
    winners = q(hist_sql, (f'%{org}%',))
    
    stats_sql = """
        SELECT ROUND(AVG(contract_value)) as avg_val, ROUND(AVG(bid_count), 1) as avg_bidders
        FROM awards 
        WHERE org_name ILIKE %s AND contract_value > 0
    """
    stats = q(stats_sql, (f'%{org}%',))[0]
    
    recommendation = 'GO'
    risk = 'Low'
    advice = 'This looks like a standard tender. You can proceed with your normal bidding strategy.'
    
    if stats['avg_bidders'] and stats['avg_bidders'] > 5:
        risk = 'High'
        advice = f'High competition detected (Avg {stats["avg_bidders"]} bidders). You must price aggressively to win.'
    
    if not winners:
        advice = 'No historical data found for this department. Proceed with caution and ensure all documents are perfect.'
        
    suggested_bid = 'N/A'
    if stats['avg_val']:
        suggested_bid = f'₹{(stats["avg_val"] * 0.98) / 100000:.2f} Lakh (2% below historical average)'

    return {
        'success': True,
        'department': org,
        'historical_winners': winners,
        'competition': {
            'avg_bidders': stats['avg_bidders'],
            'avg_contract_value': stats['avg_val']
        },
        'analysis': {
            'risk_level': risk,
            'recommendation': recommendation,
            'suggested_bid_price': suggested_bid,
            'advice': advice
        }
    }

@app.get('/api/prioritized-tenders', dependencies=[Depends(auth)])
def prioritized_tenders(state: str = None, keyword: str = None, limit: int = 50):
    base_sql = """
        SELECT source_tender_id as id, title, org_name as department, 
               state, source, closing_date as deadline, source_url
        FROM active_tenders 
        WHERE status = 'active'
        ORDER BY id DESC
        LIMIT 500
    """
    tenders = q(base_sql)
    
    for t in tenders:
        score = 30
        reasons = ['Active Tender']
        
        if state and state != 'All India' and t['state'] and state.lower() in t['state'].lower():
            score += 35
            reasons.append('Location Match')
            
        if keyword and keyword.lower() in (t['title'] + ' ' + (t['department'] or '')).lower():
            score += 30
            reasons.append('Sector Match')
            
        t['match_score'] = min(score, 95)
        t['match_reasons'] = reasons
        
    tenders = sorted(tenders, key=lambda x: x['match_score'], reverse=True)
    return {'success': True, 'tenders': tenders[:limit]}
