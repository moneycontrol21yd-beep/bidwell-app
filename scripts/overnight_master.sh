# Overnight Master Scraper
# Runs all free sources sequentially with logging

LOG=/tmp/overnight.log
echo "[MASTER START] $(date)" > $LOG

cd /opt/bidwell

# 1. CPPP (500 pages, ~5,000 records)
echo "=== CPPP START ===" >> $LOG
python3 scripts/cppp_scraper.py >> $LOG 2>&1
echo "=== CPPP DONE ===" >> $LOG

# 2. All 16 States (one by one)
echo "=== STATES START ===" >> $LOG
for state in Maharashtra Rajasthan Kerala "Tamil Nadu" Haryana Punjab Odisha Uttarakhand "Himachal Pradesh" Assam "Uttar Pradesh" "Madhya Pradesh" "West Bengal" Gujarat Karnataka Jharkhand; do
  echo "--- $state ---" >> $LOG
  python3 scripts/state_scraper.py "$state" >> $LOG 2>&1
  sleep 2
done
echo "=== STATES DONE ===" >> $LOG

# 3. Defence
echo "=== DEFENCE START ===" >> $LOG
python3 scripts/defence_scraper.py >> $LOG 2>&1
echo "=== DEFENCE DONE ===" >> $LOG

# 4. PSU
echo "=== PSU START ===" >> $LOG
python3 scripts/psu_scraper.py >> $LOG 2>&1
echo "=== PSU DONE ===" >> $LOG

# 5. Cleanup (delete junk)
echo "=== CLEANUP START ===" >> $LOG
python3 scripts/cleanup.py >> $LOG 2>&1
echo "=== CLEANUP DONE ===" >> $LOG

# 6. Final count
echo "=== FINAL COUNT ===" >> $LOG
docker exec bidwell-postgres psql -U bidwell -d brain -c "SELECT COUNT(*) as total FROM brain_awards;" >> $LOG 2>&1

echo "[MASTER DONE] $(date)" >> $LOG
