import requests
key = ""
with open(".env.local") as f:
    for line in f:
        if line.startswith("GROQ_API_KEY="):
            key = line.strip().split("=", 1)[1]
            break

r = requests.get(
    "https://api.groq.com/openai/v1/models",
    headers={"Authorization": f"Bearer {key}"},
    timeout=30,
)
print(f"Status: {r.status_code}")
data = r.json()
if "data" in data:
    for m in data["data"]:
        print(f"  - {m['id']}")
else:
    print(r.text[:500])
