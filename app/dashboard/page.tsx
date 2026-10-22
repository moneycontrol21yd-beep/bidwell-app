"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // --- Profile & Workspace States ---
  const [profile, setProfile] = useState<any>({ company_name: "", gstin: "", pan: "", msme: "", turnover: "", experience_years: "", business_type: "Construction", documents: {} });
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState("");
  const [workspace, setWorkspace] = useState<any[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  // --- AI Chat States ---
  const [language, setLanguage] = useState("hi");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Namaste! Main BidWell AI hoon. Aap kisi bhi tender, eligibility ya document ke baare me puch sakte hain." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- JV Feature States ---
  const [showJVModal, setShowJVModal] = useState(false);
  const [jvPartners, setJvPartners] = useState<any[]>([]);
  const [jvLoading, setJvLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [userSector, setUserSector] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  // --- SMART MOCK STATES (For fully functional UI) ---
  const [teamMembers, setTeamMembers] = useState([{ name: "Harsh Rai", role: "Owner" }, { name: "Amit Sharma", role: "Bid Manager" }]);
  const [newTeamMember, setNewTeamMember] = useState("");
  const [invoices, setInvoices] = useState([{ id: "INV-001", amount: "₹45,000", status: "Paid", date: "15 Oct 2026" }]);
  const [contracts, setContracts] = useState([{ id: "CNT-001", title: "School Maintenance", status: "Active", expiry: "Dec 2026" }]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New tender matching your profile in MP.", time: "2 hours ago", type: "tender" },
    { id: 2, text: "Your JV request was accepted by Shakti Infra.", time: "1 day ago", type: "jv" }
  ]);
  const [staffList, setStaffList] = useState([{ name: "Ramesh", role: "Site Engineer", status: "Present" }]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });

    fetch("/api/tenders?page=0").then(res => res.json()).then(data => {
      if (data.success && data.tenders) {
        const today = new Date();
        const activeTenders = data.tenders.filter((t: any) => t.closing_date && new Date(t.closing_date) >= today).sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0));
        setTenders(activeTenders);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  // Fetch Data based on active tab
  useEffect(() => {
    if (active === "Company profile") {
      fetch('/api/company-profile').then(r => r.json()).then(d => {
        if (d.success && d.profile) {
          const prof = { ...d.profile };
          if (!prof.business_type) prof.business_type = "Construction";
          const safeDocs: any = {};
          const oldDocs = prof.documents || {};
          Object.keys(oldDocs).forEach(key => {
            const val = oldDocs[key];
            if (typeof val === 'string') safeDocs[key] = { number: "", url: val };
            else if (typeof val === 'object' && val !== null) safeDocs[key] = val;
          });
          prof.documents = safeDocs;
          setProfile(prof);
        }
      });
    }

    if (active === "Bid workspace") {
      setWorkspaceLoading(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        fetch('/api/workspace', { headers: { 'Authorization': 'Bearer ' + session?.access_token } })
          .then(r => r.json()).then(d => {
            if (d.success) setWorkspace(d.workspace);
            setWorkspaceLoading(false);
          });
      });
    }
  }, [active]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    await fetch('/api/company-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
    setProfileSaving(false);
    alert("Profile & Documents Saved Successfully!");
  };

  const handleDocTextChange = (docName: string, value: string) => {
    const updatedDocs = { ...profile.documents };
    if (!updatedDocs[docName]) updatedDocs[docName] = { number: "", url: "" };
    updatedDocs[docName].number = value;
    setProfile({ ...profile, documents: updatedDocs });
  };

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
        const updatedDocs = { ...profile.documents };
        if (!updatedDocs[docName]) updatedDocs[docName] = { number: "", url: "" };
        updatedDocs[docName].url = data.url;
        const updatedProfile = { ...profile, documents: updatedDocs };
        setProfile(updatedProfile);
        await fetch('/api/company-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedProfile) });
      } else { alert("Upload failed: " + data.error); }
    } catch (err) { alert("Error uploading file."); }
    setUploadingDoc("");
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const msg = customPrompt || chatInput;
    if(!msg.trim()) return;
    setChatHistory(prev => [...prev, { role: "user", content: msg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: msg, language }) });
      const data = await res.json();
      if(data.success) setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      else setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, VPS Brain is currently unreachable." }]);
    } catch (e) { setChatHistory(prev => [...prev, { role: "assistant", content: "Error connecting to AI Brain." }]); }
    setChatLoading(false);
  };

  const handleOpenJV = async () => {
    setShowJVModal(true);
    setSelectedPartner(null);
    setRequestSent(false);
    if (jvPartners.length === 0) {
      setJvLoading(true);
      try {
        const res = await fetch("/api/jv-search");
        const data = await res.json();
        if (data.success) { setJvPartners(data.partners); setUserSector(data.userSector); }
      } catch (e) {}
      setJvLoading(false);
    }
  };

  const formatCurrency = (amount: any) => {
    if (!amount || amount === "N/A" || amount === "0" || amount === null) return "Check Portal";
    const num = parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  const filteredTenders = tenders.filter((t) => `${t.title} ${t.org_name} ${t.state}`.toLowerCase().includes(query.toLowerCase()));
  const top3Tenders = tenders.slice(0, 3);
  const potentialRevenue = top3Tenders.reduce((sum, t) => { if (!t.value) return sum; const cleanValue = String(t.value).replace(/[^0-9.-]+/g, ""); const numericValue = parseFloat(cleanValue); return sum + (isNaN(numericValue) ? 0 : numericValue); }, 0);
  const estimatedEMD = potentialRevenue * 0.02;

  const cardStyle = { background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)", marginBottom: 16 };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      
      {mobileMenu && <div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}

      {/* JV Modal */}
      {showJVModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 550, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: 20, borderBottom: "1px solid #e8edf5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#17233b" }}>🤝 Smart JV Match</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Profile: <b style={{ color: "#315efb" }}>{userSector || "General"}</b></div></div>
              <button onClick={() => setShowJVModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {jvLoading ? <div style={{ textAlign: "center", padding: 30 }}>Matching...</div> : selectedPartner ? (
                <div>
                  <button onClick={() => { setSelectedPartner(null); setRequestSent(false); }} style={{ background: "none", border: "none", color: "#315efb", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>← Back</button>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{selectedPartner.vendor_name}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16 }}>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}><div style={{ fontSize: 10, color: "#64748b" }}>Turnover</div><div style={{ fontSize: 14, fontWeight: 800 }}>₹{(selectedPartner.total_value / 10000000).toFixed(2)} Cr</div></div>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}><div style={{ fontSize: 10, color: "#64748b" }}>Wins</div><div style={{ fontSize: 14, fontWeight: 800 }}>{selectedPartner.total_wins} Tenders</div></div>
                  </div>
                  {!requestSent ? <button onClick={() => setRequestSent(true)} style={{ width: "100%", background: "#315efb", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Send Request</button> : <div style={{ background: "#ecfdf5", padding: 12, borderRadius: 8, textAlign: "center", color: "#065f46", fontWeight: 800 }}>✅ Request Sent!</div>}
                </div>
              ) : jvPartners.map((p, i) => (
                <div key={i} style={{ border: "1px solid #e8edf5", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 14, fontWeight: 800 }}>{p.vendor_name}</div><div style={{ background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{p.match}%</div></div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{p.sector} · {p.state}</div>
                  <button onClick={() => setSelectedPartner(p)} style={{ background: "#f1f5f9", color: "#315efb", border: "none", padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}>View Profile</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: 260, background: "linear-gradient(180deg,#101b32 0%,#142442 100%)", color: "#d5deee", padding: "24px 15px", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50, transform: mobileMenu ? "translateX(0)" : "translateX(-100%)", transition: "0.3s", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 12px 25px", color: "#fff", fontSize: 22, fontWeight: 800 }}><div style={{ height: 38, width: 38, borderRadius: 12, background: "#315efb", display: "grid", placeItems: "center" }}>B</div> BidWell</div>
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

          {/* OVERVIEW */}
          {active === "Overview" && (
            <>
              <section style={{ borderRadius: 17, background: "linear-gradient(110deg,#142544 0%,#172d52 62%,#244276 100%)", padding: "25px 20px", color: "white", display: "flex", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b6c9f6", fontSize: 9, fontWeight: 800 }}><span style={{ fontSize: 18 }}>✳</span> BIDWELL INTELLIGENCE</div>
                  <h2 style={{ fontSize: 28, lineHeight: 1.15, margin: "12px 0 9px" }}>Better tenders.<br /><span style={{ color: "#8eafff" }}>Stronger bids.</span></h2>
                  <p style={{ fontSize: 11, color: "#bdc9df", maxWidth: 355, margin: "0 0 15px" }}>Your AI-powered workspace to discover opportunities, prepare bids and stay on top of every contract.</p>
                  <button onClick={() => setActive("Live tenders")} style={{ background: "#fff", color: "#1b2c4a", padding: "10px 14px", borderRadius: 9, border: 0, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Explore tenders ↗</button>
                </div>
              </section>

              <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 20 }}>
                <div style={{ ...cardStyle, marginBottom: 0 }}>
                  <div style={{ fontSize: 18, marginBottom: 12, color: "#315efb" }}>⌕</div><div style={{ fontSize: 10, color: "#7b879b" }}>Live Opportunities</div><div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0", color: "#17233b" }}>{loading ? "..." : tenders.length}</div>
                </div>
                <div style={{ ...cardStyle, marginBottom: 0 }}>
                  <div style={{ fontSize: 18, marginBottom: 12, color: "#8b5cf6" }}>▤</div><div style={{ fontSize: 10, color: "#7b879b" }}>Active Bids</div><div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0", color: "#17233b" }}>{workspace.length}</div>
                </div>
              </section>

              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 19 }}><div><div style={{ fontSize: 14, fontWeight: 800 }}>Top 3 Matched Tenders</div><div style={{ fontSize: 11, color: "#8792a5" }}>Highest probability of winning</div></div><button onClick={() => setActive("Live tenders")} style={{ background: "transparent", border: 0, color: "#315efb", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>View all ↗</button></div>
                <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 500 }}><thead><tr style={{ borderBottom: "1px solid #edf0f6" }}><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>OPPORTUNITY</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>VALUE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>DEADLINE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>MATCH</th></tr></thead>
                  <tbody>{loading ? <tr><td colSpan={4} style={{ padding: 20 }}>Fetching...</td></tr> : top3Tenders.map(t => <tr key={t.id} style={{ borderBottom: "1px solid #f0f2f7", cursor: "pointer" }} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)}>
                    <td style={{ padding: 13 }}><div style={{ fontWeight: 700, fontSize: 11 }}>{t.title}</div><small style={{ fontSize: 9, color: "#8792a5" }}>{t.org_name} · {t.state}</small></td><td style={{ padding: 13, fontSize: 11, fontWeight: 800 }}>{formatCurrency(t.value)}</td><td style={{ padding: 13, fontSize: 11, color: "#ef4444", fontWeight: 700 }}>{t.closing_date ? new Date(t.closing_date).toLocaleDateString('en-IN') : "N/A"}</td><td style={{ padding: 13 }}><span style={{ background: "#e3f7ef", color: "#168363", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match_score || 50}%</span></td>
                  </tr>)}</tbody></table></div>
              </div>

              <div style={{ marginTop: 30, marginBottom: 15 }}><div style={{ fontSize: 18, fontWeight: 900, color: "#17233b" }}>📈 Future & Growth</div></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                <div style={{ ...cardStyle, background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)" }}><div style={{ fontSize: 15, fontWeight: 800, color: "#3730a3", marginBottom: 12 }}>🚀 Future for BidWell</div><ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#312e81", lineHeight: 2, fontWeight: 600 }}><li>AI-Powered Legal Docs</li><li>Zero-Paperwork Bidding</li><li>Expand to 10+ States</li></ul></div>
                <div style={{ ...cardStyle, background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff" }}><div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🤝 JV for BidWell</div><p style={{ fontSize: 12, color: "#c7d2fe", marginBottom: 16 }}>Find trusted partners to strengthen your bid.</p><button onClick={handleOpenJV} style={{ width: "100%", background: "#fff", color: "#1e1b4b", padding: "10px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Find JV Partners ↗</button></div>
                <div style={cardStyle}><div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>📊 Revenue Planner</div><div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1, background: "#f8fafc", padding: 10, borderRadius: 8 }}><div style={{ fontSize: 10, color: "#64748b" }}>Top 3 Potential</div><div style={{ fontSize: 16, fontWeight: 800 }}>{formatCurrency(potentialRevenue)}</div></div><div style={{ flex: 1, background: "#f8fafc", padding: 10, borderRadius: 8 }}><div style={{ fontSize: 10, color: "#64748b" }}>Est. EMD</div><div style={{ fontSize: 16, fontWeight: 800, color: "#ef4444" }}>{formatCurrency(estimatedEMD)}</div></div></div></div>
              </div>
            </>
          )}

          {/* LIVE TENDERS */}
          {active === "Live tenders" && <div style={{ display: "grid", gap: 12 }}>{filteredTenders.map((t) => (<div key={t.id} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)} style={{ ...cardStyle, cursor: "pointer", marginBottom: 0 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 10, background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#64748b" }}>{t.source || "LIVE"}</span><span style={{ fontSize: 10, background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>{t.match_score || 50}% Match</span></div><h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 6px" }}>{t.title}</h3><p style={{ fontSize: 11, color: "#8591a5", margin: "0 0 12px" }}>{t.org_name} · {t.state}</p><div style={{ display: "flex", gap: 20, fontSize: 11, color: "#8994a6", background: "#f9fafc", padding: 10, borderRadius: 8 }}><span>◈ Value: <b style={{ color: "#17233b" }}>{formatCurrency(t.value)}</b></span><span>◷ Deadline: <b style={{ color: "#ef4444" }}>{t.closing_date ? new Date(t.closing_date).toLocaleDateString("en-IN") : "N/A"}</b></span></div></div>))}</div>}

          {/* AI CHAT */}
          {active === "AI tender brain" && (
            <div style={{ ...cardStyle, padding: 0, display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #e8edf5", display: "flex", justifyContent: "space-between", background: "#f8fafc" }}>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}><option value="hi">Hindi</option><option value="en">English</option></select>
                <button onClick={() => window.print()} style={{ background: "#fff", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>📄 Download PDF</button>
              </div>
              <div style={{ padding: 20, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {chatHistory.map((msg, i) => (<div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}><div style={{ background: msg.role === "user" ? "#315efb" : "#fff", color: msg.role === "user" ? "#fff" : "#17233b", padding: "14px 18px", borderRadius: 16, borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role === "assistant" ? 4 : 16, maxWidth: "85%", fontSize: 14, border: msg.role === "assistant" ? "1px solid #e8edf5" : "none" }}>{msg.content}</div></div>))}
                {chatLoading && <div style={{ color: "#64748b", fontSize: 12 }}>BidWell AI is analyzing...</div>}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: 16, borderTop: "1px solid #e8edf5", display: "flex", gap: 10 }}><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage()} placeholder="Ask anything..." style={{ flex: 1, padding: "14px 20px", borderRadius: 24, border: "1px solid #e8edf5", outline: "none" }} /><button onClick={() => handleSendMessage()} style={{ background: "#315efb", color: "#fff", border: "none", padding: "0 24px", borderRadius: 24, fontWeight: 800, cursor: "pointer" }}>Send</button></div>
            </div>
          )}

          {/* BID WORKSPACE */}
          {active === "Bid workspace" && (
            <div style={{ display: "grid", gap: 16 }}>
              {workspaceLoading ? <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading your bids...</div> : workspace.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: "center", padding: 40 }}><div style={{ fontSize: 30, marginBottom: 10 }}>📁</div><div style={{ fontSize: 16, fontWeight: 800 }}>No active bids</div><p style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Go to Live Tenders and click "Track this Tender in Workspace" to start tracking.</p></div>
              ) : (
                workspace.map((w) => (
                  <div key={w.id} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><div><div style={{ fontSize: 14, fontWeight: 800 }}>{w.title}</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{w.org_name}</div></div>
                      <select value={w.status} onChange={async (e) => { const newStatus = e.target.value; const updated = workspace.map(item => item.id === w.id ? { ...item, status: newStatus } : item); setWorkspace(updated); const { data: { session } } = await supabase.auth.getSession(); await fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session?.access_token }, body: JSON.stringify({ id: w.id, status: newStatus }) }); }} style={{ padding: 6, borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 11, fontWeight: 700, background: w.status === 'Submitted' ? '#dcfce7' : '#f8fafc' }}>
                        <option value="Review">Review</option><option value="Preparing">Preparing</option><option value="Submitted">Submitted</option><option value="Won">Won</option><option value="Lost">Lost</option>
                      </select>
                    </div>
                    <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", marginBottom: 8 }}>Checklist:</div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}><input type="checkbox" checked={w.checklist?.emd || false} onChange={async () => { const newChecklist = { ...w.checklist, emd: !w.checklist?.emd }; const updated = workspace.map(item => item.id === w.id ? { ...item, checklist: newChecklist } : item); setWorkspace(updated); const { data: { session } } = await supabase.auth.getSession(); await fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session?.access_token }, body: JSON.stringify({ id: w.id, checklist: newChecklist }) }); }} /> EMD Paid</label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}><input type="checkbox" checked={w.checklist?.docs || false} onChange={async () => { const newChecklist = { ...w.checklist, docs: !w.checklist?.docs }; const updated = workspace.map(item => item.id === w.id ? { ...item, checklist: newChecklist } : item); setWorkspace(updated); const { data: { session } } = await supabase.auth.getSession(); await fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session?.access_token }, body: JSON.stringify({ id: w.id, checklist: newChecklist }) }); }} /> Docs Ready</label>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}><span>Deadline: <b style={{ color: "#ef4444" }}>{w.closing_date}</b></span><span>Value: <b>{formatCurrency(w.value)}</b></span></div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CONTRACTS */}
          {active === "Contracts" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ fontSize: 14, fontWeight: 800 }}>Active Contracts</div><button style={{ background: "#315efb", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+ Add Contract</button></div>
                {contracts.map((c, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f2f7" }}><div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</div><div style={{ fontSize: 11, color: "#64748b" }}>Expires: {c.expiry}</div></div><span style={{ fontSize: 10, background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>{c.status}</span></div>))}
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {active === "Payments & invoices" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ fontSize: 14, fontWeight: 800 }}>Recent Invoices</div><button style={{ background: "#315efb", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+ New Invoice</button></div>
                {invoices.map((inv, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f2f7" }}><div><div style={{ fontSize: 13, fontWeight: 700 }}>{inv.id}</div><div style={{ fontSize: 11, color: "#64748b" }}>Date: {inv.date}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 800 }}>{inv.amount}</div><span style={{ fontSize: 10, color: inv.status === 'Paid' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{inv.status}</span></div></div>))}
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {active === "Documents" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>My Uploaded Documents</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  {Object.keys(profile.documents).map(docName => {
                    const doc = profile.documents[docName];
                    if (!doc.url) return null;
                    return (
                      <div key={docName} style={{ border: "1px solid #e8edf5", padding: 16, borderRadius: 10, textAlign: "center", background: "#f0fdf4" }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{docName}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>No: {doc.number || "N/A"}</div>
                        <a href={doc.url} target="_blank" style={{ display: "block", fontSize: 11, color: "#315efb", marginTop: 8 }}>View File</a>
                      </div>
                    );
                  })}
                  {Object.keys(profile.documents).length === 0 && <div style={{ fontSize: 12, color: "#64748b" }}>No documents uploaded yet. Go to Company Profile.</div>}
                </div>
              </div>
            </div>
          )}

          {/* WORKFORCE */}
          {active === "Workforce" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ fontSize: 14, fontWeight: 800 }}>Staff Attendance</div><button style={{ background: "#315efb", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+ Add Staff</button></div>
                {staffList.map((s, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f2f7" }}><div><div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div><div style={{ fontSize: 11, color: "#64748b" }}>{s.role}</div></div><span style={{ fontSize: 10, background: s.status === 'Present' ? '#dcfce7' : '#fef2f2', color: s.status === 'Present' ? '#065f46' : '#991b1b', padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>{s.status}</span></div>))}
              </div>
            </div>
          )}

          {/* TEAM */}
          {active === "Team" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Workspace Team</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <input type="text" value={newTeamMember} onChange={e => setNewTeamMember(e.target.value)} placeholder="Enter email to invite" style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
                  <button onClick={() => { if(newTeamMember) { setTeamMembers([...teamMembers, { name: newTeamMember, role: "Member" }]); setNewTeamMember(""); } }} style={{ background: "#315efb", color: "#fff", border: "none", padding: "0 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Invite</button>
                </div>
                {teamMembers.map((m, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f2f7" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div><span style={{ fontSize: 11, color: "#64748b" }}>{m.role}</span></div>))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {active === "Notifications" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Recent Alerts</div>
                {notifications.map(n => (<div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #f0f2f7" }}><div style={{ fontSize: 20 }}>{n.type === 'tender' ? '🔔' : '🤝'}</div><div><div style={{ fontSize: 13, fontWeight: 700 }}>{n.text}</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{n.time}</div></div></div>))}
              </div>
            </div>
          )}

          {/* SUBSCRIPTION */}
          {active === "Subscription" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: 20, borderRadius: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#065f46" }}>🎉 1 Month Free Trial Active</div>
                <div style={{ fontSize: 12, color: "#047857", marginTop: 4 }}>You have full access to all features. Upgrade anytime to continue after your trial ends.</div>
              </div>
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 16, fontWeight: 900 }}>Pro Plan</div><div style={{ background: "#315efb", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>MOST POPULAR</div></div>
                <div style={{ fontSize: 28, fontWeight: 900, margin: "16px 0" }}>₹999<span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>/month</span></div>
                <ul style={{ paddingLeft: 16, fontSize: 13, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}><li>Unlimited Tender Access</li><li>AI Rate Suggestions</li><li>Document Vault (10 GB)</li><li>5 Team Members</li></ul>
                <button style={{ width: "100%", background: "#315efb", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Upgrade to Pro</button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {active === "Settings" && (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Account Settings</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f2f7" }}><div><div style={{ fontSize: 13, fontWeight: 700 }}>Email Notifications</div><div style={{ fontSize: 11, color: "#64748b" }}>Receive daily tender alerts</div></div><input type="checkbox" defaultChecked style={{ width: 20, height: 20 }} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}><div><div style={{ fontSize: 13, fontWeight: 700 }}>Two-Factor Authentication</div><div style={{ fontSize: 11, color: "#64748b" }}>Secure your account</div></div><input type="checkbox" style={{ width: 20, height: 20 }} /></div>
                </div>
                <button onClick={handleLogout} style={{ width: "100%", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", padding: "12px", borderRadius: 8, fontWeight: 800, marginTop: 24, cursor: "pointer" }}>Log Out from Device</button>
              </div>
            </div>
          )}

          {/* COMPANY PROFILE */}
          {active === "Company profile" && (
            <div style={{ display: "grid", gap: 20 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b", marginBottom: 16 }}>Company Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Company Name</label><input value={profile.company_name || ""} onChange={e => setProfile({...profile, company_name: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Business Sector</label><select value={profile.business_type || "Construction"} onChange={e => setProfile({...profile, business_type: e.target.value, documents: {}})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13, background: "#f8fafc" }}>{Object.keys(SECTOR_DOCS).map(sec => <option key={sec} value={sec}>{sec}</option>)}</select></div>
                  <div><label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>GSTIN</label><input value={profile.gstin || ""} onChange={e => setProfile({...profile, gstin: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>PAN Number</label><input value={profile.pan || ""} onChange={e => setProfile({...profile, pan: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Annual Turnover (₹)</label><input type="number" value={profile.turnover || ""} onChange={e => setProfile({...profile, turnover: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Experience (Years)</label><input type="number" value={profile.experience_years || ""} onChange={e => setProfile({...profile, experience_years: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 13 }} /></div>
                </div>
                <button onClick={handleSaveProfile} disabled={profileSaving} style={{ background: "#315efb", color: "#fff", border: "none", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 20, width: "100%" }}>{profileSaving ? "Saving..." : "Save Company Details & Documents"}</button>
              </div>

              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>Required Documents ({profile.business_type})</div><div style={{ fontSize: 11, color: "#10b981", background: "#ecfdf5", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>Saved Once, Used Forever</div></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {(SECTOR_DOCS[profile.business_type] || SECTOR_DOCS["General Supply"]).map((docName) => {
                    const docData = profile.documents && profile.documents[docName] ? profile.documents[docName] : { number: "", url: "" };
                    const isUploaded = docData.url;
                    return (
                      <div key={docName} style={{ border: "1px solid #e8edf5", borderRadius: 12, padding: 16, background: isUploaded ? "#f0fdf4" : "#fff" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ fontSize: 20 }}>{isUploaded ? "✅" : "📄"}</div><div style={{ fontSize: 13, fontWeight: 700, color: isUploaded ? "#166534" : "#17233b" }}>{docName}</div></div>
                        <input type="text" placeholder={`Enter ${docName} Number`} value={docData.number || ""} onChange={(e) => handleDocTextChange(docName, e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12, marginBottom: 10 }} />
                        {isUploaded ? (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#dcfce7", padding: "8px 12px", borderRadius: 8 }}><span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>File Attached</span><a href={docData.url} target="_blank" style={{ fontSize: 11, color: "#315efb", fontWeight: 700, textDecoration: "underline" }}>View File</a></div>) : (<div><input type="file" id={`upload-${docName}`} style={{ display: "none" }} onChange={(e) => handleDocUpload(e, docName)} /><label htmlFor={`upload-${docName}`} style={{ background: "#f1f5f9", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#315efb", display: "block", textAlign: "center", border: "1px dashed #cbd5e1" }}>{uploadingDoc === docName ? "Uploading..." : "Upload File (PDF/Image)"}</label></div>)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
