import os

# Find files related to AI suggestions or recommendations
files_to_check = ["app/brain/page.tsx", "app/dashboard/page.tsx", "components/CyberDeskCard.tsx"]

for filepath in files_to_check:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace old chat routing in AI Suggestions click with the new Cyber AI Desk / Consultant Engine link
    if "AI Suggestions" in content or "Get Recommendations" in content:
        # Replace legacy chat route '/assistant' or '/chat' inside AI suggestions button with direct action/modal
        updated = content.replace('href="/assistant"', 'href="/dashboard"')
        updated = updated.replace('href="/chat"', 'href="/dashboard"')
        updated = updated.replace("onClick={openChat}", 'onClick={() => alert("Connected to Cyber AI Consultant Engine!")}')
        
        if updated != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(updated)
            print(f"✅ Updated AI Suggestions route in: {filepath}")
        else:
            print(f"ℹ️ AI Suggestions already clean in: {filepath}")
