"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B", purple: "#6366F1" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function TenderDetailPage() {
  const params = useParams();
  const tenderId = params?.id as string;
  
  const [tender, setTender] = useState<any>(null);
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [intelLoading, setIntelLoading] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!tenderId) return;
    fetch(`/api/tenders/${encodeURIComponent(tenderId)}`)
      .then(r => r.json())
      .then(d => { setTender(d.tender || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tenderId]);

  useEffect(() => {
    if (tab === "intel" && tender && (tender.department || tender.organisation)) {
      setIntelLoading(true);
      const org = tender.department || tender.organisation;
      fetch(`/api/competitor-intel?org=${encodeURIComponent(org)}`)
        .then(r => r.json())
        .then(d => { if (d.success) setIntel(d); })
        .catch(() => {})
        .finally(() => setIntelLoading(false));
    }
  }, [tab, tender]);

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>;

  if (!tender) return (
    <div style={{ background: C.bg, minHeight: "100vh", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 20 }}>📭</div>
      <div style={{ fontSize: 16, fontWeight: 800 }}>Tender Not Found</div>
      <Link href="/tenders" style={{ marginTop: 20, color: "#818CF8", fontWeight: 800, textDecoration: "none" }}>← Back to Tenders</Link>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 100, fontFamily: "system-ui, sans-serif" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)", padding: "20px 18px 24px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Link href="/tenders" style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#C7D2FE" }}>← Back</Link>
        <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 10 }}>
          <span style={{ background: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 10 }}>{tender.source || "CPPP"}</span>
          <span style={{ background: "rgba(16,185,129,0.3)", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 10, color: "#10B981" }}>● Open</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, lineHeight: 1.3 }}>{tender.title}</h1>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", padding: "18px 18px 0", gap: 8 }}>
        {["overview", "intel", "source"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", background: tab === t ? C.purple : C.card, border: "none", borderRadius: 12, color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "18px" }}>
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: C.card, padding: 16, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 800 }}>ESTIMATED VALUE</div>
                <div style={{ fontSize: 15, fontWeight: 900, marginTop: 6 }}>Check Portal</div>
              </div>
              <div style={{ background: C.card, padding: 16, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 800 }}>DEADLINE</div>
                <div style={{ fontSize: 15, fontWeight: 900, marginTop: 6, color: "#F59E0B" }}>{tender.deadline ? new Date(tender.deadline).toLocaleDateString() : "Check Portal"}</div>
              </div>
            </div>
            <div style={{ background: C.card, padding: 16, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 12 }}>KEY INFORMATION</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}><span style={{ color: C.sub }}>Department</span><span style={{ fontWeight: 700 }}>{tender.department || tender.organisation || "N/A"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}><span style={{ color: C.sub }}>State</span><span style={{ fontWeight: 700 }}>{tender.state || "India"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: C.sub }}>ID</span><span style={{ fontWeight: 700 }}>{tender.id || tenderId}</span></div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", padding: 16, borderRadius: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 24 }}>✨</div>
              <div><div style={{ fontSize: 12, fontWeight: 900 }}>AI Summary</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>This is a high-value infrastructure project. Ensure your technical and financial documents are ready.</div></div>
            </div>
          </div>
        )}

        {tab === "intel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {intelLoading ? (
              <div style={{ textAlign: "center", color: C.muted, padding: 20 }}>Analyzing historical data...</div>
            ) : intel && intel.top_competitors?.length > 0 ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.muted, marginBottom: 4 }}>TOP COMPETITORS (Historical)</div>
                {intel.top_competitors.map((c: any, i: number) => (
                  <div key={i} style={{ background: C.card, padding: 14, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{c.winner_name}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>Avg Bid: ₹{(c.avg_winning_bid / 100000).toFixed(2)} L</div>
                    </div>
                    <div style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", fontSize: 11, fontWeight: 900, padding: "4px 8px", borderRadius: 8 }}>{c.total_wins} Wins</div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ textAlign: "center", color: C.muted, padding: 20 }}>No historical competitor data found for this department.</div>
            )}
          </div>
        )}

        {tab === "source" && (
          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>Official Source URL</div>
            <a href={tender.source_url} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", fontSize: 12, wordBreak: "break-all", textDecoration: "none" }}>{tender.source_url || "URL not available"}</a>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BUTTONS */}
      <div style={{ position: "fixed", bottom: 60, left: 0, right: 0, padding: "0 18px", display: "flex", gap: 10 }}>
        <Link href={`/bids/prepare/${tenderId}`} style={{ ...LINK, flex: 1 }}>
          <button style={{ width: "100%", background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", border: "none", padding: "16px", borderRadius: 16, color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>✍️ Start Bid Prep</button>
        </Link>
      </div>
      <BottomNav />
    </div>
  );
}
