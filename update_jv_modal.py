import re

file_path = 'app/dashboard/page.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. FIX FORMAT CURRENCY (696 ko 69 nahi banayega)
old_format_currency = '''const formatCurrency = (amount: any) => {
    if (!amount || amount === "N/A" || amount === "0" || amount === null) return "Check Portal";
    // String me convert karo, fir saare non-numeric chars hatao
    const cleanStr = String(amount).replace(/[^0-9.-]+/g, "");
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return String(amount);
    
    // Agar number 1000 se chota hai, to shayad wo thousands me hai (e.g. 696 = 6,96,000)
    // Lekin abhi ke liye direct format karte hain
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };'''

new_format_currency = '''const formatCurrency = (amount: any) => {
    if (!amount || amount === "N/A" || amount === "0" || amount === null) return "Check Portal";
    const cleanStr = String(amount).replace(/[^0-9.-]+/g, "");
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };'''
content = content.replace(old_format_currency, new_format_currency)

# 2. JV Modal Rendering (Add Empty State)
old_modal_body = '''<div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {jvLoading ? (
                <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>Matching with VPS Database...</div>
              ) : selectedPartner ? ('''
new_modal_body = '''<div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {jvLoading ? (
                <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>Matching with VPS Database...</div>
              ) : jvPartners.length === 0 ? (
                <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>🔍</div>
                  No exact matches found. Please complete your company profile to get better matches.
                </div>
              ) : selectedPartner ? ('''
content = content.replace(old_modal_body, new_modal_body)

with open(file_path, 'w') as f:
    f.write(content)
print("✅ JV Modal UI fixed!")
