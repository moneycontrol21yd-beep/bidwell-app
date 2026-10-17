"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { useT } from "@/lib/i18n";

const C = {
  bg: "#060B28",
  card: "#0E1533",
  text: "#fff",
  sub: "#94A3B8",
  muted: "#64748B",
};
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

/* Detailed Neon Brain */
function NeonBrain() {
  return (
    <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
      {/* Outer glow */}
      <div style={{
        position: "absolute", inset: -30,
        background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(59,130,246,0.35) 40%, transparent 70%)",
        filter: "blur(20px)",
      }} />
      <svg viewBox="0 0 200 200" width="180" height="180" style={{ position: "relative", display: "block" }}>
        <defs>
          <radialGradient id="bg1" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="1" />
            <stop offset="30%" stopColor="#C084FC" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0.7" />
          </radialGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Brain shape */}
        <g filter="url(#glow1)">
          <path
            d="M100 35 C 65 35, 45 58, 48 85 C 42 92, 40 105, 48 115 C 44 130, 52 148, 68 155 C 78 168, 90 170, 100 170 C 110 170, 122 168, 132 155 C 148 148, 156 130, 152 115 C 160 105, 158 92, 152 85 C 155 58, 135 35, 100 35 Z"
            fill="url(#bg1)"
          />
          {/* Circuit lines */}
          <g stroke="#DDD6FE" strokeWidth="0.9" fill="none" opacity="0.75">
            <path d="M100 45 L100 165" />
            <path d="M75 55 Q85 75 78 95 Q72 115 82 140" />
            <path d="M125 55 Q115 75 122 95 Q128 115 118 140" />
            <path d="M60 78 Q75 88 75 105 Q75 120 68 135" />
            <path d="M140 78 Q125 88 125 105 Q125 120 132 135" />
            <path d="M85 128 Q92 140 100 145 Q108 140 115 128" />
            <path d="M58 95 L 75 95" />
            <path d="M125 95 L 142 95" />
          </g>
          {/* Node dots */}
          <g fill="#F0ABFC">
            <circle cx="75" cy="95" r="1.8" />
            <circle cx="125" cy="95" r="1.8" />
            <circle cx="100" cy="145" r="1.8" />
            <circle cx="58" cy="95" r="1.5" />
            <circle cx="142" cy="95" r="1.5" />
          </g>
        </g>
        {/* Center logo */}
        <rect x="82" y="82" width="36" height="36" rx="10" fill="#0A0E27" stroke="#A78BFA" strokeWidth="2.5" />
        <text x="100" y="108" textAnchor="middle" fill="#C4B5FD" fontSize="22" fontWeight="900" fontFamily="system-ui">B</text>
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const t = useT();
  const [userName, setUserName] = useState("BR");
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const user = JSON.parse(u);
        const n = user.name || user.full_name || "User";
        setUserName(n.split(" ").map((x: string) => x[0]).join("").slice(0, 2).toUpperCase());
      }
    } catch {}
  }, []);

  const quickTabs = [
    { icon: "🧠", l: "Brain", s: "AI Insights", href: "/brain", on: true },
    { icon: "📄", l: "Live Tenders", s: "Current Opportunities", href: "/tenders" },
    { icon: "📊", l: "Analysis", s: "Data & Trends", href: "/match" },
    { icon: "⭐", l: "Watchlist", s: "Save & Track", href: "/watch" },
    { icon: "✍️", l: "My Bids", s: "Track Progress", href: "/bids" },
  ];

  const features = [
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
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#3B82F6,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 19, color: "#fff", boxShadow: "0 4px 14px rgba(99,102,241,0.45)" }}>B</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -0.3 }}>BidWell</div>
            <div style={{ fontSize: 9.5, color: C.muted, marginTop: 4 }}>Smarter Tenders. Bigger Opportunities.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 22 }}>🔔</span>
            <div style={{ position: "absolute", top: -2, right: -4, width: 17, height: 17, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.bg}` }}>5</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", border: "2px solid rgba(139,92,246,0.55)" }}>
            {userName}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: "28px 18px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: "linear-gradient(90deg,rgba(59,130,246,0.18),rgba(139,92,246,0.18))", border: "1px solid rgba(139,92,246,0.45)", marginBottom: 14 }}>
              <span style={{ fontSize: 11 }}>✨</span>
              <span style={{ fontSize: 9.5, fontWeight: 900, color: "#C4B5FD", letterSpacing: 1.2 }}>AI POWERED</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.05, letterSpacing: -0.8 }}>
              BidWell <span style={{ background: "linear-gradient(135deg,#60A5FA 0%,#C084FC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Brain</span>
            </h1>
            <p style={{ fontSize: 14, color: C.sub, margin: "12px 0 0", fontWeight: 600, lineHeight: 1.35 }}>
              Your AI Co-Pilot for<br />Government Tenders
            </p>
            <p style={{ fontSize: 12, color: "#818CF8", margin: "10px 0 0", fontWeight: 700 }}>
              Analyze. Shortlist. Plan. Win.
            </p>
          </div>
          <NeonBrain />
        </div>

        {/* Floating pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 20 }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, justifyContent: "center" }}>
          {["THINK", "ANALYZE", "BID", "SUCCEED"].map((w, i) => (
            <span key={w} style={{ fontSize: 9, fontWeight: 900, color: C.muted, letterSpacing: 1.8, display: "flex", alignItems: "center" }}>
              {w}{i < 3 && <span style={{ margin: "0 8px", opacity: 0.5 }}>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* QUICK TABS */}
      <div style={{ padding: "0 18px 22px", overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "inline-flex", gap: 10 }}>
          {quickTabs.map((t) => (
            <Link key={t.l} href={t.href} style={{ ...LINK, display: "block", flexShrink: 0, minWidth: 140, padding: "12px 14px", borderRadius: 16, background: t.on ? "linear-gradient(135deg,#4338CA,#6366F1)" : C.card, border: `1px solid ${t.on ? "#6366F1" : "rgba(99,102,241,0.18)"}`, boxShadow: t.on ? "0 6px 18px rgba(99,102,241,0.35)" : "none" }}>
              <div style={{ fontSize: 20 }}>{t.icon}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", marginTop: 9 }}>{t.l}</div>
              <div style={{ fontSize: 9.5, color: t.on ? "#C7D2FE" : C.muted, marginTop: 3 }}>{t.s}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURE GRID */}
      <div style={{ padding: "0 18px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f) => (
            <Link key={f.t} href={f.href} style={{
              ...LINK,
              display: "flex", flexDirection: "column",
              borderRadius: 18, padding: 15,
              background: f.bg,
              minHeight: 175,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}>
              {/* Decorative glow */}
              <div style={{ position: "absolute", top: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.15)", filter: "blur(20px)" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, backdropFilter: "blur(10px)" }}>{f.icon}</div>
                <span style={{ color: "#fff", fontSize: 15, opacity: 0.85, fontWeight: 700 }}>→</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginTop: 14, lineHeight: 1.2, position: "relative", letterSpacing: -0.2 }}>{f.t}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.9)", marginTop: 7, lineHeight: 1.4, flex: 1, position: "relative" }}>{f.d}</div>
              <div style={{ display: "inline-block", marginTop: 12, padding: "6px 12px", borderRadius: 16, background: "rgba(0,0,0,0.28)", fontSize: 10, fontWeight: 800, color: "#fff", alignSelf: "flex-start", position: "relative", backdropFilter: "blur(10px)" }}>
                {f.cta} →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BRAIN INSIGHTS */}
      <div style={{ padding: "0 18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 19 }}>🧠</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>Brain Insights</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Top Insights for You</div>
            </div>
          </div>
          <Link href="/match" style={{ fontSize: 11, fontWeight: 800, color: "#818CF8", textDecoration: "none" }}>View All →</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {insights.map((ins, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14, minHeight: 165 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: ins.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 11, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>{ins.icon}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", lineHeight: 1.25 }}>{ins.t}</div>

              {ins.big ? (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#60A5FA", marginTop: 6, lineHeight: 1, letterSpacing: -0.5 }}>{ins.big}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontWeight: 600 }}>{ins.bigL}</div>
                </>
              ) : (
                <ul style={{ margin: "9px 0 0", padding: 0, listStyle: "none" }}>
                  {ins.items?.map((it) => (
                    <li key={it} style={{ fontSize: 10.5, color: C.sub, lineHeight: 1.7, fontWeight: 500 }}>• {it}</li>
                  ))}
                </ul>
              )}

              {ins.badge && (
                <div style={{ display: "inline-block", marginTop: 10, padding: "4px 9px", borderRadius: 7, background: "rgba(245,158,11,0.15)", color: "#FBBF24", fontSize: 9.5, fontWeight: 800, border: "1px solid rgba(245,158,11,0.3)" }}>{ins.badge}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: "0 18px 22px" }}>
        <Link href="/tenders" style={{ ...LINK, display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 20, padding: 18, background: "linear-gradient(135deg,#0F766E 0%,#14B8A6 100%)", gap: 12, boxShadow: "0 10px 28px rgba(20,184,166,0.3)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 900, color: "#fff", lineHeight: 1.3 }}>Let AI do the heavy lifting.</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.9)", marginTop: 4, fontWeight: 600 }}>You focus on winning.</div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: 20, background: "rgba(255,255,255,0.25)", fontSize: 11.5, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", gap: 4 }}>
            ✨ Get Started →
          </div>
        </Link>
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="home" />
    </div>
  );
}
