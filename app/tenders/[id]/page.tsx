"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#A1A1AA", muted: "#71717A", accent: "#818CF8", border: "rgba(255,255,255,0.05)" };
const LINK = { textDecoration: "none", color: "#fff" };

export default function TenderDetailPage() {
  const params = useParams();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  const [intel, setIntel] = useState<any>(null);
  const [intelLoading, setIntelLoading] = useState(false);

  useEffect(() => {
    if (!tenderId) return;
    fetch(`/api/tender-detail?id=${encodeURIComponent(tenderId)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setTender(d.tender);
        else setError("Tender not found.");
        setLoading(false);
      })
      .catch(() => { setError("Failed to load tender."); setLoading(false); });
  }, [tenderId]);

  useEffect(() => {
    if (tab === "intel" && tender && !intel && !intelLoading) {
      setIntelLoading(true);
      fetch(`/api/tender-intel?org=${encodeURIComponent(tender.org_name || "")}&id=${tender.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) setIntel(d.intel);
          setIntelLoading(false);
        })
        .catch(() => setIntelLoading(false));
    }
  }, [tab, tender, intel, intelLoading]);

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", color: C.text, padding: 20, textAlign: "center" }}>Loading...</div>;
  if (error || !tender) return <div style={{ background: C.bg, minHeight: "100vh", color: "#EF4444", padding: 20, textAlign: "center" }}>{error}</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: "80px" }}>
      
      <div style={{ background: "linear-gradient(135deg, #4338CA 0%, #1E1B4B 100%)", padding: "24px 18px" }}>
        <Link href="/tenders" style={{ ...LINK, fontSize: 11, fontWeight: 800, display: "inline-block", marginBottom: 12, color: "#C7D2FE" }}>← Back to Tenders</Link>
        <h1 style={{ fontSize: 18, fontWeight: 900, margin: "10px 0 0 0", lineHeight: 1.3, wordBreak: "break-word" }}>{tender.title || "Tender Details"}</h1>
      </div>

      <div style={{ display: "flex", padding: "18px 18px 0", gap: 8 }}>
        {["overview", "intel", "source"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", background: tab === t ? C.card : "transparent", color: tab === t ? C.text : C.sub, border: "none", borderRadius: 8, fontWeight: 800, fontSize: 12, textTransform: "capitalize", cursor: "pointer" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "18px" }}>
        
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>Tender Overview</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ color: C.sub, fontSize: 12 }}>Closing Date</span><span style={{ fontWeight: 700, fontSize: 12, color: "#F59E0B" }}>{tender.closing_date || "N/A"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ color: C.sub, fontSize: 12 }}>Department</span><span style={{ fontWeight: 700, fontSize: 12, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{tender.org_name || "N/A"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub, fontSize: 12 }}>EMD</span><span style={{ fontWeight: 700, fontSize: 12 }}>{tender.emd || "Check Portal"}</span></div>
            </div>
          </div>
        )}

        {tab === "intel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {intelLoading ? (
              <div style={{ textAlign: "center", padding: 20, color: C.sub }}>Analyzing Tender Data...</div>
            ) : intel ? (
              <>
                {/* 🚀 NAYA SECTION: CYBER AI & DOCUMENTS (Data from direct_app_sync) */}
                <div style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", padding: 16, borderRadius: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>🛡️</span>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#FDE047" }}>Cyber AI Desk</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#E2E8F0", marginBottom: 8 }}>
                    <strong>Eligibility:</strong> {tender.cyber_intel?.eligibility_status || "Eligible with Gaps"}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>Missing Documents:</div>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, fontSize: 12, color: "#F87171" }}>
                    {tender.cyber_intel?.missing_items?.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    )) || <li>No missing documents found.</li>}
                  </ul>
                </div>

                {/* Purana Verdict Section */}
                <div style={{ background: C.card, border: `1px solid ${intel.analysis.verdictColor}55`, padding: 16, borderRadius: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: intel.analysis.verdictColor }}>{intel.analysis.verdict}</div>
                  </div>
                  <div style={{ marginTop: 12, background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.sub, marginBottom: 4 }}>Risk Factors:</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: C.text }}>
                      {intel.analysis.riskReasons.map((reason: string, i: number) => (<li key={i} style={{ marginBottom: 4, wordBreak: "break-word" }}>{reason}</li>))}
                    </ul>
                  </div>
                </div>

                {/* Purana Kundli Section */}
                <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.accent, marginBottom: 12 }}>Department Statistics</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: C.sub, fontSize: 12 }}>Total Live Tenders</span><span style={{ fontWeight: 800, fontSize: 14, color: "#10B981" }}>{intel.totalLive}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub, fontSize: 12 }}>Payment Estimate</span><span style={{ fontWeight: 800, fontSize: 12, color: "#60A5FA" }}>{intel.analysis.paymentRating}</span></div>
                </div>

                {/* Purana Award History Section */}
                <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B", marginBottom: 12 }}>Award History</div>
                  {intel.analysis.competitors && intel.analysis.competitors.length > 0 ? (
                    intel.analysis.competitors.map((c: any, i: number) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: i !== intel.analysis.competitors.length - 1 ? `1px solid ${C.border}` : "none", paddingBottom: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{c.winner_name || c.winner}</div>
                        <div style={{ fontSize: 12, color: "#10B981" }}>{c.wins} Wins</div>
                      </div>
                    ))
                  ) : (<div style={{ fontSize: 12, color: C.sub }}>Insufficient data.</div>)}
                </div>
              </>
            ) : (<div style={{ color: C.sub, fontSize: 12 }}>Intel data unavailable.</div>)}
          </div>
        )}

        {tab === "source" && (
          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
              <a href={tender.source_url || "#"} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none", wordBreak: "break-all" }}>{tender.source_url || "No source link"}</a>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
