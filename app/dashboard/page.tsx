"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

type Tender = {
  id: string; title: string; department: string; location: string;
  value: string; deadline: string; match: number; category: string; status: string;
};

const nav = [
  { group: "WORKSPACE", items: [["Overview", "⌂"], ["Live tenders", "⌕"], ["AI tender brain", "✳"], ["Bid workspace", "▤"]] },
  { group: "DELIVERY", items: [["Contracts", "▣"], ["Payments & invoices", "₹"], ["Documents", "▧"], ["Workforce", "♙"]] },
  { group: "MANAGE", items: [["Team", "♧"], ["Notifications", "♢"], ["Company profile", "◉"], ["Settings", "⚙"]] },
];

const descriptions: Record<string, string> = {
  "Overview": "Your business command centre",
  "Live tenders": "Discover opportunities matched to your company",
  "AI tender brain": "Turn tender documents into clear next steps",
  "Bid workspace": "Move every bid from preparation to submission",
};

function Icon({ children }: { children: React.ReactNode }) {
  return <span style={{ width: 17, textAlign: "center", fontSize: 17, flex: "none" }} aria-hidden="true">{children}</span>;
}

export default function BidWellDashboard() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Tender | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tenders?page=0')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tenders) {
          const mapped = data.tenders.map((t: any) => ({
            id: t.source_tender_id || t.id,
            title: t.title || "Untitled Tender",
            department: t.org_name || "Unknown Department",
            location: t.state || "India",
            value: t.value ? `₹${t.value}` : "Check Portal",
            deadline: t.closing_date || "Check Portal",
            match: t.match_score || 50,
            category: "General",
            status: "Open"
          }));
          setTenders(mapped);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => tenders.filter(t =>
    `${t.title} ${t.department} ${t.location} ${t.id}`.toLowerCase().includes(query.toLowerCase())
  ), [query, tenders]);

  const isTenderPage = active === "Live tenders";
  const heading = selected ? "Tender overview" : active;
  const subheading = selected ? selected.title : descriptions[active] || "";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", display: "flex", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Sidebar */}
      <aside style={{ width: 248, background: "linear-gradient(180deg,#101b32 0%,#142442 100%)", color: "#d5deee", padding: "24px 15px", display: mobileMenu ? "block" : "none", position: "fixed", height: "100%", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 12px 25px", color: "#fff", fontSize: 22, fontWeight: 800 }}>
          <div style={{ height: 38, width: 38, borderRadius: 12, background: "#315efb", display: "grid", placeItems: "center" }}>B</div>
          BidWell
        </div>
        {nav.map(section => <div key={section.group} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.6, color: "#7788a6", padding: "0 12px 10px" }}>{section.group}</div>
          {section.items.map(([label, icon]) => <button key={label} onClick={() => { setActive(label); setSelected(null); setMobileMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: 0, borderRadius: 9, background: active === label ? "#315efb" : "transparent", color: active === label ? "#fff" : "#aab8cf", textAlign: "left", margin: "2px 0", fontSize: 12, cursor: "pointer" }}>
            <Icon>{icon}</Icon><span>{label}</span>
          </button>)}
        </div>)}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: mobileMenu ? 248 : 0, transition: "0.3s" }}>
        
        {/* Topbar */}
        <header style={{ height: 75, background: "#fff", borderBottom: "1px solid #e8edf5", display: "flex", alignItems: "center", padding: "0 35px", gap: 22 }}>
          {/* Mobile Menu Button - Fixed */}
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>☰</button>
          
          <div style={{ display: "flex", alignItems: "center", gap: 11, border: "1px solid #e7ebf3", background: "#fafbfe", borderRadius: 10, padding: "0 13px", height: 40, maxWidth: 610, width: "100%" }}>
            <span style={{ fontSize: 22, color: "#8794a9" }}>⌕</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tenders..." style={{ border: 0, outline: 0, background: "transparent", flex: 1, fontSize: 12 }} />
          </div>
        </header>

        <div style={{ padding: "30px 35px" }}>
          
          <div style={{ marginBottom: 25 }}>
            <div style={{ fontSize: 12, color: "#7b879d", fontWeight: 800, letterSpacing: 1 }}>YOUR BUSINESS, IN CONTROL</div>
            <h1 style={{ fontSize: 27, fontWeight: 800, margin: "9px 0 4px" }}>{heading}</h1>
            <p style={{ fontSize: 12, color: "#7b879a", margin: 0 }}>{subheading}</p>
          </div>

          {/* OVERVIEW TAB */}
          {active === "Overview" && !selected && <>
            <section style={{ borderRadius: 17, background: "linear-gradient(110deg,#142544 0%,#172d52 62%,#244276 100%)", minHeight: 222, padding: "29px 32px", color: "white", display: "flex", alignItems: "center", marginBottom: 19 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b6c9f6", fontSize: 9, fontWeight: 800 }}><span style={{ fontSize: 18 }}>✳</span> BIDWELL INTELLIGENCE</div>
                <h2 style={{ fontSize: 31, lineHeight: 1.15, margin: "12px 0 9px" }}>Better tenders.<br /><span style={{ color: "#8eafff" }}>Stronger bids.</span></h2>
                <p style={{ fontSize: 11, color: "#bdc9df", maxWidth: 355, margin: "0 0 12px" }}>Your AI-powered workspace to discover opportunities, prepare bids and stay on top of every contract.</p>
                <button onClick={() => setActive("Live tenders")} style={{ background: "#fff", color: "#1b2c4a", padding: "10px 14px", borderRadius: 9, border: 0, fontWeight: 700, cursor: "pointer" }}>Explore tenders ↗</button>
              </div>
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 19 }}>
              <div style={{ background: "#fff", padding: 17, borderRadius: 13, border: "1px solid #e8edf5" }}>
                <div style={{ fontSize: 18, marginBottom: 12 }}>⌕</div>
                <div style={{ fontSize: 10, color: "#7b879b" }}>Live Opportunities</div>
                <div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0" }}>{loading ? "..." : tenders.length}</div>
                <div style={{ fontSize: 9, color: "#748198" }}><span style={{ color: "#1ba47d", fontWeight: 800 }}>↗</span> From VPS Brain</div>
              </div>
              <div style={{ background: "#fff", padding: 17, borderRadius: 13, border: "1px solid #e8edf5" }}>
                <div style={{ fontSize: 18, marginBottom: 12 }}>▤</div>
                <div style={{ fontSize: 10, color: "#7b879b" }}>Active Bids</div>
                <div style={{ fontSize: 25, fontWeight: 800, margin: "5px 0" }}>06</div>
                <div style={{ fontSize: 9, color: "#748198" }}><span style={{ color: "#1ba47d", fontWeight: 800 }}>↗</span> 2 due this week</div>
              </div>
            </section>

            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 19 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Recommended opportunities</div>
                  <div style={{ fontSize: 10, color: "#8792a5" }}>Live from Supabase</div>
                </div>
                <button onClick={() => setActive("Live tenders")} style={{ background: "transparent", border: 0, color: "#315efb", fontSize: 10, fontWeight: 700 }}>View all ↗</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead><tr style={{ borderBottom: "1px solid #edf0f6" }}><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>OPPORTUNITY</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>VALUE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>DEADLINE</th><th style={{ fontSize: 9, padding: 10, color: "#8a95a8" }}>MATCH</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan={4} style={{ padding: 20, fontSize: 12 }}>Fetching real tenders...</td></tr> : 
                    tenders.slice(0, 4).map(t => <tr key={t.id} onClick={() => setSelected(t)} style={{ borderBottom: "1px solid #f0f2f7", cursor: "pointer" }}>
                      <td style={{ padding: 13 }}><div style={{ fontWeight: 700, fontSize: 11, color: "#26344d" }}>{t.title}</div><small style={{ fontSize: 9, color: "#8792a5" }}>{t.department} · {t.location}</small></td>
                      <td style={{ padding: 13, fontSize: 11, fontWeight: 800 }}>{t.value}</td>
                      <td style={{ padding: 13, fontSize: 11, color: "#637087" }}>{t.deadline}</td>
                      <td style={{ padding: 13 }}><span style={{ background: t.match >= 80 ? "#e3f7ef" : "#fff3db", color: t.match >= 80 ? "#168363" : "#a8751b", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match}%</span></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* LIVE TENDERS TAB */}
          {isTenderPage && !selected && <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", overflow: "hidden" }}>
            <div style={{ padding: "14px 22px", borderBottom: "1px solid #f0f2f7", fontSize: 10, color: "#7c889c" }}>Showing Live Opportunities <span style={{ background: "#f1f4fa", padding: "4px 6px", borderRadius: 5, color: "#55647d", marginLeft: 8 }}>{filtered.length} results</span></div>
            {loading ? <div style={{ padding: 20 }}>Fetching...</div> : 
            <div>
              {filtered.map(t => <article key={t.id} style={{ display: "flex", gap: 15, padding: "19px 22px", borderBottom: "1px solid #edf0f6" }}>
                <div style={{ height: 42, width: 42, background: "#edf2ff", color: "#315efb", borderRadius: 11, display: "grid", placeItems: "center", fontSize: 20 }}>▤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: "#8994a7", display: "flex", gap: 9, marginBottom: 9 }}><span>{t.id}</span><span style={{ color: "#178668", background: "#e7f7f0", padding: "4px 7px", borderRadius: 5, fontWeight: 700 }}>● {t.status}</span></div>
                  <button onClick={() => setSelected(t)} style={{ background: "none", border: 0, padding: 0, textAlign: "left", fontSize: 13, fontWeight: 800, color: "#26354e", marginBottom: 6, cursor: "pointer" }}>{t.title}</button>
                  <p style={{ margin: 0, fontSize: 10, color: "#8591a5" }}>{t.department} · {t.location}</p>
                  <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 9, color: "#8994a6" }}><span>◈ <b>{t.value}</b> value</span><span>◷ Deadline <b>{t.deadline}</b></span></div>
                </div>
                <div><span style={{ background: t.match >= 80 ? "#e3f7ef" : "#fff3db", color: t.match >= 80 ? "#168363" : "#a8751b", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match}%</span></div>
              </article>)}
            </div>}
          </section>}

          {/* TENDER DETAIL VIEW */}
          {selected && <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 25 }}>
            <button onClick={() => setSelected(null)} style={{ border: 0, background: "transparent", color: "#315efb", fontSize: 11, fontWeight: 700, marginBottom: 22, cursor: "pointer" }}>← Back to opportunities</button>
            <h2 style={{ fontSize: 23, margin: "11px 0 6px" }}>{selected.title}</h2>
            <p style={{ fontSize: 11, color: "#8290a5" }}>{selected.department} · {selected.location}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "25px 0", padding: 17, background: "#f7f9fd", borderRadius: 12 }}>
              <div><small style={{ display: "block", color: "#8792a5", fontSize: 9, marginBottom: 8 }}>Value</small><b style={{ fontSize: 13 }}>{selected.value}</b></div>
              <div><small style={{ display: "block", color: "#8792a5", fontSize: 9, marginBottom: 8 }}>Deadline</small><b style={{ fontSize: 13 }}>{selected.deadline}</b></div>
            </div>
            <div style={{ display: "flex", gap: 9 }}>
              <Link href={`/tenders/${selected.id}`} style={{ background: "#315efb", color: "#fff", padding: "10px 14px", borderRadius: 9, textDecoration: "none", fontSize: 11, fontWeight: 700 }}>Open Full Analysis ↗</Link>
            </div>
          </section>}

        </div>
      </main>
    </div>
  );
}
