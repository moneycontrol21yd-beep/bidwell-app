export BIDWELL_API_TOKEN=$(cat /root/.bidwell_token | tr -d '\n')

# Start Server
pkill -f uvicorn || true
pkill -f cloudflared || true
sleep 1
cd /opt/bidwell
nohup /opt/bidwell/venv/bin/uvicorn api.main:app --host 127.0.0.1 --port 8000 > /opt/bidwell/logs/uvicorn.log 2>&1 &
sleep 3

# Start Tunnel
nohup cloudflared tunnel --url http://127.0.0.1:8000 > /opt/bidwell/logs/tunnel.log 2>&1 &
sleep 8

# Print URL
echo '=== NEW URL ==='
grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /opt/bidwell/logs/tunnel.log | head -1
