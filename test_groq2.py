import requests, json
key = ""
with open(".env.local") as f:
    for line in f:
        if line.startswith("GROQ_API_KEY="):
            key = line.strip().split("=", 1)[1]
            break

r = requests.post(
    "https://api.groq.com/openai/v1/chat/completions",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
    json={
        "model": "openai/gpt-oss-120b",
        "messages": [{"role": "user", "content": "Return JSON: {\"ok\":true}"}],
        "response_format": {"type": "json_object"},
        "max_tokens": 50,
    },
    timeout=30,
)
print(f"Status: {r.status_code}")
print(f"Response: {r.text[:300]}")
