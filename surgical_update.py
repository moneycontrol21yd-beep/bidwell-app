import os
import re

file_path = 'app/dashboard/page.tsx'

if not os.path.exists(file_path):
    print("❌ Error: app/dashboard/page.tsx nahi mili. Kya tum sahi folder me ho?")
    exit()

with open(file_path, 'r') as f:
    content = f.read()

# 1. Check karo ki WorldClassFeatures pehle se toh nahi add hai
if 'WorldClassFeatures' in content:
    print("✅ WorldClassFeatures pehle se hi dashboard me add hai. Koi change ki zaroorat nahi.")
    exit()

# 2. Import statement add karo (agar pehle se nahi hai)
import_statement = 'import WorldClassFeatures from "@/components/WorldClassFeatures";\n'
# Last import ke baad add karo
if 'import ' in content:
    lines = content.split('\n')
    last_import_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i
    lines.insert(last_import_idx + 1, import_statement)
    content = '\n'.join(lines)
else:
    content = import_statement + content

# 3. Component ko BottomNav ke thik upar add karo
if '<BottomNav' in content:
    content = content.replace('<BottomNav', '<WorldClassFeatures />\n      <BottomNav')
else:
    # Agar BottomNav nahi hai, to return ke closing bracket se pehle daalo
    # Ye thoda risky ho sakta hai, par backup lene ke baad theek hai
    content = re.sub(r'(return\s*\(\s*<div[^>]*>)(.*?)(</div>\s*\);)', r'\1\2<WorldClassFeatures />\3', content, flags=re.DOTALL)

# Save karo
with open(file_path, 'w') as f:
    f.write(content)

print("✅ Surgical Update Successful! WorldClassFeatures dashboard me add ho gaya hai.")
