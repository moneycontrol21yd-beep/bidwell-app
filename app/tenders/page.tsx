"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = {
  bg: "#060B28",
  card: "#0E1533",
  cardLight: "#141B3D",
  text: "#fff",
  sub: "#94A3B8",
  muted: "#64748B",
};
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

interface Tender {
  id: string;
  title: string;
  department?: string;
  organisation?: string;
  tender_no?: string;
  source?: string;
  deadline?: string;
  value_in_cr?: number;
  state?: string;
  city?: string;
  match_score?: number;
}

export default function TendersListPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "closing" | "high_value" | "new">("all");
  const [query, setQuery] = useState("");
  const [filterState, setFilterState] = useState("");

  useEffect(() => {
    // Auto-load based on profile
    try {
      const p = JSON.parse(localStorage.getItem("company") || "{}");
      if(p.type) setQuery(p.type);
    } catch {}

    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("keyword", query);
    if (filterState) params.set("state", filterState);
    params.set("tab", tab);
    fetch(`/api/match-profile?state=${localStorage.getItem("company_state") || "All India"}&keyword=${encodeURIComponent(query)}&limit=10`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setTenders(d.tenders || []);
          setTotal(d.tenders?.length || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab, query, filterState]);

  const tabs = [
    { id: "all", label: "All", icon: "📋" },
    { id: "new", label: "New", icon: "🆕" },
    { id: "closing", label: "Closing", icon: "⏰" },
    { id: "high_value", label: "High Value", icon: "💰" },
  ];

  const daysLeft = (d?: string) => {
    if (!d || d === '' || d === 'NaT' || d === 'N/A' || d === 'NaN') return null;
    try {
      const t = new Date(d).getTime();
      if (isNaN(t)) return null;
      const diff = Math.ceil((t - Date.now()) / 86400000);
      if (isNaN(diff)) return null;
      return diff;
    } catch { return null; }
  };

  const matchColor = (s: number) => s >= 80 ? "#10B981" : s >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: C.text, fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)` }}>
        <div style={{ padding: "14px 18px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{ ...LINK, fontSize: 20, opacity: 0.9 }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>Live Tenders</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
              {loading ? "Loading..." : `${total.toLocaleString()} active tenders`}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div style={{ position: "absolute", top: -2, right: -3, width: 15, height: 15, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 8, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>5</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "0 18px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid rgba(99,102,241,0.25)`, borderRadius: 14, padding: "10px 14px" }}>
            <span style={{ fontSize: 15, opacity: 0.6 }}>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tenders by title, dept, location..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13, fontFamily: "inherit" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 16, cursor: "pointer" }}>✕</button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: "0 18px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "inline-flex", gap: 8 }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: 20,
                  background: tab === t.id ? "linear-gradient(135deg,#4338CA,#6366F1)" : C.card,
                  border: `1px solid ${tab === t.id ? "#6366F1" : "rgba(99,102,241,0.2)"}`,
                  color: "#fff",
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: tab === t.id ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 12 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TENDERS LIST */}
      <div style={{ padding: "14px 18px 20px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #3B82F6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 12 }}>Loading tenders...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : tenders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, opacity: 0.4 }}>📭</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 12, fontWeight: 600 }}>No tenders found</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Try changing filters or search</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tenders.map((t) => {
              const dl = daysLeft(t.deadline);
              const score = t.match_score || 0;
              const isUrgent = dl !== null && dl <= 7 && dl >= 0;

              return (
                <Link key={t.id} href={`/tenders/${t.id}`} style={{ ...LINK, display: "block" }}>
                  <div style={{
                    background: C.card,
                    border: `1px solid ${isUrgent ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.2)"}`,
                    borderRadius: 16,
                    padding: 14,
                    position: "relative",
                  }}>
                    {/* Top row - source + match */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 900, letterSpacing: 0.8,
                          padding: "3px 8px", borderRadius: 6,
                          background: "rgba(59,130,246,0.15)",
                          color: "#93C5FD",
                          border: "1px solid rgba(59,130,246,0.3)",
                        }}>
                          {(t.source || "CPPP").toUpperCase()}
                        </span>
                        {t.state && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: C.muted }}>📍 {t.state}</span>
                        )}
                      </div>
                      {score > 0 && (
                        <div style={{
                          padding: "3px 9px", borderRadius: 12,
                          background: `${matchColor(score)}22`,
                          border: `1px solid ${matchColor(score)}55`,
                          fontSize: 10, fontWeight: 900, color: matchColor(score),
                        }}>
                          {score}% match
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div style={{
                      fontSize: 13.5, fontWeight: 800, color: "#fff",
                      lineHeight: 1.35, marginBottom: 8,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as any,
                      overflow: "hidden",
                    }}>
                      {t.title}

<span style={{ fontSize: 10, fontWeight: 900, color: "#10B981", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: 10, marginLeft: 8 }}>
  {t.match_score ? `${t.match_score}% Match` : "AI Match"}
</span>

                    </div>

                    {/* Department */}
                    <div style={{
                      fontSize: 10.5, color: C.sub, marginBottom: 10,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <span style={{ opacity: 0.7 }}>🏛️</span>
                      <span style={{
                        overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", flex: 1,
                      }}>
                        {t.department || t.organisation || "Department info pending"}
                      </span>
                    </div>

                    {/* Bottom row - value + deadline */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: 10, borderTop: `1px solid rgba(99,102,241,0.15)`,
                    }}>
                      <div>
                        <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>Value</div>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "#60A5FA", marginTop: 2 }}>
                          {t.value_in_cr && t.value_in_cr > 0 ? `₹${t.value_in_cr} Cr` : "Not specified"}
                        </div>
                      </div>
                      {dl !== null && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>Deadline</div>
                          <div style={{
                            fontSize: 12, fontWeight: 900, marginTop: 2,
                            color: isUrgent ? "#EF4444" : dl < 0 ? C.muted : "#10B981",
                          }}>
                            {dl < 0 ? "Expired" : dl === 0 ? "Today" : `${dl}d left`}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Urgent badge */}
                    {isUrgent && (
                      <div style={{
                        position: "absolute", top: -1, right: -1,
                        background: "#EF4444", color: "#fff",
                        fontSize: 8, fontWeight: 900, letterSpacing: 0.6,
                        padding: "3px 8px", borderTopRightRadius: 15, borderBottomLeftRadius: 10,
                      }}>
                        URGENT
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="tenders" />
    </div>
  );
}
