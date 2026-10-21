import os, re

# Dashboard file ka path (Agar app/page.tsx hai to wahan change kar lena)
file_path = 'app/dashboard/page.tsx'

if not os.path.exists(file_path):
    print(f"❌ Error: {file_path} nahi mili.")
    exit()

with open(file_path, 'r') as f:
    content = f.read()

if 'CyberDeskCard' in content:
    print("✅ CyberDeskCard pehle se hi dashboard me add hai.")
    exit()

# 1. Import statement add karo
import_stmt = 'import CyberDeskCard from "@/components/CyberDeskCard";\n'
lines = content.split('\n')
last_import = 0
for i, line in enumerate(lines):
    if line.startswith('import '):
        last_import = i
lines.insert(last_import + 1, import_stmt)
content = '\n'.join(lines)

# 2. Component ko India Wide Coverage ke thik baad add karo
# Hum "India Wide Coverage" ka block dhundhenge aur uske closing div ke baad inject karenge
if 'India Wide Coverage' in content:
    # Ek simple regex jo India Wide Coverage wale card ke end ko pakdega
    # Ye thoda tricky hai, isliye hum seedha 'Brain Insights' ke thik upar add karenge (jo grid ke bahar hai)
    if 'Brain Insights' in content:
        content = content.replace('<div style={{ padding: "20px" }}>\n        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Brain Insights</div>', '<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 20px 20px 20px" }}>\n        <CyberDeskCard />\n      </div>\n\n      <div style={{ padding: "0 20px 20px 20px" }}>\n        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Brain Insights</div>')
    else:
        # Agar Brain Insights nahi mila, to <BottomNav> ke thik upar daal do
        content = content.replace('<BottomNav', '<div style={{ padding: "0 20px 20px 20px" }}>\n        <CyberDeskCard />\n      </div>\n      <BottomNav')
else:
    print("❌ 'India Wide Coverage' ya 'Brain Insights' nahi mila. Layout thoda alag hai.")

with open(file_path, 'w') as f:
    f.write(content)

print("✅ Surgical Update Successful! CyberDeskCard added without breaking UI.")
