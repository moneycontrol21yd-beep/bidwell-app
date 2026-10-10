import os, json, requests

# Load key
key = ""
with open(".env.local") as f:
    for line in f:
        if line.startswith("GROQ_API_KEY="):
            key = line.strip().split("=", 1)[1]
            break

print(f"Key prefix: {key[:10]}...")
print(f"Key length: {len(key)}")

if not key:
    print("❌ Key not found")
    exit()

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {key}",
}
body = {
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Reply in JSON: {\"ok\":true}"}],
    "response_format": {"type": "json_object"},
    "max_tokens": 50,
}

print("\nSending request...")
try:
    r = requests.post(url, headers=headers, json=body, timeout=30)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
