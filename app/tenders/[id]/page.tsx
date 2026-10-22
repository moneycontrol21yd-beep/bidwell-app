"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const C = { bg: "#f5f7fb", card: "#ffffff", text: "#17233b", sub: "#64748b", accent: "#315efb", border: "#e2e8f0", success: "#10b981", danger: "#ef4444", warning: "#f59e0b" };

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "intel">("overview");
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [workspaceMsg, setWorkspaceMsg] = useState("");

  const [intel, setIntel] = useState<any>(null);
  const [intelLoading, setIntelLoading] = useState(false);

  const [showJVModal, setShowJVModal] = useState(false);
  const [jvPartners, setJvPartners] = useState<any[]>([]);
  const [jvLoading, setJvLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    if (!tenderId) return;
    fetch(`/api/tender-detail?id=${encodeURIComponent(tenderId)}`)
      .then(r => r.json())
      .then(d => { if (d.success) setTender(d.tender); setLoading(false); })
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

  const handleAddToWorkspace = async () => {
    if (!tender) return;
    const finalTenderId = tender.source_tender_id || tender.id || tenderId;
    
    setSaving(true);
    setWorkspaceMsg("");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({
          tender_id: finalTenderId,
          title: tender.title || "Untitled Tender",
          org_name: tender.org_name || "Unknown",
          value: tender.value || "N/A",
          closing_date: tender.closing_date || "N/A"
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setWorkspaceMsg("✅ Successfully added to your Bid Workspace!");
        setTimeout(() => setWorkspaceMsg(""), 3000);
      } else {
        setWorkspaceMsg("❌ Error: " + data.error);
      }
    } catch (e) { 
      setWorkspaceMsg("❌ Error connecting to server."); 
    }
    setSaving(false);
  };

  const handleOpenTenderJV = async () => {
    setShowJVModal(true);
    setSelectedPartner(null);
    setRequestSent(false);
    setDraftText("");
    if (jvPartners.length === 0) {
      setJvLoading(true);
      try {
        const res = await fetch(`/api/jv-search?tender_value=${tender?.value || 0}`);
        const data = await res.json();
        if (data.success) setJvPartners(data.partners);
      } catch (e) {}
      setJvLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedPartner) return;
    setDraftLoading(true);
    try {
      const res = await fetch("/api/jv-draft", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName: "Your Company", senderGst: "YOUR_GST", partnerName: selectedPartner.vendor_name, partnerGst: "PARTNER_GST" })
      });
      const data = await res.json();
      if (data.success) setDraftText(data.draft);
      else alert("Failed to generate draft.");
    } catch (e) { alert("Error generating draft."); }
    setDraftLoading(false);
  };

  const formatCurrency = (amount: any) => {
    if (!amount || amount === "N/A" || amount === "0" || amount === null) return "Check Portal";
    const num = parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return String(amount);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  if (!tender) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Tender Not Found</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: "40px", fontFamily: "system-ui" }}>
      
      {/* JV Modal */}
      {showJVModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 550, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: 20, borderBottom: "1px solid #e8edf5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#17233b" }}>🤝 JV for this Tender</div></div>
              <button onClick={() => setShowJVModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {jvLoading ? <div style={{ textAlign: "center", padding: 30 }}>Finding partners...</div> : selectedPartner ? (
                <div>
                  <button onClick={() => setSelectedPartner(null)} style={{ background: "none", border: "none", color: "#315efb", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>← Back</button>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{selectedPartner.vendor_name}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16 }}>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}><div style={{ fontSize: 10, color: "#64748b" }}>Turnover</div><div style={{ fontSize: 14, fontWeight: 800 }}>₹{(selectedPartner.total_value / 10000000).toFixed(2)} Cr</div></div>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}><div style={{ fontSize: 10, color: "#64748b" }}>Wins</div><div style={{ fontSize: 14, fontWeight: 800 }}>{selectedPartner.total_wins} Tenders</div></div>
                  </div>
                  {draftText ? (
                    <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap", fontSize: 12, border: "1px solid #e2e8f0" }}>{draftText}<button onClick={() => window.print()} style={{ marginTop: 12, background: "#315efb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, width: "100%", fontWeight: 700 }}>🖨️ Print / Save PDF</button></div>
                  ) : (
                    <button onClick={handleGenerateDraft} disabled={draftLoading} style={{ width: "100%", background: "#f1f5f9", color: "#315efb", border: "1px dashed #cbd5e1", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>
                      {draftLoading ? "⏳ Generating..." : "📝 Auto-Draft JV Agreement"}
                    </button>
                  )}
                  {!requestSent ? (
                    <button onClick={() => setRequestSent(true)} style={{ width: "100%", background: "#315efb", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer", marginTop: 12 }}>Send JV Request</button>
                  ) : (
                    <div style={{ background: "#ecfdf5", padding: 12, borderRadius: 8, textAlign: "center", color: "#065f46", fontWeight: 800, marginTop: 12 }}>✅ Request Sent Successfully!</div>
                  )}
                </div>
              ) : (
                jvPartners.map((p, i) => (
                  <div key={i} style={{ border: "1px solid #e8edf5", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{p.vendor_name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{p.sector} · {p.state}</div>
                    <button onClick={() => setSelectedPartner(p)} style={{ background: "#f1f5f9", color: "#315efb", border: "none", padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 8, width: "100%" }}>View & Connect</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "20px" }}>
        <button onClick={() => router.back()} style={{ color: C.accent, fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>← Back</button>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.4 }}>{tender.title}</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: C.card, borderBottom: `1px solid ${C.border}`, padding: "0 20px" }}>
        <button onClick={() => setActiveTab("overview")} style={{ flex: 1, padding: "16px 0", background: "none", border: "none", borderBottom: activeTab === "overview" ? `2px solid ${C.accent}` : "2px solid transparent", color: activeTab === "overview" ? C.accent : C.sub, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Overview</button>
        <button onClick={() => setActiveTab("intel")} style={{ flex: 1, padding: "16px 0", background: "none", border: "none", borderBottom: activeTab === "intel" ? `2px solid ${C.accent}` : "2px solid transparent", color: activeTab === "intel" ? C.accent : C.sub, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>AI Intel</button>
      </div>

      <div style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.sub, marginBottom: 16 }}>TENDER DETAILS</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span>Department</span><b>{tender.org_name}</b></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span>Value</span><b style={{ color: C.accent }}>{formatCurrency(tender.value)}</b></div>
            </div>

            {workspaceMsg && <div style={{ background: workspaceMsg.includes("✅") ? "#ecfdf5" : "#fef2f2", color: workspaceMsg.includes("✅") ? "#065f46" : "#991b1b", padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>{workspaceMsg}</div>}

            <button onClick={handleAddToWorkspace} disabled={saving || saved} style={{ width: "100%", background: saved ? "#10b981" : C.accent, color: "#fff", border: "none", padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: saved ? "default" : "pointer", marginBottom: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              {saving ? "Saving..." : saved ? "✅ Added to Workspace" : "➕ Track this Tender in Workspace"}
            </button>

            <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", padding: 20, borderRadius: 16, textAlign: "center", color: "#fff" }}>
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Need help winning this tender?</div>
              <button onClick={handleOpenTenderJV} style={{ background: "#fff", color: "#1e1b4b", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 800, cursor: "pointer", width: "100%" }}>🤝 Find JV Partner for this Tender</button>
            </div>
          </>
        )}

        {/* AI INTEL TAB (Master Report) */}
        {activeTab === "intel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {intelLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: C.sub }}>Generating Consultant Report from VPS Brain...</div>
            ) : intel ? (
              <>
                {/* 1. Verdict & Risk */}
                <div style={{ background: C.card, border: `2px solid ${intel.analysis?.verdictColor || C.border}`, padding: 20, borderRadius: 16, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: intel.analysis?.verdictColor || C.accent }} />
                  <div style={{ fontSize: 11, color: C.sub, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>AI Consultant Verdict</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: intel.analysis?.verdictColor || C.text, marginBottom: 12 }}>{intel.analysis?.verdict || "REVIEW REQUIRED"}</div>
                  
                  <div style={{ background: "#f8fafc", padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.sub, marginBottom: 8, textTransform: "uppercase" }}>Risk Factors:</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                      {intel.analysis?.riskReasons?.map((r: string, i: number) => (<li key={i} style={{ marginBottom: 4 }}>{r}</li>))}
                    </ul>
                  </div>

                  <div style={{ background: "#f0fdf4", padding: 14, borderRadius: 10, border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", marginBottom: 8, textTransform: "uppercase" }}>Next Recommended Actions:</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#14532d", lineHeight: 1.6 }}>
                      {intel.analysis?.nextActions?.map((action: string, i: number) => (<li key={i} style={{ marginBottom: 4 }}>{action}</li>))}
                    </ul>
                  </div>
                </div>

                {/* 2. Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.sub, fontWeight: 800, textTransform: "uppercase" }}>Total Live Tenders</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>{intel.totalLive || 0}</div>
                  </div>
                  <div style={{ background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.sub, fontWeight: 800, textTransform: "uppercase" }}>Past Tenders</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.warning }}>{intel.totalPast || 0}</div>
                  </div>
                  <div style={{ background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 10, color: C.sub, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>Payment Reliability</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.success }}>{intel.analysis?.paymentRating || "Standard Terms"}</div>
                  </div>
                </div>

                {/* 3. Competitors */}
                <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#f59e0b", marginBottom: 16 }}>🏆 Top Competitors (Award History)</div>
                  {intel.analysis?.competitors?.length > 0 ? intel.analysis.competitors.map((c: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: i !== intel.analysis.competitors.length - 1 ? `1px solid ${C.border}` : "none", padding: "12px 0" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{c.winner_name || "Unknown"}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: C.success }}>{c.wins || 0} Wins</div>
                    </div>
                  )) : <div style={{ fontSize: 12, color: C.sub }}>Insufficient data.</div>}
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
