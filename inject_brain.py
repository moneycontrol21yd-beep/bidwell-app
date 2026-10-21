import os

file_path = 'app/brain/page.tsx'

if os.path.exists(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    if 'CyberDeskCard' not in content:
        content = 'import CyberDeskCard from "@/components/CyberDeskCard";\n' + content

    if '<BottomNav' in content:
        content = content.replace('<BottomNav', '<div style={{ padding: "0 18px" }}>\n      <CyberDeskCard />\n      </div>\n      <BottomNav')
    
    with open(file_path, 'w') as f:
        f.write(content)
    print("✅ CyberDeskCard successfully added to Brain page!")
else:
    print("❌ app/brain/page.tsx nahi mili.")
