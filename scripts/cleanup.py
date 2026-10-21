import psycopg2
from datetime import datetime, timedelta
DB = 'postgresql://bidwell:bidwell2026@localhost:5432/brain'
cn = psycopg2.connect(DB, connect_timeout=30); cu = cn.cursor()
print(f'[START] {datetime.now()}', flush=True)
cu.execute("SELECT COUNT(*) FROM brain_awards"); print(f'Before: {cu.fetchone()[0]:,}', flush=True)
# Junk delete
cu.execute("DELETE FROM brain_awards WHERE LENGTH(title) < 15 OR title IS NULL OR title = ''")
print(f'Short titles deleted: {cu.rowcount}', flush=True)
cu.execute("DELETE FROM brain_awards WHERE LOWER(title) LIKE '%test%' OR LOWER(title) LIKE '%sample%' OR LOWER(title) LIKE '%dummy%'")
print(f'Junk deleted: {cu.rowcount}', flush=True)
cu.execute("DELETE FROM brain_awards WHERE LOWER(title) LIKE '%n/a%' AND LENGTH(title) < 30")
print(f'N/A deleted: {cu.rowcount}', flush=True)
cn.commit()
cu.execute("SELECT COUNT(*) FROM brain_awards"); print(f'After: {cu.fetchone()[0]:,}', flush=True)
cu.close(); cn.close()
print('[DONE]', flush=True)
