"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });

    // Fetch Tenders
    fetch("/api/tenders?page=0")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tenders) {
          const today = new Date();
          const activeTenders = data.tenders.filter(
            (t: any) => t.closing_date && new Date(t.closing_date) >= today
          );
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

  const filteredTenders = tenders.filter((t) =>
    `${t.title} ${t.org_name} ${t.state}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      
      {/* Mobile Overlay */}
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
            <div style={{ fontSize: 10, color: "#7b879d", fontWeight: 800 }}>BIDWELL WORKSPACE</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "9px 0 4px", color: "#17233b" }}>{active}</h1>
            <p style={{ fontSize: 12, color: "#7b879a", margin: 0 }}>Your business command centre</p>
          </div>

          {/* TENDERS LIST (Simplified & Safe) */}
          {(active === "Overview" || active === "Live tenders") && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#17233b", marginBottom: 16 }}>
                {active === "Overview" ? "Top Matched Tenders" : "All Live Tenders"}
              </h2>
              {loading ? (
                <div style={{ padding: 20, color: "#64748b" }}>Fetching live tenders...</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {filteredTenders.slice(0, active === "Overview" ? 3 : 20).map((t) => (
                    <div key={t.id} style={{ background: "#fff", padding: 20, borderRadius: 14, border: "1px solid #e8edf5" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 10, background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#64748b" }}>{t.source || "LIVE"}</span>
                        <span style={{ fontSize: 10, background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>{t.match_score || 50}% Match</span>
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: "#26354e", margin: "0 0 6px" }}>{t.title}</h3>
                      <p style={{ fontSize: 11, color: "#8591a5", margin: "0 0 12px" }}>{t.org_name || "Department"} · {t.state || "India"}</p>
                      <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#8994a6", background: "#f9fafc", padding: 10, borderRadius: 8 }}>
                        <span>◈ Value: <b style={{ color: "#17233b" }}>{t.value ? `₹${t.value}` : "N/A"}</b></span>
                        <span>◷ Deadline: <b style={{ color: "#ef4444" }}>{new Date(t.closing_date).toLocaleDateString("en-IN")}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other Tabs (Placeholder) */}
          {!["Overview", "Live tenders"].includes(active) && (
            <div style={{ background: "#fff", padding: 40, borderRadius: 14, textAlign: "center", color: "#94a3b8" }}>
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
