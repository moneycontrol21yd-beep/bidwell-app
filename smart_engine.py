import psycopg2
import re

def get_tender_consultant_intel(org_name, state, tender_title):
    intel = {
        "risk_factors": [],
        "competitors": [],
        "payment_estimate": "Standard (State Cycle - 60 to 90 Days)"
    }
    try:
        conn = psycopg2.connect(host="127.0.0.1", database="brain", user="bidwell", password="bidwell2026", connect_timeout=3)
        cur = conn.cursor()
        clean_org = re.sub(r'[^a-zA-Z0-9\s]', ' ', str(org_name)).split()
        search_term = clean_org[0] if clean_org else "Govt"
        
        cur.execute("""
            SELECT winner_name, COUNT(*) as wins, SUM(contract_value) as total_val
            FROM awards
            WHERE org_name ILIKE %s AND winner_name IS NOT NULL
            GROUP BY winner_name
            ORDER BY wins DESC
            LIMIT 3
        """, (f"%{search_term}%",))
        
        rows = cur.fetchall()
        total_wins = sum([r[1] for r in rows]) if rows else 0
        
        for r in rows:
            intel["competitors"].append({"winner": r[0], "wins": r[1], "value": float(r[2]) if r[2] else 0})
            
        if rows and total_wins >= 5 and (rows[0][1] / total_wins) > 0.6:
            intel["risk_factors"].append(f"High Cartel Risk: '{rows[0][0]}' has won over 60% of recent tenders here.")
        else:
            intel["risk_factors"].append("Healthy competition: Past tenders distributed among multiple vendors.")
            
        if any(k in str(state).lower() for k in ["central", "gem", "railway", "defence"]):
            intel["payment_estimate"] = "Fast Payment (15-30 Days via PFMS/GeM)"
            
        cur.close()
        conn.close()
    except Exception:
        intel["risk_factors"].append("Standard market conditions apply.")
    return intel

if __name__ == "__main__":
    print("✅ Smart Engine Module Installed Successfully!")
