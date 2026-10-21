export BIDWELL_API_TOKEN=$(cat /root/.bidwell_token | tr -d '\n')
cd /opt/bidwell

while true; do
    # 1. Check and Start API
    if ! pgrep -f 'uvicorn api.main:app' > /dev/null; then
        echo 'Starting API...'
        nohup /opt/bidwell/venv/bin/uvicorn api.main:app --host 127.0.0.1 --port 8000 > /opt/bidwell/logs/uvicorn.log 2>&1 &
    fi

    # 2. Check and Start Tunnel
    if ! pgrep -f 'localtunnel' > /dev/null; then
        echo 'Starting Tunnel...'
        nohup npx localtunnel --port 8000 --subdomain bidwell-india-api > /opt/bidwell/logs/lt.log 2>&1 &
    fi
    
    # 3. Sleep for 10 seconds before checking again
    sleep 10
done
