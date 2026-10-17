"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
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
      .then(d => { 
        const t = d.tender || d;
        setTender({
          id: t.id || t.source_tender_id || tenderId,
          title: t.title || "Tender Title Not Available",
          department: t.department || t.org_name || t.organisation || "Department Not Available",
          state: t.state || "India",
          deadline: t.deadline || t.closing_date || "",
          source: t.source || "Portal",
          source_url: t.source_url || t.detail_url || ""
        }); 
        setLoading(false); 
      })
      .catch((e) => { 
        console.error(e);
        setLoading(false); 
      });
  }, [tenderId]);

  useEffect(() => {
    if (tab === "intel" && tender && tender.department !== "Department Not Available") {
      setIntelLoading(true);
      fetch(`/api/competitor-intel?org=${encodeURIComponent(tender.department)}`)
        .then(r => r.json())
        .then(d => { if (d.success) setIntel(d); })
        .catch(() => {})
        .finally(() => setIntelLoading(false));
    }
  }, [tab, tender]);

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>;
  if (!tender) return <div style={{ background: C.bg, minHeight: "100vh", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>Tender Not Found</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 120, fontFamily: "system-ui, sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)", padding: "20px 18px 24px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Link href="/tenders" style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#C7D2FE" }}>← BACK</Link>
        <div style={{ display: "flex", gap: 8, marginTop: 14, marginBottom: 12 }}>
          <span style={{ background: "rgba(0,0,0,0.3)", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 10 }}>{tender.source}</span>
          <span style={{ background: "rgba(16,185,129,0.2)", color: "#10B981", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 10 }}>● Open</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0, lineHeight: 1.3 }}>{tender.title}</h1>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", padding: "18px 18px 0", gap: 8 }}>
        {["overview", "intel", "source"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", background: tab === t ? "linear-gradient(135deg,#6366F1,#A855F7)" : C.card, border: "none", borderRadius: 12, color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "18px" }}>
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: C.card, padding: 16, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 800 }}>ESTIMATED VALUE</div>
                <div style={{ fontSize: 15, fontWeight: 900, marginTop: 6 }}>Not Disclosed</div>
              </div>
              <div style={{ background: C.card, padding: 16, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 800 }}>DEADLINE</div>
                <div style={{ fontSize: 15, fontWeight: 900, marginTop: 6, color: "#F59E0B" }}>
                  {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : "Check Portal"}
                </div>
              </div>
            </div>
            <div style={{ background: C.card, padding: 16, borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, marginBottom: 12 }}>KEY INFORMATION</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}><span style={{ color: C.sub }}>Department</span><span style={{ fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{tender.department}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}><span style={{ color: C.sub }}>State</span><span style={{ fontWeight: 700 }}>{tender.state}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: C.sub }}>Tender ID</span><span style={{ fontWeight: 700 }}>{tender.id}</span></div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: 16, borderRadius: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: 24 }}>✨</div>
              <div><div style={{ fontSize: 13, fontWeight: 900 }}>AI Summary</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 6, lineHeight: 1.4 }}>High-value infrastructure opportunity. Ensure technical and financial documents are strictly verified according to the official portal requirements.</div></div>
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
            {tender.source_url ? (
              <a href={tender.source_url} target="_blank" rel="noreferrer" style={{ color: "#60A5FA", fontSize: 12, wordBreak: "break-all", textDecoration: "none" }}>{tender.source_url}</a>
            ) : (
              <div style={{ color: C.muted, fontSize: 12 }}>URL not available. Please check the official portal directly.</div>
            )}
          </div>
        )}
      </div>

      {/* ACTION BUTTON */}
      <div style={{ padding: "0 18px", marginBottom: 20 }}>
        <Link href={`/bids/prepare/${tenderId}`} style={{ ...LINK, display: "block" }}>
          <button style={{ width: "100%", background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", border: "none", padding: "16px", borderRadius: 16, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 20px rgba(16,185,129,0.4)" }}>
            ✍️ Start Bid Preparation
          </button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
