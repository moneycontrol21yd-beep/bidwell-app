"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function MyBidsPage() {
  const [tab, setTab] = useState<"active" | "submitted" | "results">("active");
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

  const bids = [
    { id: 1, title: "Supply of Security Guards - AIIMS Delhi", dept: "AIIMS Delhi", value: "₹2.8 Cr", status: "In Progress", statusColor: "#F59E0B", deadline: "15 Nov 2026", match: 91 },
    { id: 2, title: "Housekeeping Services - Railway Board", dept: "Railway Board", value: "₹1.2 Cr", status: "Submitted", statusColor: "#3B82F6", deadline: "12 Nov 2026", match: 76 },
    { id: 3, title: "Security Contract - Delhi Metro", dept: "Delhi Metro", value: "₹4.8 Cr", status: "Won", statusColor: "#10B981", deadline: "01 Nov 2026", match: 95 },
    { id: 4, title: "Facility Management - PWD", dept: "PWD Uttar Pradesh", value: "₹2.5 Cr", status: "In Progress", statusColor: "#F59E0B", deadline: "20 Nov 2026", match: 84 },
  ];

  const filtered = bids.filter((b) => {
    if (tab === "active") return b.status === "In Progress";
    if (tab === "submitted") return b.status === "Submitted" || b.status === "Won";
    return true;
  });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)`, padding: "14px 18px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{ ...LINK, fontSize: 20, opacity: 0.9 }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.1 }}>My Bids</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{bids.length} total • {bids.filter(b => b.status === "Won").length} won</div>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div style={{ position: "absolute", top: -2, right: -3, width: 15, height: 15, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 8, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>5</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[
            { id: "active", l: "Active", c: bids.filter(b => b.status === "In Progress").length },
            { id: "submitted", l: "Submitted", c: bids.filter(b => b.status === "Submitted" || b.status === "Won").length },
            { id: "results", l: "Results", c: 0 },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{
                flex: 1, padding: "9px 10px", borderRadius: 12,
                background: tab === t.id ? "linear-gradient(135deg,#4338CA,#6366F1)" : C.card,
                border: `1px solid ${tab === t.id ? "#6366F1" : "rgba(99,102,241,0.2)"}`,
                color: "#fff", fontSize: 11.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                boxShadow: tab === t.id ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
              }}>
              {t.l} <span style={{ opacity: 0.7 }}>({t.c})</span>
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ padding: "14px 18px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Active</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#F59E0B", marginTop: 4 }}>2</div>
          </div>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Won</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981", marginTop: 4 }}>1</div>
          </div>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Total Value</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#60A5FA", marginTop: 4 }}>₹11.3 Cr</div>
          </div>
        </div>
      </div>

      {/* BIDS LIST */}
      <div style={{ padding: "14px 18px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: C.card, borderRadius: 16, border: `1px solid rgba(99,102,241,0.2)` }}>
            <div style={{ fontSize: 40, opacity: 0.4 }}>📝</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 12, fontWeight: 600 }}>No bids in this category</div>
            <Link href="/tenders" style={{ display: "inline-block", marginTop: 16, padding: "10px 20px", borderRadius: 12, background: "linear-gradient(135deg,#4338CA,#6366F1)", color: "#fff", fontWeight: 800, fontSize: 12 }}>
              Browse Tenders →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((b) => (
              <div key={b.id} style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14 }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 900, letterSpacing: 0.8,
                    padding: "3px 9px", borderRadius: 6,
                    background: `${b.statusColor}22`, color: b.statusColor,
                    border: `1px solid ${b.statusColor}55`,
                  }}>
                    {b.status.toUpperCase()}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.muted }}>Match</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: b.match >= 80 ? "#10B981" : "#F59E0B" }}>{b.match}%</span>
                  </div>
                </div>

                {/* Title */}
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.35, marginBottom: 8 }}>{b.title}</div>

                {/* Dept */}
                <div style={{ fontSize: 10.5, color: C.sub, marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ opacity: 0.7 }}>🏛️</span>
                  <span>{b.dept}</span>
                </div>

                {/* Bottom row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid rgba(99,102,241,0.15)` }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>Value</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#60A5FA", marginTop: 2 }}>{b.value}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>Deadline</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#E2E8F0", marginTop: 2 }}>{b.deadline}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="bids" />
    </div>
  );
}
