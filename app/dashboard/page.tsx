"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

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

const LIGHT_THEME = { bg: "#f5f7fb", card: "#ffffff", text: "#17233b", sub: "#64748b", border: "#e8edf5", accent: "#315efb", success: "#10b981", danger: "#ef4444" };
const DARK_THEME = { bg: "#0f172a", card: "#1e293b", text: "#f8fafc", sub: "#94a3b8", border: "#334155", accent: "#3b82f6", success: "#10b981", danger: "#ef4444" };

export default function Dashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  
  // Pagination States
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const C = isDarkMode ? DARK_THEME : LIGHT_THEME;

  // Profile & Workspace States
  const [profile, setProfile] = useState<any>({ company_name: "", gstin: "", pan: "", msme: "", turnover: "", experience_years: "", business_type: "Construction", documents: {} });
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState("");
  const [workspace, setWorkspace] = useState<any[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  // AI Chat States
  const [language, setLanguage] = useState("hi");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Namaste! Main BidWell AI hoon. Aap kisi bhi tender, eligibility ya document ke baare me puch sakte hain." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState<{name: string, type: string} | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // JV Feature States
  const [showJVModal, setShowJVModal] = useState(false);
  const [jvPartners, setJvPartners] = useState<any[]>([]);
  const [jvLoading, setJvLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [userSector, setUserSector] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  // Mock Data
  const [teamMembers] = useState([{ name: "Harsh Rai", role: "Owner" }, { name: "Amit Sharma", role: "Bid Manager" }]);
  const [invoices] = useState([{ id: "INV-001", amount: "₹45,000", status: "Paid", date: "15 Oct 2026" }]);
  const [contracts] = useState([{ id: "CNT-001", title: "School Maintenance", status: "Active", expiry: "Dec 2026" }]);
  const [notifications] = useState([
    { id: 1, text: "New tender matching your profile in MP.", time: "2 hours ago", type: "tender" },
    { id: 2, text: "Your JV request was accepted by Shakti Infra.", time: "1 day ago", type: "jv" }
  ]);
  const [staffList] = useState([{ name: "Ramesh", role: "Site Engineer", status: "Present" }]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const fetchTendersData = async (pageNum: number, append: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenders?page=${pageNum}`);
      const data = await res.json();
      if (data.success && data.tenders) {
        const today = new Date();
        const activeTenders = data.tenders.filter((t: any) => t.closing_date && new Date(t.closing_date) >= today).sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0));
        
        if (append) {
          setTenders(prev => {
            const existingIds = new Set(prev.map((p: any) => p.id || p.source_tender_id));
            const newUnique = activeTenders.filter((t: any) => !existingIds.has(t.id || t.source_tender_id));
            return [...prev, ...newUnique];
          });
        } else {
          setTenders(activeTenders);
        }
        
        setHasMore(data.tenders.length === 50); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });
    fetchTendersData(0, false);
  }, [router]);

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

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else { alert("Text-to-speech not supported."); }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => prev + " " + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({ name: file.name, type: file.type });
      setShowAttachMenu(false);
    }
  };

  const downloadChatPDF = () => {
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(16);
    doc.text("BidWell AI - Tender Consultation", 10, y);
    y += 10;
    doc.setFontSize(11);
    chatHistory.forEach((msg) => {
      const sender = msg.role === "user" ? "YOU: " : "BIDWELL AI: ";
      const cleanContent = msg.content.replace(/[*#]/g, ''); 
      const lines = doc.splitTextToSize(`${sender}${cleanContent}`, 180);
      if (y + lines.length * 6 > 280) { doc.addPage(); y = 15; }
      doc.text(lines, 10, y);
      y += lines.length * 6 + 5;
    });
    doc.save("BidWell_Chat_History.pdf");
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const msg = customPrompt || chatInput;
    if(!msg.trim()) return;
    
    setChatHistory(prev => [...prev, { role: "user", content: msg }]);
    setChatInput("");
    setChatLoading(true);
    setChatHistory(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai-chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ prompt: msg, language }) 
      });

      if (!res.body) throw new Error("No stream");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              if (json.response) {
                aiResponse += json.response;
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1] = { role: "assistant", content: aiResponse };
                  return newHistory;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { role: "assistant", content: "❌ Error connecting to AI Brain." };
        return newHistory;
      });
    }
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

  const cardStyle = { background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20, boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.02)", marginBottom: 16, color: C.text, width: "100%", boxSizing: "border-box" as const, wordBreak: "break-word" as const };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: C.bg, fontFamily: "system-ui, sans-serif", display: "flex", color: C.text, overflow: "hidden" }}>
      
      {mobileMenu && <div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}

      {/* JV Modal */}
      {showJVModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: C.card, borderRadius: 16, width: "100%", maxWidth: 550, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: C.text }}>🤝 Smart JV Match</div></div>
              <button onClick={() => setShowJVModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: C.sub }}>×</button>
            </div>
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {jvLoading ? <div style={{ textAlign: "center", padding: 30, color: C.sub }}>Matching...</div> : selectedPartner ? (
                <div>
                  <button onClick={() => { setSelectedPartner(null); setRequestSent(false); }} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>← Back</button>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.text }}>{selectedPartner.vendor_name}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16 }}>
                    <div style={{ flex: 1, background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 12, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.sub }}>Turnover</div><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>₹{(selectedPartner.total_value / 10000000).toFixed(2)} Cr</div></div>
                    <div style={{ flex: 1, background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 12, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.sub }}>Wins</div><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{selectedPartner.total_wins} Tenders</div></div>
                  </div>
                  {!requestSent ? <button onClick={() => setRequestSent(true)} style={{ width: "100%", background: C.accent, color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Send Request</button> : <div style={{ background: "#ecfdf5", padding: 12, borderRadius: 8, textAlign: "center", color: "#065f46", fontWeight: 800 }}>✅ Request Sent!</div>}
                </div>
              ) : jvPartners.map((p, i) => (
                <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{p.vendor_name}</div><div style={{ background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{p.match}%</div></div>
                  <div style={{ fontSize: 11, color: C.sub, marginBottom: 8 }}>{p.sector} · {p.state}</div>
                  <button onClick={() => setSelectedPartner(p)} style={{ background: isDarkMode ? "#334155" : "#f1f5f9", color: C.accent, border: "none", padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}>View Profile</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: 260, background: "linear-gradient(180deg,#101b32 0%,#142442 100%)", color: "#d5deee", padding: "24px 15px", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50, transform: mobileMenu ? "translateX(0)" : "translateX(-100%)", transition: "0.3s", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 12px 25px", color: "#fff", fontSize: 22, fontWeight: 800 }}><div style={{ height: 38, width: 38, borderRadius: 12, background: C.accent, display: "grid", placeItems: "center" }}>B</div> BidWell</div>
        <div style={{ flex: 1 }}>
          {nav.map((section) => (
            <div key={section.group} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#7788a6", padding: "0 12px 10px" }}>{section.group}</div>
              {section.items.map(([label, icon]) => (
                <button key={label} onClick={() => { setActive(label); setMobileMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: 0, borderRadius: 9, background: active === label ? C.accent : "transparent", color: active === label ? "#fff" : "#aab8cf", margin: "2px 0", fontSize: 12, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 17, textAlign: "center" }}>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} style={{ width: "100%", padding: "11px 12px", border: 0, borderRadius: 9, background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", textAlign: "left", fontSize: 12, cursor: "pointer" }}>↪ Log Out</button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", width: "100%", minWidth: 0 }}>
        
        {/* Header */}
        <header style={{ height: 75, flexShrink: 0, background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 15 }}>
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: C.text }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, background: isDarkMode ? "#0f172a" : "#fafbfe", borderRadius: 10, padding: "0 13px", height: 40, maxWidth: 400, width: "100%" }}>
            <span style={{ fontSize: 20, color: C.sub, marginRight: 8 }}>⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tenders..." style={{ border: 0, outline: 0, background: "transparent", flex: 1, fontSize: 12, color: C.text }} />
          </div>
        </header>

        {/* Tab Content Area */}
        <div style={{ flex: 1, overflowY: active === "AI tender brain" ? "hidden" : "auto", overflowX: "hidden", display: "flex", flexDirection: "column", scrollbarGutter: "stable", width: "100%" }}>
          
          {active !== "AI tender brain" && (
            <div style={{ padding: "20px", paddingBottom: "80px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
              <div style={{ marginBottom: 25 }}>
                <div style={{ fontSize: 10, color: C.sub, fontWeight: 800, letterSpacing: 1 }}>BIDWELL WORKSPACE</div>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: "9px 0 4px", color: C.text }}>{active}</h1>
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
                      <div style={{ fontSize: 18, marginBottom: 12, color: C.accent }}>⌕</div><div style={{ fontSize: 10, color: C.sub }}>Live Opportunities</div><div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0", color: C.text }}>{loading ? "..." : tenders.length}</div>
                    </div>
                    <div style={{ ...cardStyle, marginBottom: 0 }}>
                      <div style={{ fontSize: 18, marginBottom: 12, color: "#8b5cf6" }}>▤</div><div style={{ fontSize: 10, color: C.sub }}>Active Bids</div><div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0", color: C.text }}>{workspace.length}</div>
                    </div>
                  </section>

                  <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 19 }}><div><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Top 3 Matched Tenders</div><div style={{ fontSize: 11, color: C.sub }}>Highest probability of winning</div></div><button onClick={() => setActive("Live tenders")} style={{ background: "transparent", border: 0, color: C.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>View all ↗</button></div>
                    <div style={{ overflowX: "auto", width: "100%" }}><table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 500 }}><thead><tr style={{ borderBottom: `1px solid ${C.border}` }}><th style={{ fontSize: 9, padding: 10, color: C.sub }}>OPPORTUNITY</th><th style={{ fontSize: 9, padding: 10, color: C.sub }}>VALUE</th><th style={{ fontSize: 9, padding: 10, color: C.sub }}>DEADLINE</th><th style={{ fontSize: 9, padding: 10, color: C.sub }}>MATCH</th></tr></thead>
                      <tbody>{loading ? <tr><td colSpan={4} style={{ padding: 20, color: C.sub }}>Fetching...</td></tr> : top3Tenders.map(t => <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)}>
                        <td style={{ padding: 13 }}><div style={{ fontWeight: 700, fontSize: 11, color: C.text }}>{t.title}</div><small style={{ fontSize: 9, color: C.sub }}>{t.org_name} · {t.state}</small></td><td style={{ padding: 13, fontSize: 11, fontWeight: 800, color: C.text }}>{formatCurrency(t.value)}</td><td style={{ padding: 13, fontSize: 11, color: C.danger, fontWeight: 700 }}>{t.closing_date ? new Date(t.closing_date).toLocaleDateString('en-IN') : "N/A"}</td><td style={{ padding: 13 }}><span style={{ background: "#e3f7ef", color: "#168363", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match_score || 50}%</span></td>
                      </tr>)}</tbody></table></div>
                  </div>

                  <div style={{ marginTop: 30, marginBottom: 15 }}><div style={{ fontSize: 18, fontWeight: 900, color: C.text }}>📈 Future & Growth</div></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    <div style={{ ...cardStyle, background: isDarkMode ? "#1e1b4b" : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", border: `1px solid ${isDarkMode ? "#3730a3" : "#a5b4fc"}` }}><div style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? "#c7d2fe" : "#3730a3", marginBottom: 12 }}>🚀 Future for BidWell</div><ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: isDarkMode ? "#e0e7ff" : "#312e81", lineHeight: 2, fontWeight: 600 }}><li>AI-Powered Legal Docs</li><li>Zero-Paperwork Bidding</li><li>Expand to 10+ States</li></ul></div>
                    <div style={{ ...cardStyle, background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff" }}><div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🤝 JV for BidWell</div><p style={{ fontSize: 12, color: "#c7d2fe", marginBottom: 16 }}>Find trusted partners to strengthen your bid.</p><button onClick={handleOpenJV} style={{ width: "100%", background: "#fff", color: "#1e1b4b", padding: "10px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Find JV Partners ↗</button></div>
                    <div style={cardStyle}><div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: C.text }}>📊 Revenue Planner</div><div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1, background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 10, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.sub }}>Top 3 Potential</div><div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{formatCurrency(potentialRevenue)}</div></div><div style={{ flex: 1, background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 10, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.sub }}>Est. EMD</div><div style={{ fontSize: 16, fontWeight: 800, color: C.danger }}>{formatCurrency(estimatedEMD)}</div></div></div></div>
                  </div>
                </>
              )}

              {/* LIVE TENDERS */}
              {active === "Live tenders" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredTenders.map((t) => (
                    <div key={t.id || t.source_tender_id} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)} style={{ ...cardStyle, cursor: "pointer", marginBottom: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 10, background: isDarkMode ? "#334155" : "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: C.sub }}>{t.source || "LIVE"}</span><span style={{ fontSize: 10, background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>{t.match_score || 50}% Match</span></div>
                      <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 6px", color: C.text }}>{t.title}</h3>
                      <p style={{ fontSize: 11, color: C.sub, margin: "0 0 12px" }}>{t.org_name} · {t.state}</p>
                      <div style={{ display: "flex", gap: 20, fontSize: 11, color: C.sub, background: isDarkMode ? "#0f172a" : "#f9fafc", padding: 10, borderRadius: 8 }}><span>◈ Value: <b style={{ color: C.text }}>{formatCurrency(t.value)}</b></span><span>◷ Deadline: <b style={{ color: C.danger }}>{t.closing_date ? new Date(t.closing_date).toLocaleDateString("en-IN") : "N/A"}</b></span></div>
                    </div>
                  ))}

                  {hasMore && (
                    <div style={{ textAlign: "center", marginTop: 20, marginBottom: 40 }}>
                      <button 
                        onClick={() => {
                          const nextPage = page + 1;
                          setPage(nextPage);
                          fetchTendersData(nextPage, true);
                        }}
                        disabled={loading}
                        style={{ background: C.accent, color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", width: "100%", maxWidth: 300, margin: "0 auto", display: "block", opacity: loading ? 0.7 : 1, height: 48 }}
                      >
                        {loading ? "Loading More Tenders..." : "Load More Tenders"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* BID WORKSPACE */}
              {active === "Bid workspace" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {workspaceLoading ? <div style={{ padding: 20, textAlign: "center", color: C.sub }}>Loading your bids...</div> : workspace.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: "center", padding: 40 }}><div style={{ fontSize: 30, marginBottom: 10 }}>📁</div><div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>No active bids</div><p style={{ fontSize: 12, color: C.sub, marginTop: 8 }}>Go to Live Tenders and click "Track this Tender in Workspace" to start tracking.</p></div>
                  ) : (
                    workspace.map((w) => (
                      <div key={w.id} style={cardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><div><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{w.title}</div><div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{w.org_name}</div></div>
                          <select value={w.status} onChange={async (e) => { const newStatus = e.target.value; const updated = workspace.map(item => item.id === w.id ? { ...item, status: newStatus } : item); setWorkspace(updated); const { data: { session } } = await supabase.auth.getSession(); await fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session?.access_token }, body: JSON.stringify({ id: w.id, status: newStatus }) }); }} style={{ padding: 6, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, fontWeight: 700, background: w.status === 'Submitted' ? '#dcfce7' : isDarkMode ? '#0f172a' : '#f8fafc', color: w.status === 'Submitted' ? '#065f46' : C.text }}>
                            <option value="Review">Review</option><option value="Preparing">Preparing</option><option value="Submitted">Submitted</option><option value="Won">Won</option><option value="Lost">Lost</option>
                          </select>
                        </div>
                        <div style={{ background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: C.sub, marginBottom: 8 }}>Checklist:</div>
                          <div style={{ display: "flex", gap: 16 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text }}><input type="checkbox" checked={w.checklist?.emd || false} onChange={async () => { const newChecklist = { ...w.checklist, emd: !w.checklist?.emd }; const updated = workspace.map(item => item.id === w.id ? { ...item, checklist: newChecklist } : item); setWorkspace(updated); const { data: { session } } = await supabase.auth.getSession(); await fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session?.access_token }, body: JSON.stringify({ id: w.id, checklist: newChecklist }) }); }} /> EMD Paid</label>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text }}><input type="checkbox" checked={w.checklist?.docs || false} onChange={async () => { const newChecklist = { ...w.checklist, docs: !w.checklist?.docs }; const updated = workspace.map(item => item.id === w.id ? { ...item, checklist: newChecklist } : item); setWorkspace(updated); const { data: { session } } = await supabase.auth.getSession(); await fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session?.access_token }, body: JSON.stringify({ id: w.id, checklist: newChecklist }) }); }} /> Docs Ready</label>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.sub }}><span>Deadline: <b style={{ color: C.danger }}>{w.closing_date}</b></span><span>Value: <b style={{ color: C.text }}>{formatCurrency(w.value)}</b></span></div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* OTHER MODULES */}
              {["Contracts", "Payments & invoices", "Documents", "Workforce", "Team", "Notifications"].includes(active) && (
                <div style={cardStyle}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 16 }}>{active} Workspace</div>
                  <div style={{ textAlign: "center", padding: "40px 0", color: C.sub }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>📁</div>
                    <p style={{ fontSize: 13 }}>This module is ready. Add data to see it here.</p>
                  </div>
                </div>
              )}

              {/* SUBSCRIPTION */}
              {active === "Subscription" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: isDarkMode ? "#064e3b" : "#ecfdf5", border: `1px solid ${isDarkMode ? "#047857" : "#a7f3d0"}`, padding: 20, borderRadius: 14 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: isDarkMode ? "#d1fae5" : "#065f46" }}>🎉 1 Month Free Trial Active</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    <div style={{ ...cardStyle, border: `1px solid ${C.border}` }}><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>Basic</div><div style={{ fontSize: 24, fontWeight: 900, margin: "12px 0", color: C.text }}>Free</div><ul style={{ paddingLeft: 16, fontSize: 12, color: C.sub, lineHeight: 1.8, marginBottom: 20 }}><li>50 Tenders / month</li></ul><button style={{ width: "100%", background: isDarkMode ? "#334155" : "#f1f5f9", color: C.text, border: "none", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Current Plan</button></div>
                    <div style={{ ...cardStyle, border: `2px solid ${C.accent}`, position: "relative" }}><div style={{ position: "absolute", top: -10, right: 20, background: C.accent, color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>POPULAR</div><div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>Professional</div><div style={{ fontSize: 24, fontWeight: 900, margin: "12px 0", color: C.text }}>₹999<span style={{ fontSize: 12, color: C.sub }}>/mo</span></div><ul style={{ paddingLeft: 16, fontSize: 12, color: C.sub, lineHeight: 1.8, marginBottom: 20 }}><li>Unlimited Tenders</li><li>AI & JV Suite</li></ul><button style={{ width: "100%", background: C.accent, color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>Upgrade to Pro</button></div>
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {active === "Settings" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 16 }}>Appearance</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                      <div><div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Dark Mode</div><div style={{ fontSize: 11, color: C.sub }}>Switch theme</div></div>
                      <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ width: 50, height: 26, borderRadius: 13, background: isDarkMode ? C.accent : "#cbd5e1", border: "none", cursor: "pointer", position: "relative" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: isDarkMode ? 27 : 3, transition: "0.3s" }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPANY PROFILE */}
              {active === "Company profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 16 }}>Company Details</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div><label style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>Company Name</label><input value={profile.company_name || ""} onChange={e => setProfile({...profile, company_name: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, marginTop: 4, fontSize: 13, background: C.bg, color: C.text }} /></div>
                      <div><label style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>Business Sector</label><select value={profile.business_type || "Construction"} onChange={e => setProfile({...profile, business_type: e.target.value, documents: {}})} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, marginTop: 4, fontSize: 13, background: C.bg, color: C.text }}>{Object.keys(SECTOR_DOCS).map(sec => <option key={sec} value={sec}>{sec}</option>)}</select></div>
                    </div>
                    <button onClick={async () => { setProfileSaving(true); await fetch('/api/company-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }); setProfileSaving(false); alert("Saved!"); }} disabled={profileSaving} style={{ background: C.accent, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 20, width: "100%" }}>{profileSaving ? "Saving..." : "Save Company Details"}</button>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Required Documents ({profile.business_type})</div></div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
                      {(SECTOR_DOCS[profile.business_type] || SECTOR_DOCS["General Supply"]).map((docName) => {
                        const docData = profile.documents && profile.documents[docName] ? profile.documents[docName] : { number: "", url: "" };
                        const isUploaded = docData.url;
                        return (
                          <div key={docName} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, background: isUploaded ? (isDarkMode ? "#064e3b" : "#f0fdf4") : C.card }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ fontSize: 20 }}>{isUploaded ? "✅" : "📄"}</div><div style={{ fontSize: 13, fontWeight: 700, color: isUploaded ? (isDarkMode ? "#d1fae5" : "#166534") : C.text }}>{docName}</div></div>
                            <input type="text" placeholder={`Enter Number`} value={docData.number || ""} onChange={(e) => { const updatedDocs = { ...profile.documents }; if (!updatedDocs[docName]) updatedDocs[docName] = { number: "", url: "" }; updatedDocs[docName].number = e.target.value; setProfile({ ...profile, documents: updatedDocs }); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, marginBottom: 10, background: isDarkMode ? "#0f172a" : "#f8fafc", color: C.text }} />
                            {isUploaded ? (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: isDarkMode ? "#065f46" : "#dcfce7", padding: "8px 12px", borderRadius: 8 }}><span style={{ fontSize: 11, color: isDarkMode ? "#d1fae5" : "#10b981", fontWeight: 700 }}>Attached</span><a href={docData.url} target="_blank" style={{ fontSize: 11, color: C.accent, fontWeight: 700, textDecoration: "underline" }}>View</a></div>) : (<div><input type="file" id={`upload-${docName}`} style={{ display: "none" }} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingDoc(docName); const formData = new FormData(); formData.append("file", file); const res = await fetch("/api/upload", { method: "POST", body: formData }); const data = await res.json(); if (data.success) { const updatedDocs = { ...profile.documents }; if (!updatedDocs[docName]) updatedDocs[docName] = { number: "", url: "" }; updatedDocs[docName].url = data.url; const updatedProfile = { ...profile, documents: updatedDocs }; setProfile(updatedProfile); await fetch('/api/company-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedProfile) }); } setUploadingDoc(""); }} /><label htmlFor={`upload-${docName}`} style={{ background: isDarkMode ? "#334155" : "#f1f5f9", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.accent, display: "block", textAlign: "center", border: `1px dashed ${C.border}` }}>{uploadingDoc === docName ? "Uploading..." : "Upload File"}</label></div>)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- AI CHAT TAB (FULL SCREEN FLEXBOX) --- */}
          {active === "AI tender brain" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: isDarkMode ? "#0f172a" : "#fff", overflow: "hidden", width: "100%", maxWidth: 1200, margin: "0 auto" }}>
              
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: isDarkMode ? "#1e293b" : "#f8fafc", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, background: C.card, color: C.text, fontWeight: 600, outline: "none" }}>
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                   <button onClick={downloadChatPDF} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.text }}>📄 PDF</button>
                   <button onClick={() => { setChatHistory([{ role: "assistant", content: "Namaste! Main BidWell AI hoon." }]); }} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.text }}>🗑️ Clear</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16, background: isDarkMode ? "#0f172a" : "#fff" }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "#cbd5e1" : C.accent, display: "grid", placeItems: "center", flexShrink: 0, color: "#fff", fontSize: 16, fontWeight: 800 }}>
                      {msg.role === "user" ? "U" : "✳"}
                    </div>
                    <div style={{ background: msg.role === "user" ? (isDarkMode ? "#334155" : "#f1f5f9") : C.card, color: C.text, padding: "12px 16px", borderRadius: 16, borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role === "assistant" ? 4 : 16, maxWidth: "85%", fontSize: 14, lineHeight: 1.6, border: msg.role === "assistant" ? `1px solid ${C.border}` : "none", boxShadow: msg.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.05)" : "none" }}>
                      {msg.role === "user" ? (
                        msg.content
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          {chatLoading && i === chatHistory.length - 1 && (
                            <span style={{ display: "inline-block", width: 6, height: 14, background: C.accent, marginLeft: 4, animation: "blink 1s step-end infinite" }} />
                          )}
                          {!chatLoading && i !== 0 && (
                            <button onClick={() => speakText(msg.content)} style={{ background: "none", border: "none", cursor: "pointer", marginTop: 8, padding: 0, color: C.sub, display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                              🔊 Play
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} style={{ height: 1 }} />
              </div>

              <div style={{ padding: "12px 16px", background: C.card, borderTop: `1px solid ${C.border}`, flexShrink: 0, position: "relative" }}>
                
                {attachment && (
                  <div style={{ padding: "8px 12px", background: isDarkMode ? "#1e293b" : "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>📎</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{attachment.name}</span>
                    <button onClick={() => setAttachment(null)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 12, width: 20, height: 20, cursor: "pointer", marginLeft: "auto" }}>✕</button>
                  </div>
                )}

                {showAttachMenu && (
                  <div style={{ position: "absolute", bottom: 70, left: 16, right: 16, background: isDarkMode ? "#1e293b" : "#fff", borderRadius: 16, padding: 16, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", border: `1px solid ${C.border}`, zIndex: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <button onClick={() => cameraInputRef.current?.click()} style={{ background: isDarkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", color: C.text }}>
                        <span style={{ fontSize: 24 }}>📸</span> <span style={{ fontSize: 11, fontWeight: 700 }}>Camera</span>
                      </button>
                      <button onClick={() => photoInputRef.current?.click()} style={{ background: isDarkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", color: C.text }}>
                        <span style={{ fontSize: 24 }}>🖼️</span> <span style={{ fontSize: 11, fontWeight: 700 }}>Photo</span>
                      </button>
                      <button onClick={() => docInputRef.current?.click()} style={{ background: isDarkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", color: C.text }}>
                        <span style={{ fontSize: 24 }}>📄</span> <span style={{ fontSize: 11, fontWeight: 700 }}>Document</span>
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", background: isDarkMode ? "#0f172a" : "#f4f4f5", borderRadius: 24, padding: "6px 8px 6px 12px", border: `1px solid ${C.border}` }}>
                  <button onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ background: "none", border: "none", fontSize: 24, color: C.sub, cursor: "pointer", padding: "0 8px" }}>+</button>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage()} placeholder={language === "hi" ? "Kuch bhi puchein..." : "Type a message..."} style={{ flex: 1, border: "none", background: "transparent", outline: "none", color: C.text, fontSize: 14, padding: "8px 0" }} />
                  {chatInput.trim() || attachment ? (
                    <button onClick={() => handleSendMessage()} style={{ background: C.accent, color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg></button>
                  ) : (
                    <button onClick={startListening} style={{ background: isListening ? "#fef2f2" : "none", border: "none", fontSize: 20, color: isListening ? "#ef4444" : C.sub, cursor: "pointer", padding: "8px" }}>🎤</button>
                  )}
                </div>
              </div>

              <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: "none" }} />
              <input type="file" ref={photoInputRef} accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              <input type="file" ref={docInputRef} accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
