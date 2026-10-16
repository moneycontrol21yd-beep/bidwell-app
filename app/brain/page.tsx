"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

function BrainHero() {
  return (
    <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: -25, background: "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(59,130,246,0.35) 45%, transparent 70%)", filter: "blur(20px)" }} />
      <svg viewBox="0 0 200 200" width="150" height="150" style={{ position: "relative" }}>
        <defs>
          <radialGradient id="bg2" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="35%" stopColor="#C084FC" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        <path d="M100 35 C 65 35, 45 58, 48 85 C 42 92, 40 105, 48 115 C 44 130, 52 148, 68 155 C 78 168, 90 170, 100 170 C 110 170, 122 168, 132 155 C 148 148, 156 130, 152 115 C 160 105, 158 92, 152 85 C 155 58, 135 35, 100 35 Z" fill="url(#bg2)" />
        <g stroke="#DDD6FE" strokeWidth="0.9" fill="none" opacity="0.75">
          <path d="M100 45 L100 165" />
          <path d="M75 55 Q85 75 78 95 Q72 115 82 140" />
          <path d="M125 55 Q115 75 122 95 Q128 115 118 140" />
          <path d="M60 78 Q75 88 75 105 Q75 120 68 135" />
          <path d="M140 78 Q125 88 125 105 Q125 120 132 135" />
        </g>
        <rect x="82" y="82" width="36" height="36" rx="10" fill="#0A0E27" stroke="#A78BFA" strokeWidth="2.5" />
        <text x="100" y="108" textAnchor="middle" fill="#C4B5FD" fontSize="22" fontWeight="900">B</text>
      </svg>
    </div>
  );
}

