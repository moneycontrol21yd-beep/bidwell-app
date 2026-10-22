"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- SECTOR-BASED DOCUMENT MAPPING ---
const SECTOR_DOCS: Record<string, string[]> = {
  "Construction": ["GST Certificate", "PAN Card", "PWD Registration", "Labour License"],
  "IT & Software": ["GST Certificate", "PAN Card", "MSME / Udyam", "ISO 27001 (Optional)"],
  "Manpower / Security": ["GST Certificate", "PAN Card", "PSARA License", "EPF Registration"],
  "Healthcare": ["GST Certificate", "PAN Card", "Drug License", "Biomedical Waste Auth"],
  "General Supply": ["GST Certificate", "PAN Card", "MSME / Udyam"]
};

const nav = [
  { group: "WORKSPACE", items: [["Overview", "⌂"], ["Live tenders", "⌕"], ["AI tender brain", "✳"], ["Bid workspace", "▤"]] },
  { group: "DELIVERY", items: [["Contracts", "▣"], ["Payments & invoices", "₹"], ["Documents", "▧"], ["Workforce", "♙"]] },
  { group: "MANAGE", items: [["Team", "♧"], ["Notifications", "♢"], ["Company profile", "◉"], ["Subscription", "★"], ["Settings", "⚙"]] },
];

