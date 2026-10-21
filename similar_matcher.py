import psycopg2
import json

def get_similar_tenders(current_tender_id, org_name, state, limit=3):
    """VPS database se same department ya state ke milte-julte active tenders nikalna"""
    similar_list = []
    try:
        conn = psycopg2.connect(host="127.0.0.1", database="brain", user="bidwell", password="bidwell2026", connect_timeout=3)
        cur = conn.cursor()
        
        # Query to find tenders matching same organisation or state, excluding current tender
        cur.execute("""
            SELECT source_tender_id, title, org_name, state, value, closing_date, source_url
            FROM live_tenders
            WHERE source_tender_id != %s 
              AND (org_name ILIKE %s OR state ILIKE %s)
            LIMIT %s
        """, (str(current_tender_id), f"%{org_name[:15]}%", f"%{state}%", limit))
        
        rows = cur.fetchall()
        for r in rows:
            similar_list.append({
                "tender_id": r[0],
                "title": r[1],
                "org_name": r[2],
                "state": r[3],
                "value": r[4],
                "closing_date": r[5],
                "source_url": r[6]
            })
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Similar matcher error: {e}")
        
    return similar_list

if __name__ == "__main__":
    print("✅ Similar Tender Matcher Engine Ready.")
