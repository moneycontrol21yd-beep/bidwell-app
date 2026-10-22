"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const C = { bg: "#f5f7fb", card: "#ffffff", text: "#17233b", sub: "#64748b", accent: "#315efb", border: "#e2e8f0", success: "#10b981", danger: "#ef4444" };

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "intel">("overview");
  
  // Workspace State
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // JV States (from previous step)
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

  const handleAddToWorkspace = async () => {
    if (!tender) return;
    setSaving(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tender_id: tender.source_tender_id || tender.id,
          title: tender.title,
          org_name: tender.org_name,
          value: tender.value,
          closing_date: tender.closing_date
        })
      });
      const data = await res.json();
      if (data.success) setSaved(true);
    } catch (e) { alert("Error saving to workspace"); }
    setSaving(false);
  };

  // JV Handlers
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
    } catch (e) {}
    setDraftLoading(false);
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
                    <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap", fontSize: 12 }}>{draftText}<button onClick={() => window.print()} style={{ marginTop: 16, background: "#315efb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6 }}>Print</button></div>
                  ) : (
                    <button onClick={handleGenerateDraft} disabled={draftLoading} style={{ width: "100%", background: "#f1f5f9", color: "#315efb", border: "1px dashed #cbd5e1", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>{draftLoading ? "Generating..." : "📄 Generate AI Draft"}</button>
                  )}
                  {!requestSent ? <button onClick={() => setRequestSent(true)} style={{ width: "100%", background: "#315efb", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 800, cursor: "pointer", marginTop: 12 }}>Send Request</button> : <div style={{ background: "#ecfdf5", padding: 12, borderRadius: 8, textAlign: "center", color: "#065f46", fontWeight: 800, marginTop: 12 }}>✅ Request Sent!</div>}
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
        {activeTab === "overview" && (
          <>
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.sub, marginBottom: 16 }}>TENDER DETAILS</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span>Department</span><b>{tender.org_name}</b></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span>Value</span><b style={{ color: C.accent }}>₹{tender.value ? Number(tender.value).toLocaleString('en-IN') : "N/A"}</b></div>
            </div>

            {/* NAYA: Add to Workspace Button */}
            <button onClick={handleAddToWorkspace} disabled={saving || saved} style={{ width: "100%", background: saved ? "#10b981" : C.accent, color: "#fff", border: "none", padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: saved ? "default" : "pointer", marginBottom: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              {saving ? "Saving..." : saved ? "✅ Added to Bid Workspace" : "➕ Add to Bid Workspace"}
            </button>

            {/* Tender-Specific JV */}
            <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", padding: 20, borderRadius: 16, textAlign: "center", color: "#fff" }}>
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Need help winning this tender?</div>
              <button onClick={handleOpenTenderJV} style={{ background: "#fff", color: "#1e1b4b", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 800, cursor: "pointer", width: "100%" }}>🤝 Find JV Partner for this Tender</button>
            </div>
          </>
        )}
        {activeTab === "intel" && <div style={{ textAlign: "center", padding: 40, color: C.sub }}>AI Intel report loading...</div>}
      </div>
    </div>
  );
}
