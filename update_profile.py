import re

file_path = 'app/dashboard/page.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add states for profile
state_code = '''
  const [profile, setProfile] = useState<any>({ company_name: "", gstin: "", pan: "", msme: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (active === "Company profile") {
      fetch('/api/company-profile').then(r => r.json()).then(d => {
        if (d.success && d.profile) setProfile(d.profile);
      });
    }
  }, [active]);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    await fetch('/api/company-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    setProfileSaving(false);
    alert("Profile Details Saved Successfully!");
  };
'''
# Insert states after the tenders state
content = content.replace('const [tenders, setTenders] = useState<Tender[]>([]);', 'const [tenders, setTenders] = useState<Tender[]>([]);\n' + state_code)

# 2. Replace the Company Profile inputs with functional ones
old_profile_html = '''<div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>COMPANY NAME</label><input defaultValue="Shivam Security Services Pvt. Ltd." style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>GSTIN</label><input defaultValue="23AAAAA0000A1Z5" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>PAN</label><input defaultValue="AAAAA0000A" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>MSME / UDYAM</label><input defaultValue="UDYAM-MP-01-0000001" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>'''

new_profile_html = '''<div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>COMPANY NAME</label><input value={profile.company_name || ""} onChange={e => setProfile({...profile, company_name: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>GSTIN</label><input value={profile.gstin || ""} onChange={e => setProfile({...profile, gstin: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>PAN</label><input value={profile.pan || ""} onChange={e => setProfile({...profile, pan: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>MSME / UDYAM</label><input value={profile.msme || ""} onChange={e => setProfile({...profile, msme: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>'''

content = content.replace(old_profile_html, new_profile_html)

# 3. Update the Save button
content = content.replace('button style={{ ...btnStyle, marginTop: 16, width: "100%", justifyContent: "center" }}>Save Profile Details</button>', 'button onClick={handleSaveProfile} disabled={profileSaving} style={{ ...btnStyle, marginTop: 16, width: "100%", justifyContent: "center" }}>{profileSaving ? "Saving..." : "Save Profile Details"}</button>')

with open(file_path, 'w') as f:
    f.write(content)
print("✅ Dashboard successfully connected to Database API!")
