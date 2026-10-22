"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const C = { 
  bg: "#f5f7fb", card: "#ffffff", text: "#17233b", sub: "#64748b", accent: "#315efb", border: "#e2e8f0", success: "#10b981", danger: "#ef4444", warning: "#f59e0b"
};

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "intel">("overview");
  const [intel, setIntel] = useState<any>(null);
  const [intelLoading, setIntelLoading] = useState(false);

  useEffect(() => {
    if (!tenderId) return;
    fetch(`/api/tender-detail?id=${encodeURIComponent(tenderId)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setTender(d.tender);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tenderId]);

  useEffect(() => {
    if (activeTab === "intel" && tender && !intel && !intelLoading) {
      setIntelLoading(true);
      fetch(`/api/tender-intel?org=${encodeURIComponent(tender.org_name || "")}&id=${tender.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) setIntel(d.intel);
          setIntelLoading(false);
        })
        .catch(() => setIntelLoading(false));
    }
  }, [activeTab, tender, intel, intelLoading]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } 
    catch (e) { return dateStr; }
  };

  const formatCurrency = (amount: any) => {
    if (!amount || amount === "0") return "Not Specified";
    const num = parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return `₹${amount}`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}>Loading...</div>;
  if (!tender) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.text }}>Tender Not Found</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: "40px", fontFamily: "system-ui, sans-serif" }}>
      
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "20px" }}>
        <button onClick={() => router.back()} style={{ color: C.accent, fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", marginBottom: 16, padding: 0 }}>
          ← Back to Workspace
        </button>
        
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ background: "#ecfdf5", color: C.success, fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 6, border: "1px solid #a7f3d0" }}>● ACTIVE TENDER</span>
          <span style={{ background: "#f1f5f9", color: C.sub, fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 6 }}>ID: {tender.source_tender_id || tender.id || "N/A"}</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.4 }}>{tender.title}</h1>
      </div>

      <div style={{ display: "flex", background: C.card, borderBottom: `1px solid ${C.border}`, padding: "0 20px" }}>
        <button onClick={() => setActiveTab("overview")} style={{ flex: 1, padding: "16px 0", background: "none", border: "none", borderBottom: activeTab === "overview" ? `2px solid ${C.accent}` : "2px solid transparent", color: activeTab === "overview" ? C.accent : C.sub, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Overview</button>
        <button onClick={() => setActiveTab("intel")} style={{ flex: 1, padding: "16px 0", background: "none", border: "none", borderBottom: activeTab === "intel" ? `2px solid ${C.accent}` : "2px solid transparent", color: activeTab === "intel" ? C.accent : C.sub, fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>✳ AI Intel Report</button>
      </div>

      <div style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
        
        {activeTab === "overview" && (
          <>
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.sub, textTransform: "uppercase", marginBottom: 16 }}>Tender Information</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${C.border}`, paddingBottom: 14 }}><span style={{ color: C.sub, fontSize: 13 }}>Department</span><span style={{ fontWeight: 700, fontSize: 13, textAlign: "right", maxWidth: "65%" }}>{tender.org_name || "N/A"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${C.border}`, paddingBottom: 14 }}><span style={{ color: C.sub, fontSize: 13 }}>Location / State</span><span style={{ fontWeight: 700, fontSize: 13, textAlign: "right", maxWidth: "65%" }}>{tender.state || "All India"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub, fontSize: 13 }}>Bid Submission Deadline</span><span style={{ fontWeight: 800, fontSize: 13, color: C.danger, background: "#fef2f2", padding: "4px 8px", borderRadius: 6, border: "1px solid #fecaca" }}>{formatDate(tender.closing_date)}</span></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20 }}><div style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: "uppercase", marginBottom: 8 }}>Tender Value</div><div style={{ fontSize: 18, fontWeight: 900 }}>{formatCurrency(tender.value)}</div></div>
              <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20 }}><div style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: "uppercase", marginBottom: 8 }}>EMD Amount</div><div style={{ fontSize: 18, fontWeight: 900 }}>{formatCurrency(tender.emd)}</div></div>
            </div>
            
            <a href={tender.source_url || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", background: C.accent, color: "#fff", padding: "14px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 800 }}>
              <span>Visit Official Portal</span><span style={{ fontSize: 16 }}>↗</span>
            </a>
          </>
        )}

        {activeTab === "intel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {intelLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: C.sub }}>Generating Consultant Report from VPS Brain...</div>
            ) : intel ? (
              <>
                <div style={{ background: C.card, border: `2px solid ${intel.analysis?.verdictColor || C.border}`, padding: 20, borderRadius: 16, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: intel.analysis?.verdictColor || C.accent }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.sub, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>AI Consultant Verdict</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: intel.analysis?.verdictColor || C.text }}>{intel.analysis?.verdict || "REVIEW REQUIRED"}</div>
                    </div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, marginTop: 15 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.sub, marginBottom: 8, textTransform: "uppercase" }}>Key Insights & Risks:</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                      {intel.analysis?.riskReasons?.map((r: string, i: number) => (
                        <li key={i} style={{ marginBottom: 4 }}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 900, marginTop: 10, marginBottom: -5 }}>📊 Department Kundli</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.sub, fontWeight: 800, textTransform: "uppercase", marginBottom: 6 }}>Total Live Tenders</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>{intel.totalLive || 0}</div>
                  </div>
                  <div style={{ background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.sub, fontWeight: 800, textTransform: "uppercase", marginBottom: 6 }}>Past Tenders</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.warning }}>{intel.totalPast || 0}</div>
                  </div>
                  <div style={{ background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 10, color: C.sub, fontWeight: 800, textTransform: "uppercase", marginBottom: 6 }}>Payment Reliability</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.success }}>{intel.analysis?.paymentRating || "Standard Terms"}</div>
                  </div>
                </div>

                <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 20 }}>🏆</span>
                    <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>Top Competitors (Award History)</div>
                  </div>
                  {intel.analysis?.competitors && intel.analysis.competitors.length > 0 ? (
                    intel.analysis.competitors.map((c: any, i: number) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i !== intel.analysis.competitors.length - 1 ? `1px solid ${C.border}` : "none", padding: "12px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 24, height: 24, background: i === 0 ? "#fef3c7" : "#f1f5f9", color: i === 0 ? "#d97706" : "#64748b", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{i+1}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, maxWidth: "180px", wordBreak: "break-word" }}>{c.winner_name || c.winner || "Unknown Vendor"}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: C.success }}>{c.wins || c.won} Wins</div>
                          <div style={{ fontSize: 11, color: C.sub }}>{formatCurrency(c.won_value || c.amount)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 12, color: C.sub, fontStyle: "italic", background: "#f8fafc", padding: 15, borderRadius: 8, textAlign: "center" }}>Insufficient historical data.</div>
                  )}
                </div>

                <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#8b5cf6", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>📋</span> Recommended Next Steps
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: C.text, lineHeight: 1.7 }}>
                    {intel.analysis?.nextActions?.map((action: string, i: number) => (
                      <li key={i} style={{ marginBottom: 8 }}>{action}</li>
                    )) || <li>Review official tender documents carefully.</li>}
                  </ul>
                </div>
              </>
            ) : (
              <div style={{ color: C.sub, fontSize: 13, textAlign: "center", padding: 40, background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>No AI Intel data available.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
