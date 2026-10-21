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

// Custom Professional Growth Chart Icon (No Emoji)
const GrowthChartIcon = ({ size = 20, color = "#315efb" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export default function BidWellDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10); 
  const [showForMe, setShowForMe] = useState(false); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push("/login"); });
    
    fetch('/api/tenders?page=0').then(res => res.json()).then(data => {
      if (data.success && data.tenders) {
        const today = new Date();
        const activeTenders = data.tenders.filter((t: any) => t.closing_date && new Date(t.closing_date) >= today)
                                           .sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0));
        setTenders(activeTenders);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const filteredTenders = useMemo(() => {
    return tenders.filter(t => {
      const matchSearch = `${t.title} ${t.org_name} ${t.state}`.toLowerCase().includes(query.toLowerCase());
      const matchProfile = showForMe ? (t.match_score >= 60) : true; 
      return matchSearch && matchProfile;
    });
  }, [tenders, query, showForMe]);

  const top3Tenders = tenders.slice(0, 3);
  const potentialRevenue = top3Tenders.reduce((sum, t) => {
    if (!t.value) return sum;
    const numericValue = parseFloat(t.value.replace(/[^0-9.-]+/g,""));
    return sum + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);
  const estimatedEMD = potentialRevenue * 0.02;

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
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7ebf3", background: "#fafbfe", borderRadius: 10, padding: "0 13px", height: 40, maxWidth: 400, width: "100%" }}><span style={{ fontSize: 22, color: "#8794a9", marginRight: 8 }}>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tenders..." style={{ border: 0, outline: 0, background: "transparent", flex: 1, fontSize: 12 }} /></div>
        </header>

        <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 25 }}>
            <div style={{ fontSize: 10, color: "#7b879d", fontWeight: 800 }}>BIDWELL WORKSPACE</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "9px 0 4px" }}>{active}</h1>
            <p style={{ fontSize: 12, color: "#7b879a", margin: 0 }}>{descriptions[active]}</p>
          </div>

          {/* LIVE TENDERS LIST */}
          {active === "Live tenders" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8, background: "#fff", padding: 4, borderRadius: 10, border: "1px solid #e8edf5" }}>
                  <button onClick={() => setShowForMe(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: !showForMe ? "#315efb" : "transparent", color: !showForMe ? "#fff" : "#64748b", transition: "0.2s" }}>All Tenders</button>
                  <button onClick={() => setShowForMe(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: showForMe ? "#315efb" : "transparent", color: showForMe ? "#fff" : "#64748b", display: "flex", alignItems: "center", gap: 4, transition: "0.2s" }}><span>✨</span> For Me</button>
                </div>
              </div>

              {loading ? <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Fetching live data...</div> : 
              <div>
                {filteredTenders.slice(0, visibleCount).map(t => (
                  <article key={t.id} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", marginBottom: 12, background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 10, color: "#8994a7", display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>{t.source || "LIVE"}</span>
                        <span>{t.source_tender_id || t.id}</span>
                      </div>
                      <span style={{ background: t.match_score >= 80 ? "#e3f7ef" : "#fff3db", color: t.match_score >= 80 ? "#168363" : "#a8751b", padding: "5px 8px", borderRadius: 7, fontSize: 10, fontWeight: 800 }}>{t.match_score || 0}% Match</span>
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 6px 0", fontSize: 14, fontWeight: 800, color: "#26354e" }}>{t.title}</h3>
                      <p style={{ margin: 0, fontSize: 11, color: "#8591a5" }}>{t.org_name || "Unknown Department"} · {t.state || "India"}</p>
                    </div>
                    <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#8994a6", background: "#f9fafc", padding: 12, borderRadius: 8, marginTop: 4 }}>
                      <span>◈ Value: <b style={{ color: "#17233b" }}>{t.value ? `₹${t.value}` : "Check Portal"}</b></span>
                      <span>◷ Deadline: <b style={{ color: "#ef4444" }}>{t.closing_date ? new Date(t.closing_date).toLocaleDateString('en-IN') : "Check Portal"}</b></span>
                    </div>
                  </article>
                ))}
              </div>}

              {!loading && visibleCount < filteredTenders.length && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button onClick={() => setVisibleCount(prev => prev + 10)} style={{ background: "#fff", color: "#315efb", border: "1px solid #315efb", padding: "12px 30px", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(49, 94, 251, 0.1)" }}>Load More Tenders ↓</button>
                </div>
              )}
            </div>
          )}

          {/* OVERVIEW */}
          {active === "Overview" && <>
            <section style={{ borderRadius: 17, background: "linear-gradient(110deg,#142544 0%,#172d52 62%,#244276 100%)", padding: "25px 20px", color: "white", display: "flex", alignItems: "center", marginBottom: 19 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b6c9f6", fontSize: 9, fontWeight: 800 }}><span style={{ fontSize: 18 }}>✳</span> BIDWELL INTELLIGENCE</div>
                <h2 style={{ fontSize: 28, lineHeight: 1.15, margin: "12px 0 9px" }}>Better tenders.<br /><span style={{ color: "#8eafff" }}>Stronger bids.</span></h2>
                <p style={{ fontSize: 11, color: "#bdc9df", maxWidth: 355, margin: "0 0 15px" }}>Your AI-powered workspace to discover opportunities, prepare bids and stay on top of every contract.</p>
                <button onClick={() => setActive("Live tenders")} style={{ background: "#fff", color: "#1b2c4a", padding: "10px 14px", borderRadius: 9, border: 0, fontWeight: 700, cursor: "pointer" }}>Explore tenders ↗</button>
              </div>
            </section>

            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 19 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Top 3 Matched Tenders</div>
                  <div style={{ fontSize: 11, color: "#8792a5" }}>Highest probability of winning</div>
                </div>
                <button onClick={() => setActive("Live tenders")} style={{ background: "transparent", border: 0, color: "#315efb", fontSize: 11, fontWeight: 700 }}>View all ↗</button>
              </div>
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 500 }}>
                  <thead><tr style={{ borderBottom: "1px solid #edf0f6" }}><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>OPPORTUNITY</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>VALUE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>DEADLINE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>MATCH</th></tr></thead>
                  <tbody>
                    {tenders.slice(0, 3).map(t => <tr key={t.id} onClick={() => router.push(`/tenders/${t.source_tender_id || t.id}`)} style={{ borderBottom: "1px solid #f0f2f7", cursor: "pointer" }}>
                      <td style={{ padding: "13px 10px" }}><div style={{ fontWeight: 700, fontSize: 11, color: "#26344d" }}>{t.title}</div><small style={{ fontSize: 9, color: "#8792a5" }}>{t.org_name} · {t.state}</small></td>
                      <td style={{ padding: "13px 10px", fontSize: 11, fontWeight: 800 }}>{t.value || "N/A"}</td>
                      <td style={{ padding: "13px 10px", fontSize: 11, color: "#637087" }}>{new Date(t.closing_date).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: "13px 10px" }}><span style={{ background: t.match_score >= 80 ? "#e3f7ef" : "#fff3db", color: t.match_score >= 80 ? "#168363" : "#a8751b", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match_score}%</span></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 🚀 FUTURE & GROWTH (Clean Icons, No Emojis) */}
            <div style={{ marginTop: 30, marginBottom: 15 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#17233b", display: "flex", alignItems: "center", gap: 10 }}>
                <GrowthChartIcon size={24} color="#10b981" /> Future & Growth
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Your AI Business Partner to scale beyond just tenders.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              
              {/* Future for BidWell (Replaced Readiness Score) */}
              <div style={{ ...cardStyle, background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", border: "1px solid #a5b4fc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#3730a3", display: "flex", alignItems: "center", gap: 8 }}>
                    <GrowthChartIcon size={18} color="#3730a3" /> Future for BidWell
                  </div>
                  <div style={{ background: "#4f46e5", color: "#fff", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 800 }}>Roadmap</div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#312e81", lineHeight: 2, fontWeight: 600 }}>
                  <li>AI-Powered Legal Documentation</li>
                  <li>Zero-Paperwork Bidding System</li>
                  <li>Real-time Payment Tracking</li>
                  <li>Expand to 10+ States</li>
                </ul>
              </div>

              {/* JV for BidWell (Replaced AI Advisor) */}
              <div style={{ ...cardStyle, background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff" }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  JV for BidWell
                </div>
                <p style={{ fontSize: 12, color: "#c7d2fe", lineHeight: 1.6, marginBottom: 16 }}>Looking to bid for larger projects? Find trusted Joint Venture partners to strengthen your bid.</p>
                <button onClick={() => alert("JV Search feature coming soon!")} style={{ width: "100%", background: "#fff", color: "#1e1b4b", padding: "10px", borderRadius: 8, border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>Find JV Partners ↗</button>
              </div>

              {/* Revenue Planner */}
              <div style={cardStyle}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#17233b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <GrowthChartIcon size={18} color="#17233b" /> Revenue Planner <span style={{ fontSize: 9, color: "#ef4444", background: "#fef2f2", padding: "2px 6px", borderRadius: 4 }}>Live Est.</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: "#f8fafc", padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "#64748b" }}>Top 3 Potential</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#17233b" }}>₹{potentialRevenue.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ flex: 1, background: "#f8fafc", padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "#64748b" }}>Est. EMD Req.</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#ef4444" }}>₹{estimatedEMD.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, fontStyle: "italic" }}>*Calculated from your top 3 matched live tenders.</p>
              </div>

              {/* Partner Finder */}
              <div style={cardStyle}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#17233b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#17233b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                   Top Verified Partner
                </div>
                <p style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>A registered vendor matching your sector for potential JV.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f1f5f9", padding: 10, borderRadius: 8 }}>
                  <div style={{ width: 32, height: 32, background: "#e2e8f0", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 16 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{tenders[0]?.org_name ? tenders[0].org_name.split(' ')[0] + " Infra" : "Shakti Infra Ltd."}</div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>Matches your sector</div>
                  </div>
                </div>
              </div>

              {/* Trust & Source */}
              <div style={{ ...cardStyle, background: "#f8fafc", borderStyle: "dashed" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#475569", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Trust & Transparency
                </div>
                <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, margin: 0 }}>All live tenders are verified from official portals. Readiness scores and revenue planners are <b>AI estimates</b>. Always verify with official sources.</p>
              </div>

            </div>
          </>}

          {active === "AI tender brain" && <div style={cardStyle}><h2 style={{ fontSize: 20 }}>AI Chat</h2><p style={{ color: "#64748b" }}>Ready to answer.</p></div>}

        </div>
      </main>
    </div>
  );
}
