"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const nav = [
  { group: "WORKSPACE", items: [["Overview", "⌂"], ["Live tenders", "⌕"], ["AI tender brain", "✳"], ["Bid workspace", "▤"]] },
  { group: "DELIVERY", items: [["Contracts", "▣"], ["Payments & invoices", "₹"], ["Documents", "▧"], ["Workforce", "♙"]] },
  { group: "MANAGE", items: [["Team", "♧"], ["Notifications", "♢"], ["Company profile", "◉"], ["Subscription", "★"], ["Settings", "⚙"]] },
];

const descriptions: Record<string, string> = {
  "Overview": "Your business command centre", "Live tenders": "Discover opportunities", "AI tender brain": "Your 24/7 AI Consultant", "Bid workspace": "Move every bid from preparation to submission", "Contracts": "Keep delivery under control", "Payments & invoices": "Track invoices and payment status", "Documents": "Keep your bid-ready documents organised", "Workforce": "Manage people and deployment", "Team": "Bring your team together", "Notifications": "Important changes and reminders", "Company profile": "Your business profile and vault", "Subscription": "Manage your plan", "Settings": "Preferences and security",
};

function Icon({ children }: { children: React.ReactNode }) { return <span style={{ width: 17, textAlign: "center", fontSize: 17, flex: "none", opacity: 0.8 }}>{children}</span>; }

export default function BidWellDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

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

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push("/login"); });
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

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
      // NOTE: Abhi hum AI ko file ka naam bhej rahe hain. 
      // Backend me hum isko VPS (Ollama) ke vision/PDF model se connect karenge.
      const res = await fetch("/api/ai-chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ prompt: displayMsg, language }) 
      });
      const data = await res.json();
      if(data.success) setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      else setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, AI Brain is currently unreachable. (VPS offline)" }]);
    } catch (e) { setChatHistory(prev => [...prev, { role: "assistant", content: "Error connecting to AI Brain." }]); }
    setChatLoading(false);
  };

  const cardStyle = { background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", fontFamily: "system-ui, sans-serif", overflowX: "hidden" }}>
      {mobileMenu && (<div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />)}
      
      {/* Sidebar */}
      <aside style={{ width: 260, background: "linear-gradient(180deg,#101b32 0%,#142442 100%)", color: "#d5deee", padding: "24px 15px", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50, transform: mobileMenu ? "translateX(0)" : "translateX(-100%)", transition: "0.3s", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 12px 25px", color: "#fff", fontSize: 22, fontWeight: 800 }}><div style={{ height: 38, width: 38, borderRadius: 12, background: "#315efb", display: "grid", placeItems: "center" }}>B</div> BidWell</div>
        <div style={{ flex: 1 }}>
          {nav.map(section => <div key={section.group} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#7788a6", padding: "0 12px 10px" }}>{section.group}</div>
            {section.items.map(([label, icon]) => <button key={label} onClick={() => { setActive(label); setMobileMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: 0, borderRadius: 9, background: active === label ? "#315efb" : "transparent", color: active === label ? "#fff" : "#aab8cf", margin: "2px 0", fontSize: 12, cursor: "pointer" }}><Icon>{icon}</Icon><span>{label}</span></button>)}
          </div>)}
        </div>
        <button onClick={handleLogout} style={{ width: "100%", padding: "11px 12px", border: 0, borderRadius: 9, background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", textAlign: "left", fontSize: 12, cursor: "pointer" }}>↪ Log Out</button>
      </aside>

      <main style={{ width: "100%" }}>
        <header style={{ height: 75, background: "#fff", borderBottom: "1px solid #e8edf5", display: "flex", alignItems: "center", padding: "0 20px", gap: 15 }}>
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7ebf3", background: "#fafbfe", borderRadius: 10, padding: "0 13px", height: 40, maxWidth: 400, width: "100%" }}><span style={{ fontSize: 22, color: "#8794a9", marginRight: 8 }}>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." style={{ border: 0, outline: 0, background: "transparent", flex: 1, fontSize: 12 }} /></div>
        </header>

        <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 25 }}>
            <div style={{ fontSize: 10, color: "#7b879d", fontWeight: 800 }}>BIDWELL WORKSPACE</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "9px 0 4px" }}>{active}</h1>
            <p style={{ fontSize: 12, color: "#7b879a", margin: 0 }}>{descriptions[active]}</p>
          </div>

          {/* AI CHAT INTERFACE */}
          {active === "AI tender brain" && (
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", overflow: "hidden", position: "relative" }}>
              
              {/* Header */}
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

              {/* Chat Messages */}
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

              {/* Attachment Menu Modal */}
              {showAttachMenu && (
                <div style={{ position: "absolute", bottom: 80, left: 20, background: "#fff", border: "1px solid #e8edf5", borderRadius: 12, padding: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 10 }}>
                  <button onClick={() => pdfInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "none", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>📄 Upload PDF Document</button>
                  <button onClick={() => cameraInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "none", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>📸 Take Photo (Camera)</button>
                </div>
              )}

              {/* Attachment Preview */}
              {attachment && (
                <div style={{ padding: "10px 20px", background: "#f8fafc", borderTop: "1px solid #e8edf5", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📎</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 12, width: 24, height: 24, cursor: "pointer", display: "grid", placeItems: "center", fontSize: 12 }}>✕</button>
                </div>
              )}

              {/* Input Area */}
              <div style={{ padding: 16, borderTop: "1px solid #e8edf5", display: "flex", gap: 10, background: "#fff", alignItems: "center" }}>
                <button onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ background: "#f1f5f9", border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", fontSize: 20, display: "grid", placeItems: "center", color: "#64748b" }}>+</button>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage()} placeholder="Ask anything or upload document..." style={{ flex: 1, padding: "14px 20px", borderRadius: 24, border: "1px solid #e8edf5", outline: "none", fontSize: 14, background: "#f8fafc" }} />
                <button onClick={() => handleSendMessage()} style={{ background: "#315efb", color: "#fff", border: "none", padding: "0 24px", borderRadius: 24, fontWeight: 800, cursor: "pointer", height: 44 }}>Send</button>
              </div>

              {/* Hidden Inputs for File/Camera */}
              <input type="file" ref={pdfInputRef} accept="application/pdf" onChange={handleFileSelect} style={{ display: "none" }} />
              <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />
            </div>
          )}

          {/* OTHER TABS (Overview, Tenders, etc.) */}
          {active === "Overview" && <div style={cardStyle}><h2 style={{ fontSize: 20 }}>Welcome to BidWell Workspace</h2><p style={{ color: "#64748b" }}>Your Business Command Centre is ready.</p></div>}
          {active === "Live tenders" && <div style={cardStyle}><h2>Live Tenders</h2><p>Loading live data...</p></div>}
          
        </div>
      </main>
    </div>
  );
}
