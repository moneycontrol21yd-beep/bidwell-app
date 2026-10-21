import json, psycopg2

conn = psycopg2.connect('postgresql://bidwell:bidwell2026@localhost:5432/brain')
cur = conn.cursor()

# Competitors
print('Exporting competitors...')
cur.execute('SELECT company_name, total_wins, total_value, avg_bid_value, last_win_date FROM brain_competitors ORDER BY total_wins DESC LIMIT 50000')
comps = [{'company_name': r[0], 'total_wins': r[1], 'total_value': float(r[2] or 0), 'avg_bid_value': float(r[3] or 0), 'last_win_date': r[4]} for r in cur.fetchall()]
with open('/tmp/competitors.json', 'w') as f:
    json.dump(comps, f)
print(f'  {len(comps)} competitors')

# Departments
print('Exporting departments...')
cur.execute('SELECT org_name, total_tenders, total_value, avg_value, avg_bids FROM brain_departments ORDER BY total_tenders DESC LIMIT 10000')
depts = [{'org_name': r[0], 'total_tenders': r[1], 'total_value': float(r[2] or 0), 'avg_value': float(r[3] or 0), 'avg_bids': float(r[4] or 0)} for r in cur.fetchall()]
with open('/tmp/departments.json', 'w') as f:
    json.dump(depts, f)
print(f'  {len(depts)} departments')

# Price stats
print('Exporting price stats...')
cur.execute('SELECT category, total_tenders, min_value, max_value, avg_value, median_value FROM brain_price_stats')
prices = [{'category': r[0], 'total_tenders': r[1], 'min_value': float(r[2] or 0), 'max_value': float(r[3] or 0), 'avg_value': float(r[4] or 0), 'median_value': float(r[5] or 0)} for r in cur.fetchall()]
with open('/tmp/prices.json', 'w') as f:
    json.dump(prices, f)
print(f'  {len(prices)} categories')

print('DONE')
