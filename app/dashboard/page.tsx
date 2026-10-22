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
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Profile States
  const [profile, setProfile] = useState<any>({
    company_name: "", gstin: "", pan: "", msme: "", turnover: "", experience_years: "", business_type: "Construction", documents: {}
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState("");

  // AI Chat States
  const [language, setLanguage] = useState("hi");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Namaste! Main BidWell AI hoon. Aap kisi bhi tender, eligibility ya document ke baare me puch sakte hain." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState<{name: string, type: string} | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // JV Feature States
  const [showJVModal, setShowJVModal] = useState(false);
  const [jvPartners, setJvPartners] = useState<any[]>([]);
  const [jvLoading, setJvLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [userSector, setUserSector] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });

    fetch("/api/tenders?page=0")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tenders) {
          const today = new Date();
          const activeTenders = data.tenders
            .filter((t: any) => t.closing_date && new Date(t.closing_date) >= today)
            .sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0));
          setTenders(activeTenders);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Fetch Profile when tab opens
  useEffect(() => {
    if (active === "Company profile") {
      fetch('/api/company-profile').then(r => r.json()).then(d => {
        if (d.success && d.profile) {
          const prof = { ...d.profile };
          if (!prof.documents) prof.documents = {};
          if (!prof.business_type) prof.business_type = "Construction";
          setProfile(prof);
        }
      });
    }
  }, [active]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
        const updatedDocs = { ...profile.documents, [docName]: data.url };
        const updatedProfile = { ...profile, documents: updatedDocs };
        setProfile(updatedProfile);
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

  const handleSendMessage = async (customPrompt?: string) => {
    const msg = customPrompt || chatInput;
    if(!msg.trim() && !attachment) return;

    let displayMsg = msg;
    if (attachment) {
      displayMsg = `[Attached: ${attachment.name}] ${msg || "Please analyze this document."}`;
    }

    setChatHistory(prev => [...prev, { role: "user", content: displayMsg }]);
    setChatInput("");
    setAttachment(null);
    setChatLoading(true);
    
    try {
      const res = await fetch("/api/ai-chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ prompt: displayMsg, language }) 
      });
      const data = await res.json();
      if(data.success) setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      else setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, VPS Brain is currently unreachable." }]);
    } catch (e) { 
      setChatHistory(prev => [...prev, { role: "assistant", content: "Error connecting to AI Brain." }]); 
    }
    setChatLoading(false);
  };

  const handleOpenJV = async () => {
    setShowJVModal(true);
    setSelectedPartner(null);
    if (jvPartners.length === 0) {
      setJvLoading(true);
      try {
        const res = await fetch("/api/jv-search");
        const data = await res.json();
        if (data.success) {
          setJvPartners(data.partners);
          setUserSector(data.userSector);
        }
      } catch (e) {}
      setJvLoading(false);
    }
  };

  const filteredTenders = tenders.filter((t) =>
    `${t.title} ${t.org_name} ${t.state}`.toLowerCase().includes(query.toLowerCase())
  );

  const top3Tenders = tenders.slice(0, 3);
  const potentialRevenue = top3Tenders.reduce((sum, t) => {
    if (!t.value) return sum;
    const cleanValue = String(t.value).replace(/[^0-9.-]+/g, "");
    const numericValue = parseFloat(cleanValue);
    return sum + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);
  const estimatedEMD = potentialRevenue * 0.02;

  const formatCurrency = (amount: any) => {
    if (!amount || amount === "N/A" || amount === "0" || amount === null) return "Check Portal";
    const cleanStr = String(amount).replace(/[^0-9.-]+/g, "");
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } 
    catch (e) { return dateStr; }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      
      {mobileMenu && (
        <div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
      )}

      {/* JV Modal (Same as before) */}
      {showJVModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 550, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: 20, borderBottom: "1px solid #e8edf5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#17233b" }}>🤝 Smart JV Match</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Based on your profile: <b style={{ color: "#315efb" }}>{userSector || "General"}</b></div>
              </div>
              <button onClick={() => setShowJVModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748b" }}>×</button>
            </div>
            
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {jvLoading ? (
                <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>Matching with VPS Database...</div>
              ) : selectedPartner ? (
                <div>
                  <button onClick={() => setSelectedPartner(null)} style={{ background: "none", border: "none", color: "#315efb", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>← Back to list</button>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#17233b" }}>{selectedPartner.vendor_name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{selectedPartner.sector} · {selectedPartner.state}</div>
                  
                  <div style={{ display: "flex", gap: 12, marginTop: 20, marginBottom: 20 }}>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Est. Turnover</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>{formatCurrency(selectedPartner.turnover)}</div>
                    </div>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Past Wins</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#10b981" }}>{selectedPartner.experience} Tenders</div>
                    </div>
                  </div>

                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: 16, borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#991b1b", marginBottom: 8 }}>📄 Documents Required for JV</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#7f1d1d", lineHeight: 1.6 }}>
                      <li>Joint Venture Agreement (Notarized)</li>
                      <li>Both companies' GST & PAN</li>
                      <li>Power of Attorney (Lead Partner)</li>
                      <li>Consortium MoU (if applicable)</li>
                    </ul>
                  </div>

                  <button onClick={() => alert(`Request sent to ${selectedPartner.vendor_name}!`)} style={{ width: "100%", background: "#315efb", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 20 }}>Send JV Request ↗</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {jvPartners.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                      <div style={{ fontSize: 24, marginBottom: 10 }}>🔍</div>
                      No matches found. Complete your profile to get better matches.
                    </div>
                  ) : (
                    jvPartners.map((p, i) => (
                      <div key={i} style={{ border: "1px solid #e8edf5", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>{p.vendor_name}</div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{p.sector} · {p.state}</div>
                          </div>
                          <div style={{ background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{p.match}% Match</div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                          {p.matchReasons?.map((reason: string, idx: number) => (
                            <span key={idx} style={{ fontSize: 9, background: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#64748b", marginTop: 4 }}>
                          <span>Turnover: <b>{formatCurrency(p.turnover)}</b></span>
                          <span>Wins: <b>{p.experience}</b></span>
                        </div>
                        <button onClick={() => setSelectedPartner(p)} style={{ background: "#f1f5f9", color: "#315efb", border: "none", padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>View Profile & JV Docs</button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
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

          {/* OVERVIEW TAB */}
          {active === "Overview" && (
            <>
              <section style={{ borderRadius: 17, background: "linear-gradient(110deg,#142544 0%,#172d52 62%,#244276 100%)", padding: "25px 20px", color: "white", display: "flex", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b6c9f6", fontSize: 9, fontWeight: 800 }}>
                    <span style={{ fontSize: 18 }}>✳</span> BIDWELL INTELLIGENCE
                  </div>
                  <h2 style={{ fontSize: 28, lineHeight: 1.15, margin: "12px 0 9px" }}>Better tenders.<br /><span style={{ color: "#8eafff" }}>Stronger bids.</span></h2>
                  <p style={{ fontSize: 11, color: "#bdc9df", maxWidth: 355, margin: "0 0 15px" }}>Your AI-powered workspace to discover opportunities, prepare bids and stay on top of every contract.</p>
                  <button onClick={() => setActive("Live tenders")} style={{ background: "#fff", color: "#1b2c4a", padding: "10px 14px", borderRadius: 9, border: 0, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Explore tenders ↗</button>
                </div>
              </section>

              <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20 }}>
                  <div style={{ fontSize: 18, marginBottom: 12, color: "#315efb" }}>⌕</div>
                  <div style={{ fontSize: 10, color: "#7b879b" }}>Live Opportunities</div>
                  <div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0", color: "#17233b" }}>{loading ? "..." : tenders.length}</div>
                  <div style={{ fontSize: 9, color: "#748198" }}><span style={{ color: "#1ba47d", fontWeight: 800 }}>↗</span> From VPS Brain</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20 }}>
                  <div style={{ fontSize: 18, marginBottom: 12, color: "#8b5cf6" }}>▤</div>
                  <div style={{ fontSize: 10, color: "#7b879b" }}>Active Bids</div>
                  <div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0", color: "#17233b" }}>06</div>
                  <div style={{ fontSize: 9, color: "#748198" }}><span style={{ color: "#1ba47d", fontWeight: 800 }}>↗</span> 2 due this week</div>
                </div>
              </section>

              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 19 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>Top 3 Matched Tenders</div>
                    <div style={{ fontSize: 11, color: "#8792a5" }}>Highest probability of winning</div>
                  </div>
                  <button onClick={() => setActive("Live tenders")} style={{ background: "transparent", border: 0, color: "#315efb", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>View all ↗</button>
                </div>
                <div style={{ overflowX: "auto", width: "100%" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 500 }}>
                    <thead><tr style={{ borderBottom: "1px solid #edf0f6" }}><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>OPPORTUNITY</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>VALUE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>DEADLINE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>MATCH</th></tr></thead>
                    <tbody>
                      {loading ? <tr><td colSpan={4} style={{ padding: 20, fontSize: 12 }}>Fetching...</td></tr> : 
                      top3Tenders.map(t => <tr key={t.id} style={{ borderBottom: "1px solid #f0f2f7", cursor: "pointer" }} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)}>
                        <td style={{ padding: "13px 10px" }}><div style={{ fontWeight: 700, fontSize: 11, color: "#26344d" }}>{t.title}</div><small style={{ fontSize: 9, color: "#8792a5" }}>{t.org_name} · {t.state}</small></td>
                        <td style={{ padding: "13px 10px", fontSize: 11, fontWeight: 800, color: "#17233b" }}>{formatCurrency(t.value)}</td>
                        <td style={{ padding: "13px 10px", fontSize: 11, color: "#ef4444", fontWeight: 700 }}>{formatDate(t.closing_date)}</td>
                        <td style={{ padding: "13px 10px" }}><span style={{ background: t.match_score >= 80 ? "#e3f7ef" : "#fff3db", color: t.match_score >= 80 ? "#168363" : "#a8751b", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match_score || 50}%</span></td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginTop: 30, marginBottom: 15 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#17233b", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>📈</span> Future & Growth
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Your AI Business Partner to scale beyond just tenders.</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                <div style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", borderRadius: 14, border: "1px solid #a5b4fc", padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#3730a3" }}>🚀 Future for BidWell</div>
                    <div style={{ background: "#4f46e5", color: "#fff", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 800 }}>Roadmap</div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#312e81", lineHeight: 2, fontWeight: 600 }}>
                    <li>AI-Powered Legal Documentation</li>
                    <li>Zero-Paperwork Bidding System</li>
                    <li>Real-time Payment Tracking</li>
                    <li>Expand to 10+ States</li>
                  </ul>
                </div>

                <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", borderRadius: 14, padding: 20, color: "#fff" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🤝 JV for BidWell</div>
                  <p style={{ fontSize: 12, color: "#c7d2fe", lineHeight: 1.6, marginBottom: 16 }}>Looking to bid for larger projects? Find trusted Joint Venture partners to strengthen your bid.</p>
                  <button onClick={handleOpenJV} style={{ width: "100%", background: "#fff", color: "#1e1b4b", padding: "10px", borderRadius: 8, border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>Find JV Partners ↗</button>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#17233b", marginBottom: 12 }}>📊 Revenue Planner <span style={{ fontSize: 9, color: "#ef4444", background: "#fef2f2", padding: "2px 6px", borderRadius: 4 }}>Live Est.</span></div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Top 3 Potential</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#17233b" }}>{formatCurrency(potentialRevenue)}</div>
                    </div>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Est. EMD Req.</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#ef4444" }}>{formatCurrency(estimatedEMD)}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, fontStyle: "italic" }}>*Calculated from your top 3 matched live tenders.</p>
                </div>
              </div>
            </>
          )}

          {/* LIVE TENDERS TAB */}
          {active === "Live tenders" && (
            <div style={{ display: "grid", gap: 12 }}>
              {filteredTenders.map((t) => (
                <div key={t.id} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)} style={{ background: "#fff", padding: 20, borderRadius: 14, border: "1px solid #e8edf5", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#64748b" }}>{t.source || "LIVE"}</span>
                    <span style={{ fontSize: 10, background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>{t.match_score || 50}% Match</span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#26354e", margin: "0 0 6px" }}>{t.title}</h3>
                  <p style={{ fontSize: 11, color: "#8591a5", margin: "0 0 12px" }}>{t.org_name || "Department"} · {t.state || "India"}</p>
                  <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#8994a6", background: "#f9fafc", padding: 10, borderRadius: 8 }}>
                    <span>◈ Value: <b style={{ color: "#17233b" }}>{formatCurrency(t.value)}</b></span>
                    <span>◷ Deadline: <b style={{ color: "#ef4444" }}>{formatDate(t.closing_date)}</b></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI CHAT TAB */}
          {active === "AI tender brain" && (
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", overflow: "hidden", position: "relative" }}>
              
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #e8edf5", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Language:</span>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="en">English</option>
                    <option value="mr">Marathi (मराठी)</option>
                  </select>
                </div>
                <button onClick={() => window.print()} style={{ background: "#fff", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>📄 Download PDF</button>
              </div>

              <div style={{ padding: 20, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                     <div style={{ background: msg.role === "user" ? "#315efb" : "#fff", color: msg.role === "user" ? "#fff" : "#17233b", padding: "14px 18px", borderRadius: 16, borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role === "assistant" ? 4 : 16, maxWidth: "85%", fontSize: 14, lineHeight: 1.6, border: msg.role === "assistant" ? "1px solid #e8edf5" : "none" }}>
                       {msg.content}
                     </div>
                  </div>
                ))}
                {chatLoading && <div style={{ color: "#64748b", fontSize: 12, padding: "10px 14px", background: "#fff", borderRadius: 16, border: "1px solid #e8edf5", width: "fit-content" }}>BidWell AI is analyzing...</div>}
                <div ref={chatEndRef} />
              </div>

              <div style={{ padding: "0 20px 10px", display: "flex", gap: 8, overflowX: "auto" }}>
                <button onClick={() => handleSendMessage("Mujhe tender ke liye kaunse documents chahiye?")} style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 15, border: "1px solid #cbd5e1", background: "#fff", fontSize: 11, cursor: "pointer" }}>📄 Required Documents</button>
                <button onClick={() => handleSendMessage("Is tender ki payment condition kya hai?")} style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 15, border: "1px solid #cbd5e1", background: "#fff", fontSize: 11, cursor: "pointer" }}>💰 Payment Info</button>
                <button onClick={() => handleSendMessage("Mujhe Udyam certificate ka official link do.")} style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 15, border: "1px solid #cbd5e1", background: "#fff", fontSize: 11, cursor: "pointer" }}>🔗 Legal Source</button>
              </div>

              {showAttachMenu && (
                <div style={{ position: "absolute", bottom: 80, left: 20, background: "#fff", border: "1px solid #e8edf5", borderRadius: 12, padding: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 10 }}>
                  <button onClick={() => pdfInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "none", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>📄 Upload PDF</button>
                  <button onClick={() => cameraInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "none", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>📸 Take Photo</button>
                </div>
              )}

              {attachment && (
                <div style={{ padding: "10px 20px", background: "#f8fafc", borderTop: "1px solid #e8edf5", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📎</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 12, width: 24, height: 24, cursor: "pointer", display: "grid", placeItems: "center", fontSize: 12 }}>✕</button>
                </div>
              )}

              <div style={{ padding: 16, borderTop: "1px solid #e8edf5", display: "flex", gap: 10, background: "#fff", alignItems: "center" }}>
                <button onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ background: "#f1f5f9", border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", fontSize: 20, display: "grid", placeItems: "center", color: "#64748b" }}>+</button>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage()} placeholder="Ask anything or upload document..." style={{ flex: 1, padding: "14px 20px", borderRadius: 24, border: "1px solid #e8edf5", outline: "none", fontSize: 14, background: "#f8fafc" }} />
                <button onClick={() => handleSendMessage()} style={{ background: "#315efb", color: "#fff", border: "none", padding: "0 24px", borderRadius: 24, fontWeight: 800, cursor: "pointer", height: 44 }}>Send</button>
              </div>

              <input type="file" ref={pdfInputRef} accept="application/pdf" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) { setAttachment({name: file.name, type: file.type}); setShowAttachMenu(false); }
              }} style={{ display: "none" }} />
              <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) { setAttachment({name: file.name, type: file.type}); setShowAttachMenu(false); }
              }} style={{ display: "none" }} />
            </div>
          )}

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
          {!["Overview", "Live tenders", "AI tender brain", "Company profile"].includes(active) && (
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
