"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const C = { 
  bg: "#f5f7fb", card: "#ffffff", text: "#17233b", sub: "#64748b", accent: "#315efb", border: "#e2e8f0", success: "#10b981"
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
    const num = parseFloat(amount);
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
        <button onClick={() => setActiveTab("intel")} style={{ flex: 1, padding: "16px 0", background: "none", border: "none", borderBottom: activeTab === "intel" ? `2px solid ${C.accent}` : "2px solid transparent", color: activeTab === "intel" ? C.accent : C.sub, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>✳ AI Intel</button>
      </div>

      <div style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
        {activeTab === "overview" && (
          <>
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.sub, textTransform: "uppercase", marginBottom: 16 }}>Tender Information</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${C.border}`, paddingBottom: 14 }}><span style={{ color: C.sub, fontSize: 13 }}>Department</span><span style={{ fontWeight: 700, fontSize: 13, textAlign: "right", maxWidth: "65%" }}>{tender.org_name || "N/A"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${C.border}`, paddingBottom: 14 }}><span style={{ color: C.sub, fontSize: 13 }}>Location / State</span><span style={{ fontWeight: 700, fontSize: 13, textAlign: "right", maxWidth: "65%" }}>{tender.state || "All India"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub, fontSize: 13 }}>Bid Submission Deadline</span><span style={{ fontWeight: 800, fontSize: 13, color: "#ef4444", background: "#fef2f2", padding: "4px 8px", borderRadius: 6, border: "1px solid #fecaca" }}>{formatDate(tender.closing_date)}</span></div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20 }}><div style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: "uppercase", marginBottom: 8 }}>Tender Value</div><div style={{ fontSize: 18, fontWeight: 900 }}>{formatCurrency(tender.value)}</div></div>
              <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20 }}><div style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: "uppercase", marginBottom: 8 }}>EMD Amount</div><div style={{ fontSize: 18, fontWeight: 900 }}>{formatCurrency(tender.emd)}</div></div>
            </div>
            <a href={tender.source_url || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", background: C.accent, color: "#fff", padding: "14px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 800, textAlign: "center" }}>Visit Official Portal ↗</a>
          </>
        )}

        {activeTab === "intel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {intelLoading ? <div style={{ textAlign: "center", padding: 40, color: C.sub }}>Analyzing Tender Data...</div> : intel ? (
              <>
                <div style={{ background: C.card, border: `1px solid ${intel.analysis?.verdictColor || C.border}`, padding: 20, borderRadius: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: intel.analysis?.verdictColor || C.text, marginBottom: 12 }}>{intel.analysis?.verdict || "REVIEW REQUIRED"}</div>
                  <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.sub, marginBottom: 6, textTransform: "uppercase" }}>Risk Factors:</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: C.text, lineHeight: 1.6 }}>{intel.analysis?.riskReasons?.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
                  </div>
                </div>
                <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#f59e0b", marginBottom: 16 }}>Award History</div>
                  {intel.analysis?.competitors?.length > 0 ? intel.analysis.competitors.map((c: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{c.winner_name || "Unknown"}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: C.success }}>{c.wins || 0} Wins</div>
                    </div>
                  )) : <div style={{ fontSize: 12, color: C.sub, fontStyle: "italic" }}>Insufficient data.</div>}
                </div>
              </>
            ) : <div style={{ color: C.sub, textAlign: "center" }}>No intel data available.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
