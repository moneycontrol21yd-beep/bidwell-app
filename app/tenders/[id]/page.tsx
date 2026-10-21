"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#f5f7fb", card: "#fff", text: "#17233b", sub: "#8792a5", accent: "#315efb", border: "#e8edf5" };

export default function TenderDetailPage() {
  const params = useParams();
  const tenderId = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", color: C.text, padding: 20, textAlign: "center", fontSize: 14 }}>Loading...</div>;
  if (!tender) return <div style={{ background: C.bg, minHeight: "100vh", color: "#EF4444", padding: 20, textAlign: "center", fontSize: 14 }}>Tender not found</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: "80px", overflowX: "hidden" }}>
      
      <div style={{ background: "linear-gradient(135deg, #4338CA 0%, #1E1B4B 100%)", padding: "24px 20px", color: "#fff" }}>
        <Link href="/dashboard" style={{ color: "#C7D2FE", fontSize: 11, fontWeight: 800, textDecoration: "none", display: "inline-block", marginBottom: 12 }}>← Back to Workspace</Link>
        <h1 style={{ fontSize: 18, fontWeight: 900, margin: "10px 0 0 0", lineHeight: 1.3 }}>{tender.title}</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ background: C.card, padding: 20, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, paddingBottom: 15, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.sub, fontSize: 12 }}>Department</span>
            <span style={{ fontWeight: 700, fontSize: 12, textAlign: "right", maxWidth: "60%" }}>{tender.org_name || "N/A"}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, paddingBottom: 15, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.sub, fontSize: 12 }}>Closing Date</span>
            <span style={{ fontWeight: 700, fontSize: 12, color: "#ea580c" }}>{tender.closing_date || "N/A"}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, paddingBottom: 15, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.sub, fontSize: 12 }}>EMD Amount</span>
            <span style={{ fontWeight: 700, fontSize: 12 }}>{tender.emd || "Check Portal"}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.sub, fontSize: 12 }}>Tender Value</span>
            <span style={{ fontWeight: 700, fontSize: 12 }}>{tender.value || "Check Portal"}</span>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <a href={tender.source_url || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: C.accent, color: "#fff", padding: "14px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            Visit Official Portal ↗
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
