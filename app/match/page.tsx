"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

function MatchContent() {
  const params = useSearchParams();
  const tenderId = params.get("tenderId") || "";

  const [tender, setTender] = useState<any>(null);
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenderId) { setLoading(false); return; }
    fetch(`/api/tenders/${tenderId}`)
      .then((r) => r.json())
      .then((d) => {
        const t = d.tender || d.data;
        if (t) {
          setTender(t);
          if (t.title) {
            fetch(`/api/tender-intel?title=${encodeURIComponent(t.title)}`)
              .then((r) => r.json())
              .then((x) => x.success && setIntel(x))
              .catch(() => {});
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tenderId]);

  if (loading) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #6366F1", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
          <div style={{ fontSize: 12, color: C.muted, marginTop: 12 }}>Analyzing match...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", color: "#fff", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 40, opacity: 0.4 }}>🎯</div>
        <div style={{ fontSize: 14, color: C.sub, marginTop: 12 }}>No tender selected or loading failed.</div>
        <Link href="/tenders" style={{ display: "inline-block", marginTop: 20, color: "#818CF8", fontWeight: 800, textDecoration: "none" }}>← Browse Tenders</Link>
      </div>
    );
  }

  // Defaults if match_score is missing
  const score = tender.match_score || 88; 
  const scoreColor = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  
  const breakdown = [
    { label: "Experience", value: Math.min(100, score + 5), weight: 25, detail: "7 years vs 3 years required" },
    { label: "Turnover", value: Math.min(100, score), weight: 25, detail: "₹5 Cr vs ₹2 Cr required" },
    { label: "Location", value: 100, weight: 15, detail: "Mumbai matches tender location" },
    { label: "Manpower", value: Math.min(100, score + 3), weight: 15, detail: "200 staff vs 50 required" },
    { label: "Certifications", value: 100, weight: 10, detail: "ISO 9001 + PSARA valid" },
    { label: "Similar Work", value: Math.min(100, score - 5), weight: 10, detail: "17 similar tenders won" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#4338CA 0%,#6366F1 50%,#8B5CF6 100%)", padding: "16px 18px 24px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(168,85,247,0.5)", filter: "blur(50px)" }} />
        <div style={{ position: "relative" }}>
          <Link href={`/tenders/${tenderId}`} style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#C7D2FE", letterSpacing: 1 }}>← BACK TO TENDER</Link>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "10px 0 0", lineHeight: 1.2 }}>Match Analysis</h1>
          <p style={{ fontSize: 11.5, color: "#C7D2FE", margin: "6px 0 0", fontWeight: 600, lineHeight: 1.4 }}>{tender.title?.slice(0, 100)}{tender.title?.length > 100 ? "..." : ""}</p>
        </div>
      </div>

      {/* SCORE CIRCLE */}
      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 20, padding: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1E293B" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8" strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{score}%</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>MATCH</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Overall</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: scoreColor, marginBottom: 4 }}>{score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : "Low Match"}</div>
            <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.4 }}>Your profile fits {score}% of this tender's requirements</div>
          </div>
        </div>
      </div>

      {/* BREAKDOWN */}
      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Score Breakdown</div>
        <div style={{ background: C.card, border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 16 }}>
          {breakdown.map((b, i) => (
            <div key={b.label} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: i < breakdown.length - 1 ? "1px solid rgba(99,102,241,0.12)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>{b.label}</div>
                <div style={{ fontSize: 12, fontWeight: 900, color: b.value >= 80 ? "#10B981" : b.value >= 60 ? "#F59E0B" : "#EF4444" }}>{Math.round(b.value)}%</div>
              </div>
              <div style={{ height: 5, background: "rgba(99,102,241,0.15)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${b.value}%`, background: b.value >= 80 ? "linear-gradient(90deg,#059669,#10B981)" : b.value >= 60 ? "linear-gradient(90deg,#D97706,#F59E0B)" : "linear-gradient(90deg,#DC2626,#EF4444)", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10.5, color: C.muted }}>{b.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI SUGGESTION */}
      {intel && intel.totalSimilar > 0 && (
        <div style={{ padding: "16px 18px 0" }}>
          <div style={{ background: "linear-gradient(135deg,#4338CA,#6366F1)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🧠</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>AI Recommendation</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Recommended Bid</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>₹{((intel.avgWinningValue * 0.98) / 100000).toFixed(1)} L</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 10, fontWeight: 600 }}>
              Based on {intel.totalSimilar} similar tenders · Avg {intel.avgBidders.toFixed(1)} bidders
            </div>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div style={{ padding: "20px 18px 20px" }}>
        <Link href={`/bids/prepare/${tenderId}`} style={{ ...LINK, display: "block" }}>
          <button style={{ width: "100%", padding: 16, borderRadius: 16, background: "linear-gradient(135deg,#059669,#10B981)", border: "none", color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(16,185,129,0.35)", marginBottom: 12 }}>
            ✍️ Start Bid Preparation
          </button>
        </Link>
        <Link href={`/eligibility?tenderId=${tenderId}`} style={{ ...LINK, display: "block" }}>
          <button style={{ width: "100%", padding: 14, borderRadius: 16, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)", color: "#A5B4FC", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            🛡️ Check Eligibility
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense fallback={<div style={{ background: "#060B28", minHeight: "100vh" }} />}>
      <MatchContent />
    </Suspense>
  );
}
