"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenderId = params.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "intel" | "source">("overview");
  const [intel, setIntel] = useState<any>(null);
  const [intelLoading, setIntelLoading] = useState(false);

  useEffect(() => {
    if (!tenderId) return;
    fetch(`/api/tenders/${tenderId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.tender) setTender(d.tender);
        else if (d.tender) setTender(d.tender);
        else if (d.data) setTender(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tenderId]);

  useEffect(() => {
    if (!tender?.title || intel) return;
    setIntelLoading(true);
    fetch(`/api/tender-intel?title=${encodeURIComponent(tender.title)}`)
      .then((r) => r.json())
      .then((d) => d.success && setIntel(d))
      .catch(() => {})
      .finally(() => setIntelLoading(false));
  }, [tender]);

  const daysLeft = (d?: string) => {
    if (!d) return null;
    try {
      const t = new Date(d).getTime();
      if (isNaN(t)) return null;
      const diff = Math.ceil((t - Date.now()) / 86400000);
      return isNaN(diff) ? null : diff;
    } catch { return null; }
  };

  if (loading) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, border: "3px solid #3B82F6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <div style={{ fontSize: 12, color: C.muted }}>Loading tender...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", color: "#fff", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 40, opacity: 0.4 }}>📭</div>
        <div style={{ fontSize: 14, color: C.sub, marginTop: 12 }}>Tender not found</div>
        <Link href="/tenders" style={{ display: "inline-block", marginTop: 20, color: "#818CF8", fontWeight: 800 }}>← Back to Tenders</Link>
      </div>
    );
  }

  const dl = daysLeft(tender.deadline);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#4338CA 0%,#6366F1 100%)", padding: "16px 18px 22px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(139,92,246,0.5)", filter: "blur(50px)" }} />
        <div style={{ position: "relative" }}>
          <button onClick={() => router.back()} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", padding: 0, marginBottom: 10 }}>←</button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, padding: "3px 9px", borderRadius: 6, background: "rgba(255,255,255,0.22)", color: "#fff" }}>
              {(tender.source || "CPPP").toUpperCase()}
            </span>
            {tender.state && <span style={{ fontSize: 10, color: "#E0E7FF", fontWeight: 700 }}>📍 {tender.state}</span>}
            {dl !== null && dl >= 0 && (
              <span style={{ fontSize: 9.5, fontWeight: 900, padding: "3px 9px", borderRadius: 6, background: dl <= 7 ? "rgba(239,68,68,0.9)" : "rgba(16,185,129,0.9)", color: "#fff" }}>
                {dl === 0 ? "TODAY" : `${dl} DAYS LEFT`}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 19, fontWeight: 900, margin: 0, lineHeight: 1.25, color: "#fff" }}>{tender.title}</h1>

          {tender.tender_no && (
            <div style={{ fontSize: 10.5, color: "#C7D2FE", marginTop: 8, fontWeight: 600 }}>
              Ref: {tender.tender_no}
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ padding: "14px 18px 0" }}>
        <div style={{ display: "flex", background: C.card, borderRadius: 14, padding: 4, border: `1px solid rgba(99,102,241,0.2)` }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "intel", label: "🧠 Intel" },
            { id: "source", label: "Source" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                flex: 1, padding: "10px 6px", borderRadius: 10,
                background: tab === t.id ? "linear-gradient(135deg,#4338CA,#6366F1)" : "transparent",
                color: tab === t.id ? "#fff" : C.sub,
                border: "none", fontSize: 11.5, fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
                boxShadow: tab === t.id ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 18px 20px" }}>
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Department */}
            <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>🏛️ Department</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#E2E8F0", lineHeight: 1.35 }}>
                {tender.department || tender.organisation || "Information pending"}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14 }}>
                <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>💰 Value</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#60A5FA" }}>
                  {tender.value_in_cr && tender.value_in_cr > 0 ? `₹${tender.value_in_cr} Cr` : "Not specified"}
                </div>
              </div>
              <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14 }}>
                <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>📅 Deadline</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#E2E8F0", lineHeight: 1.3 }}>
                  {tender.deadline || "Not specified"}
                </div>
              </div>
            </div>

            {/* Match Analysis Button */}
            <Link href={`/match?tenderId=${tender.id}`} style={{ ...LINK, display: "block" }}>
              <button style={{ width: "100%", background: "linear-gradient(135deg,#6366F1 0%,#A855F7 100%)", color: "#fff", border: "none", borderRadius: 16, padding: "15px", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 18px rgba(139,92,246,0.35)", fontFamily: "inherit" }}>
                🎯 View Match Analysis
              </button>
            </Link>

            {/* Bid Prep Button */}
            <button style={{ width: "100%", background: "linear-gradient(135deg,#2563EB 0%,#3B82F6 100%)", color: "#fff", border: "none", borderRadius: 16, padding: "15px", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 18px rgba(59,130,246,0.35)", fontFamily: "inherit" }}>
              ✍️ Start Bid Preparation
            </button>
          </div>
        )}

        {tab === "intel" && (
          <div>
            {intelLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0" }}>
                <div style={{ width: 30, height: 30, border: "3px solid #6366F1", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ fontSize: 11, color: C.muted, marginTop: 12 }}>Analyzing 13.7L records...</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            ) : !intel || !intel.totalSimilar ? (
              <div style={{ textAlign: "center", padding: "40px 20px", background: C.card, borderRadius: 16, border: `1px solid rgba(99,102,241,0.2)` }}>
                <div style={{ fontSize: 32, opacity: 0.4 }}>📊</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 10, fontWeight: 600 }}>No historical data for this tender</div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6 }}>Brain will learn as more data comes in</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Summary stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>Similar</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981", marginTop: 4 }}>{intel.totalSimilar}</div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>Avg Win</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: "#FBBF24", marginTop: 4 }}>
                      ₹{(intel.avgWinningValue / 100000).toFixed(1)}L
                    </div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>Avg Bids</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#60A5FA", marginTop: 4 }}>{intel.avgBidders.toFixed(1)}</div>
                  </div>
                </div>

                {/* Recommended Bid */}
                <div style={{ background: "linear-gradient(135deg,#059669 0%,#10B981 100%)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.9)", textTransform: "uppercase", letterSpacing: 1 }}>Recommended Bid</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginTop: 6, lineHeight: 1 }}>
                    ₹{((intel.avgWinningValue * 0.98) / 100000).toFixed(1)} L
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 8, fontWeight: 600 }}>
                    Based on {intel.totalSimilar} similar tenders
                  </div>
                </div>

                {/* Competitors */}
                <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>⚔️</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: "#E2E8F0", letterSpacing: 0.5 }}>LIKELY COMPETITORS</span>
                  </div>
                  {intel.topCompetitors.map((c: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < intel.topCompetitors.length - 1 ? `1px solid rgba(99,102,241,0.12)` : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "rgba(239,68,68,0.2)" : i === 1 ? "rgba(245,158,11,0.2)" : "rgba(99,102,241,0.15)", color: i === 0 ? "#F87171" : i === 1 ? "#FBBF24" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 12, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#10B981" }}>
                          ₹{(c.avg_value / 100000).toFixed(1)}L
                        </div>
                        <div style={{ fontSize: 9, color: C.muted }}>{c.wins} wins</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "source" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Source</div>
              <div style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 600 }}>{tender.source || "CPPP"}</div>
            </div>

            <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Tender Number</div>
              <div style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 600, wordBreak: "break-all" }}>{tender.tender_no || "Not specified"}</div>
            </div>

            {tender.source_url && (
              <a href={tender.source_url} target="_blank" rel="noopener noreferrer" style={{ ...LINK, display: "block" }}>
                <button style={{ width: "100%", background: "linear-gradient(135deg,#059669 0%,#10B981 100%)", color: "#fff", border: "none", borderRadius: 16, padding: "15px", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 18px rgba(16,185,129,0.3)", fontFamily: "inherit" }}>
                  🔗 Open Original Tender
                </button>
              </a>
            )}

            <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 14, padding: 14, display: "flex", gap: 10 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div style={{ fontSize: 11, color: "#FBBF24", lineHeight: 1.5, fontWeight: 600 }}>
                Official PDF download or bid submission requires direct login on the source portal.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="tenders" />
    </div>
  );
}
