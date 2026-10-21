"use client";

import { useMemo, useState, useEffect } from "react";
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
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push("/login"); });
    
    // Dukan (Supabase) se sirf LIVE aur MATCHED tenders lana
    fetch('/api/tenders?page=0').then(res => res.json()).then(data => {
      if (data.success && data.tenders) {
        const today = new Date();
        // Filter: Only active + Sort: Highest Match first
        const activeTenders = data.tenders.filter((t: any) => {
           const isLive = t.closing_date && new Date(t.closing_date) >= today;
           return isLive;
        }).sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0));
        
        setTenders(activeTenders);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

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

          {/* OVERVIEW - Only Top 3 Matched Tenders */}
          {active === "Overview" && <>
            <section style={{ borderRadius: 17, background: "linear-gradient(110deg,#142544 0%,#172d52 62%,#244276 100%)", padding: "25px 20px", color: "white", display: "flex", alignItems: "center", marginBottom: 19 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b6c9f6", fontSize: 9, fontWeight: 800 }}><span style={{ fontSize: 18 }}>✳</span> BIDWELL INTELLIGENCE</div>
                <h2 style={{ fontSize: 28, lineHeight: 1.15, margin: "12px 0 9px" }}>Better tenders.<br /><span style={{ color: "#8eafff" }}>Stronger bids.</span></h2>
                <p style={{ fontSize: 11, color: "#bdc9df", maxWidth: 355, margin: "0 0 15px" }}>Your AI-powered workspace to discover opportunities, prepare bids and stay on top of every contract.</p>
              </div>
            </section>

            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 19 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Top 3 Matched Tenders</div>
                  <div style={{ fontSize: 11, color: "#8792a5" }}>High probability of winning</div>
                </div>
                <button onClick={() => setActive("Live tenders")} style={{ background: "transparent", border: 0, color: "#315efb", fontSize: 11, fontWeight: 700 }}>View all ↗</button>
              </div>
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 500 }}>
                  <thead><tr style={{ borderBottom: "1px solid #edf0f6" }}><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>OPPORTUNITY</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>VALUE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>DEADLINE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>MATCH</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan={4} style={{ padding: 20, fontSize: 12 }}>Fetching live tenders...</td></tr> : 
                    tenders.slice(0, 3).map(t => <tr key={t.id} onClick={() => router.push(`/tenders/${t.source_tender_id}`)} style={{ borderBottom: "1px solid #f0f2f7", cursor: "pointer" }}>
                      <td style={{ padding: "13px 10px" }}><div style={{ fontWeight: 700, fontSize: 11, color: "#26344d" }}>{t.title}</div><small style={{ fontSize: 9, color: "#8792a5" }}>{t.org_name} · {t.state}</small></td>
                      <td style={{ padding: "13px 10px", fontSize: 11, fontWeight: 800 }}>{t.value || "N/A"}</td>
                      <td style={{ padding: "13px 10px", fontSize: 11, color: "#637087" }}>{new Date(t.closing_date).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: "13px 10px" }}><span style={{ background: t.match_score >= 80 ? "#e3f7ef" : "#fff3db", color: t.match_score >= 80 ? "#168363" : "#a8751b", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match_score}%</span></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* AI CHAT (Baki tabs same rahenge) */}
          {active === "AI tender brain" && <div style={cardStyle}><h2 style={{ fontSize: 20 }}>AI Chat Connected to Factory</h2><p style={{ color: "#64748b" }}>Model llama3 is now running on VPS.</p></div>}
          {active === "Live tenders" && <div style={cardStyle}><h2>All Active Tenders ({tenders.length})</h2><p>Sorted by match score.</p></div>}

        </div>
      </main>
    </div>
  );
}
