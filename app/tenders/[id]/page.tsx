"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const C = { bg: "#f5f7fb", card: "#ffffff", text: "#17233b", sub: "#64748b", accent: "#315efb", border: "#e2e8f0", success: "#10b981", danger: "#ef4444" };

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "intel">("overview");

  // JV Modal State
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

  const handleOpenTenderJV = async () => {
    setShowJVModal(true);
    setSelectedPartner(null);
    setRequestSent(false);
    setDraftText("");
    
    if (jvPartners.length === 0) {
      setJvLoading(true);
      try {
        // Tender ki value aur sector ke hisaab se match karo
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: "Your Company (BidWell User)", // Baad me profile se lenge
          senderGst: "YOUR_GST",
          partnerName: selectedPartner.vendor_name,
          partnerGst: "PARTNER_GST" // Baad me JV data se lenge
        })
      });
      const data = await res.json();
      if (data.success) setDraftText(data.draft);
      else alert("Failed to generate draft. VPS might be offline.");
    } catch (e) { alert("Error generating draft."); }
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
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#17233b" }}>🤝 JV for this Tender</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Matching based on Tender Value: <b style={{ color: "#315efb" }}>{tender.value ? `₹${tender.value}` : "N/A"}</b></div>
              </div>
              <button onClick={() => setShowJVModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {jvLoading ? (
                <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>Finding perfect partners...</div>
              ) : selectedPartner ? (
                <div>
                  <button onClick={() => { setSelectedPartner(null); setDraftText(""); }} style={{ background: "none", border: "none", color: "#315efb", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>← Back to list</button>
                  
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#17233b" }}>{selectedPartner.vendor_name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 20 }}>{selectedPartner.sector} · {selectedPartner.state}</div>
                  
                  <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Est. Turnover</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>₹{(selectedPartner.total_value / 10000000).toFixed(2)} Cr</div>
                    </div>
                    <div style={{ flex: 1, background: "#f8fafc", padding: 12, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Past Wins</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#10b981" }}>{selectedPartner.total_wins || 0} Tenders</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#17233b", marginBottom: 8 }}>Why this match?</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontSize: 10, background: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>✓ Financial Capability</span>
                      <span style={{ fontSize: 10, background: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>✓ High Experience</span>
                    </div>
                  </div>

                  {draftText ? (
                    <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0", maxHeight: 300, overflowY: "auto", whiteSpace: "pre-wrap", fontSize: 12, color: "#334155" }}>
                      {draftText}
                      <button onClick={() => window.print()} style={{ marginTop: 16, background: "#315efb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>🖨️ Print / Save PDF</button>
                    </div>
                  ) : (
                    <button onClick={handleGenerateDraft} disabled={draftLoading} style={{ width: "100%", background: "#f1f5f9", color: "#315efb", border: "1px dashed #cbd5e1", padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: "pointer", marginBottom: 12 }}>
                      {draftLoading ? "Generating Draft via AI..." : "📄 Generate AI JV Agreement Draft"}
                    </button>
                  )}

                  {!requestSent ? (
                    <button onClick={() => setRequestSent(true)} style={{ width: "100%", background: "#315efb", color: "#fff", border: "none", padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Send JV Request ↗</button>
                  ) : (
                    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: 16, borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#065f46" }}>Request Sent Successfully!</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {jvPartners.map((p, i) => (
                    <div key={i} style={{ border: "1px solid #e8edf5", borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>{p.vendor_name}</div>
                        <div style={{ background: "#e3f7ef", color: "#168363", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>Fit for Tender</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>{p.sector} · {p.state}</div>
                      <button onClick={() => setSelectedPartner(p)} style={{ background: "#f1f5f9", color: "#315efb", border: "none", padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}>View Profile & Generate Agreement</button>
                    </div>
                  ))}
                </div>
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

            {/* NAYA BUTTON: Tender-Specific JV */}
            <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", padding: 20, borderRadius: 16, textAlign: "center", color: "#fff" }}>
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Need help winning this tender?</div>
              <p style={{ fontSize: 12, color: "#c7d2fe", marginBottom: 16 }}>Find a JV partner who meets this tender's financial & technical requirements.</p>
              <button onClick={handleOpenTenderJV} style={{ background: "#fff", color: "#1e1b4b", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 800, cursor: "pointer", width: "100%" }}>🤝 Find JV Partner for this Tender</button>
            </div>
          </>
        )}

        {activeTab === "intel" && (
          <div style={{ textAlign: "center", padding: 40, color: C.sub }}>AI Intel report loading...</div>
        )}
      </div>
    </div>
  );
}