export default function Dashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Profile States
  const [profile, setProfile] = useState<any>({
    company_name: "", gstin: "", pan: "", msme: "", turnover: "", experience_years: "", business_type: "Construction", documents: {}
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });
    setLoading(false);
  }, [router]);

  // Fetch Profile
  useEffect(() => {
    if (active === "Company profile") {
      fetch('/api/company-profile').then(r => r.json()).then(d => {
        if (d.success && d.profile) {
          // Ensure documents is an object
          const prof = { ...d.profile };
          if (!prof.documents) prof.documents = {};
          if (!prof.business_type) prof.business_type = "Construction";
          setProfile(prof);
        }
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
    alert("Profile & Sector Documents Saved Successfully!");
  };

  // Document Upload Handler
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        // Update local state
        const updatedDocs = { ...profile.documents, [docName]: data.url };
        const updatedProfile = { ...profile, documents: updatedDocs };
        setProfile(updatedProfile);

        // Auto-save to DB
        await fetch('/api/company-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile)
        });
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Error uploading file.");
    }
    setUploadingDoc("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const formatCurrency = (amount: any) => {
    if (!amount || amount === "N/A" || amount === "0" || amount === null) return "Check Portal";
    const num = parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      
      {mobileMenu && (
        <div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <aside style={{ width: 260, background: "linear-gradient(180deg,#101b32 0%,#142442 100%)", color: "#d5deee", padding: "24px 15px", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50, transform: mobileMenu ? "translateX(0)" : "translateX(-100%)", transition: "0.3s", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 12px 25px", color: "#fff", fontSize: 22, fontWeight: 800 }}>
          <div style={{ height: 38, width: 38, borderRadius: 12, background: "#315efb", display: "grid", placeItems: "center" }}>B</div> BidWell
        </div>
        <div style={{ flex: 1 }}>
          {nav.map((section) => (
            <div key={section.group} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#7788a6", padding: "0 12px 10px" }}>{section.group}</div>
              {section.items.map(([label, icon]) => (
                <button key={label} onClick={() => { setActive(label); setMobileMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: 0, borderRadius: 9, background: active === label ? "#315efb" : "transparent", color: active === label ? "#fff" : "#aab8cf", margin: "2px 0", fontSize: 12, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 17, textAlign: "center" }}>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <button onClick={handleLogout} style={{ width: "100%", padding: "11px 12px", border: 0, borderRadius: 9, background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", textAlign: "left", fontSize: 12, cursor: "pointer" }}>↪ Log Out</button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, width: "100%", overflowX: "hidden" }}>
        
        <header style={{ height: 75, background: "#fff", borderBottom: "1px solid #e8edf5", display: "flex", alignItems: "center", padding: "0 20px", gap: 15 }}>
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7ebf3", background: "#fafbfe", borderRadius: 10, padding: "0 13px", height: 40, maxWidth: 400, width: "100%" }}>
            <span style={{ fontSize: 20, color: "#8794a9", marginRight: 8 }}>⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tenders..." style={{ border: 0, outline: 0, background: "transparent", flex: 1, fontSize: 12 }} />
          </div>
        </header>

        <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
          
          <div style={{ marginBottom: 25 }}>
            <div style={{ fontSize: 10, color: "#7b879d", fontWeight: 800, letterSpacing: 1 }}>BIDWELL WORKSPACE</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "9px 0 4px", color: "#17233b" }}>{active}</h1>
            <p style={{ fontSize: 12, color: "#7b879a", margin: 0 }}>Your business command centre</p>
          </div>

          {/* DYNAMIC COMPANY PROFILE TAB */}
          {active === "Company profile" && (
            <div style={{ display: "grid", gap: 20 }}>
              
              {/* Basic Details Card */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b", marginBottom: 16 }}>Company Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Company Name</label>
                    <input value={profile.company_name || ""} onChange={e => setProfile({...profile, company_name: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Business Sector</label>
                    <select value={profile.business_type || "Construction"} onChange={e => setProfile({...profile, business_type: e.target.value, documents: {}})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13, background: "#f8fafc" }}>
                      {Object.keys(SECTOR_DOCS).map(sec => <option key={sec} value={sec}>{sec}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>GSTIN</label>
                    <input value={profile.gstin || ""} onChange={e => setProfile({...profile, gstin: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>PAN Number</label>
                    <input value={profile.pan || ""} onChange={e => setProfile({...profile, pan: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Annual Turnover (₹)</label>
                    <input type="number" value={profile.turnover || ""} onChange={e => setProfile({...profile, turnover: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Experience (Years)</label>
                    <input type="number" value={profile.experience_years || ""} onChange={e => setProfile({...profile, experience_years: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} />
                  </div>
                </div>
                <button onClick={handleSaveProfile} disabled={profileSaving} style={{ background: "#315efb", color: "#fff", border: "none", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 20, width: "100%" }}>
                  {profileSaving ? "Saving..." : "Save Company Details"}
                </button>
              </div>

              {/* DYNAMIC Document Vault Card */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>Required Documents ({profile.business_type})</div>
                  <div style={{ fontSize: 11, color: "#10b981", background: "#ecfdf5", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>Saved Once, Used Forever</div>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Based on your sector, upload these documents. They will be auto-attached to your future bids.</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                  {(SECTOR_DOCS[profile.business_type] || SECTOR_DOCS["General Supply"]).map((docName) => {
                    const isUploaded = profile.documents && profile.documents[docName];
                    return (
                      <div key={docName} style={{ border: "1px dashed #cbd5e1", borderRadius: 10, padding: 16, textAlign: "center", background: isUploaded ? "#f0fdf4" : "#fff" }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{isUploaded ? "✅" : "📄"}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isUploaded ? "#166534" : "#17233b" }}>{docName}</div>
                        
                        {isUploaded ? (
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>Uploaded</span>
                            <a href={profile.documents[docName]} target="_blank" style={{ display: "block", fontSize: 10, color: "#315efb", marginTop: 4, textDecoration: "underline" }}>View File</a>
                          </div>
                        ) : (
                          <div style={{ marginTop: 8 }}>
                            <input type="file" id={`upload-${docName}`} style={{ display: "none" }} onChange={(e) => handleDocUpload(e, docName)} />
                            <label htmlFor={`upload-${docName}`} style={{ background: "#f1f5f9", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#315efb", display: "inline-block" }}>
                              {uploadingDoc === docName ? "Uploading..." : "Upload File"}
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs */}
          {!["Company profile"].includes(active) && (
            <div style={{ background: "#fff", padding: 40, borderRadius: 14, textAlign: "center", color: "#94a3b8", border: "1px solid #e8edf5" }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>✳</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#17233b" }}>{active} Workspace</div>
              <p style={{ fontSize: 12, marginTop: 8 }}>This module is ready to be connected.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