export default function BrainPage() {
  const [userName, setUserName] = useState("BR");
  const [topComps, setTopComps] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [stats, setStats] = useState({ awards: 0, competitors: 0, departments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const user = JSON.parse(u);
        const n = user.name || user.full_name || "User";
        setUserName(n.split(" ").map((x: string) => x[0]).join("").slice(0, 2).toUpperCase());
      }
    } catch {}

    Promise.all([
      fetch("/api/tender-intel?title=security").then((r) => r.json()).catch(() => ({})),
      fetch("/api/tender-intel?title=housekeeping").then((r) => r.json()).catch(() => ({})),
    ]).then(([s1, s2]) => {
      setTopComps(s1.topCompetitors || []);
      setDepts(s2.topCompetitors || []);
    }).finally(() => setLoading(false));
  }, []);

  const actions = [
    { bg: "linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)", icon: "📊", t: "Tender Analysis", d: "AI based insights on tenders, market & competition.", cta: "View Analysis", href: "/tenders" },
    { bg: "linear-gradient(135deg,#059669 0%,#10B981 100%)", icon: "🛡️", t: "Eligibility Check", d: "Know if you're eligible in seconds.", cta: "Check Eligibility", href: "/eligibility" },
    { bg: "linear-gradient(135deg,#D97706 0%,#F59E0B 100%)", icon: "⚡", t: "Fast Record", d: "Quick view of high priority, urgent & closing soon tenders.", cta: "View Fast Record", href: "/tenders" },
    { bg: "linear-gradient(135deg,#DB2777 0%,#EC4899 100%)", icon: "📅", t: "Future Record", d: "Upcoming tenders & project forecasts (Central/State/UT).", cta: "Explore Future Tenders", href: "/radar" },
    { bg: "linear-gradient(135deg,#2563EB 0%,#3B82F6 100%)", icon: "🤖", t: "AI Suggestions", d: "Personalized tender recommendations for your business.", cta: "Get Recommendations", href: "/assistant" },
    { bg: "linear-gradient(135deg,#0D9488 0%,#14B8A6 100%)", icon: "🇮🇳", t: "India Wide Coverage", d: "Central + State + UT. All in one place.", cta: "Explore All", href: "/tenders" },
  ];

  const insights = [
    { bg: "linear-gradient(135deg,#059669,#10B981)", icon: "📈", t: "High Demand Sectors", items: ["Roads & Highways", "Construction", "Health & Medical", "IT & Software"] },
    { bg: "linear-gradient(135deg,#7C3AED,#8B5CF6)", icon: "📊", t: "Best Winning Chances", items: ["Low Competition", "High Value"], badge: "✨ Your Advantage" },
    { bg: "linear-gradient(135deg,#2563EB,#3B82F6)", icon: "⏰", t: "Closing Soon", big: "248", bigL: "Tenders", items: ["Next 7 Days"] },
    { bg: "linear-gradient(135deg,#D97706,#F59E0B)", icon: "📅", t: "Upcoming Projects", big: "1,320", bigL: "Projects", items: ["Next 3 Months"] },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)`, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#3B82F6,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#fff", boxShadow: "0 4px 14px rgba(99,102,241,0.45)" }}>B</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, lineHeight: 1 }}>BidWell</div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 3 }}>Smarter Tenders. Bigger Opportunities.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 21 }}>🔔</span>
            <div style={{ position: "absolute", top: -2, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.bg}` }}>5</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", border: "2px solid rgba(139,92,246,0.55)" }}>
            {userName}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: "24px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: "linear-gradient(90deg,rgba(59,130,246,0.18),rgba(139,92,246,0.18))", border: "1px solid rgba(139,92,246,0.45)", marginBottom: 14 }}>
              <span style={{ fontSize: 11 }}>✨</span>
              <span style={{ fontSize: 9.5, fontWeight: 900, color: "#C4B5FD", letterSpacing: 1.2 }}>AI POWERED</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.05, letterSpacing: -0.8 }}>
              BidWell <span style={{ background: "linear-gradient(135deg,#60A5FA 0%,#C084FC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Brain</span>
            </h1>
            <p style={{ fontSize: 13, color: C.sub, margin: "10px 0 0", fontWeight: 600, lineHeight: 1.35 }}>
              Your AI Co-Pilot for<br />Government Tenders
            </p>
            <p style={{ fontSize: 11.5, color: "#818CF8", margin: "8px 0 0", fontWeight: 700 }}>
              Analyze. Shortlist. Plan. Win.
            </p>
          </div>
          <BrainHero />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 18 }}>
          {[
            { i: "📊", t: "Analysis" },
            { i: "🛡️", t: "Eligibility" },
            { i: "⚡", t: "Fast Track" },
            { i: "📅", t: "Future Tenders" },
          ].map((p) => (
            <div key={p.t} style={{ padding: "6px 12px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.35)", fontSize: 10.5, fontWeight: 700, color: "#A5B4FC", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11 }}>{p.i}</span> {p.t}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, justifyContent: "center" }}>
          {["THINK", "ANALYZE", "BID", "SUCCEED"].map((w, i) => (
            <span key={w} style={{ fontSize: 9, fontWeight: 900, color: C.muted, letterSpacing: 1.8, display: "flex", alignItems: "center" }}>
              {w}{i < 3 && <span style={{ margin: "0 8px", opacity: 0.5 }}>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS - 2 col */}
      <div style={{ padding: "0 18px 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {actions.map((f) => (
            <Link key={f.t} href={f.href} style={{
              ...LINK, display: "flex", flexDirection: "column",
              borderRadius: 18, padding: 14, background: f.bg,
              minHeight: 170, position: "relative", overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}>
              <div style={{ position: "absolute", top: -25, right: -25, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.13)", filter: "blur(18px)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{f.icon}</div>
                <span style={{ color: "#fff", fontSize: 14, opacity: 0.85 }}>→</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 900, color: "#fff", marginTop: 12, lineHeight: 1.2, position: "relative", letterSpacing: -0.2 }}>{f.t}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.9)", marginTop: 6, lineHeight: 1.4, flex: 1, position: "relative" }}>{f.d}</div>
              <div style={{ display: "inline-block", marginTop: 10, padding: "6px 11px", borderRadius: 15, background: "rgba(0,0,0,0.28)", fontSize: 9.5, fontWeight: 800, color: "#fff", alignSelf: "flex-start", position: "relative" }}>
                {f.cta} →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* LIVE COMPETITORS FROM BRAIN */}
      {topComps.length > 0 && (
        <div style={{ padding: "0 18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>⚔️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900 }}>Top Security Competitors</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Real data from 13.7L awards</div>
              </div>
            </div>
          </div>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14 }}>
            {topComps.slice(0, 5).map((c: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < Math.min(4, topComps.length - 1) ? `1px solid rgba(99,102,241,0.12)` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? "rgba(239,68,68,0.2)" : i === 1 ? "rgba(245,158,11,0.2)" : "rgba(99,102,241,0.15)", color: i === 0 ? "#F87171" : i === 1 ? "#FBBF24" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, color: "#10B981" }}>
                    ₹{((c.avg_value || 0) / 100000).toFixed(1)}L
                  </div>
                  <div style={{ fontSize: 9, color: C.muted }}>{c.wins} wins</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BRAIN INSIGHTS */}
      <div style={{ padding: "0 18px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🧠</span>
            <div style={{ fontSize: 15, fontWeight: 900 }}>Brain Insights</div>
          </div>
          <Link href="/tenders" style={{ fontSize: 11, fontWeight: 800, color: "#818CF8", textDecoration: "none" }}>View All →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {insights.map((ins, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14, minHeight: 155 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: ins.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, marginBottom: 10 }}>{ins.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.25 }}>{ins.t}</div>
              {ins.big ? (
                <>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#60A5FA", marginTop: 6, lineHeight: 1 }}>{ins.big}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{ins.bigL}</div>
                </>
              ) : (
                <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                  {ins.items?.map((it) => (
                    <li key={it} style={{ fontSize: 10, color: C.sub, lineHeight: 1.7 }}>• {it}</li>
                  ))}
                </ul>
              )}
              {ins.badge && (
                <div style={{ display: "inline-block", marginTop: 8, padding: "3px 8px", borderRadius: 6, background: "rgba(245,158,11,0.15)", color: "#FBBF24", fontSize: 9, fontWeight: 800 }}>{ins.badge}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="brain" />
    </div>
  );
}
