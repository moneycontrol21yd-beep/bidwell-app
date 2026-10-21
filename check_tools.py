import requests, json

# MCP standard endpoint to list tools
url = "https://gateway.pipeworx.io/v1/tools/india_search_tenders" # We know this works, but we need the base URL
base_url = "https://gateway.pipeworx.io/mcp" # Standard MCP endpoint

payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
}

try:
    res = requests.post(base_url, json=payload, timeout=15)
    print(f"Status: {res.status_code}")
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print("Error:", e)
