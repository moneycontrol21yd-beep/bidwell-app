"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  
  // AI Chat States
  const [language, setLanguage] = useState("hi");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Namaste! Main BidWell AI hoon. Aap kisi bhi tender, eligibility ya document ke baare me puch sakte hain. Ya apna document upload karein." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState<{name: string, type: string} | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({ name: file.name, type: file.type });
      setShowAttachMenu(false);
    }
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

  const filteredTenders = tenders.filter((t) =>
    `${t.title} ${t.org_name} ${t.state}`.toLowerCase().includes(query.toLowerCase())
  );

  // --- SAFE CALCULATIONS ---
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
    const num = parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
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
        
        {/* Header */}
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
                  <button style={{ width: "100%", background: "#fff", color: "#1e1b4b", padding: "10px", borderRadius: 8, border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>Find JV Partners ↗</button>
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

          {/* AI CHAT TAB (With Language, Attachments, Quick Actions) */}
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

              <input type="file" ref={pdfInputRef} accept="application/pdf" onChange={handleFileSelect} style={{ display: "none" }} />
              <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />
            </div>
          )}

          {/* Other Tabs (Placeholder) */}
          {!["Overview", "Live tenders", "AI tender brain"].includes(active) && (
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
