"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function BidPreparePage() {
  const params = useParams();
  const tenderId = params?.id as string;
  const [tender, setTender] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const defaultChecks = [
    { key: "profile", label: "Company Profile & Turnover verified", req: true },
    { key: "gst", label: "GST & PAN Certificates attached", req: true },
    { key: "emd", label: "EMD / Bid Security ready", req: true },
    { key: "docs", label: "Technical Documents (ISO/PSARA/etc)", req: false },
    { key: "financial", label: "Financial Bid Document prepared", req: true },
  ];

  useEffect(() => {
    if (tenderId) {
      fetch(`/api/tenders/${encodeURIComponent(tenderId)}`)
        .then(r => r.json())
        .then(d => setTender(d.tender || d))
        .catch(() => {});
    }
    try {
      const stored = localStorage.getItem("company");
      if (stored) setCompany(JSON.parse(stored));
    } catch {}
  }, [tenderId]);

  const toggle = (k: string) => setChecked(p => ({ ...p, [k]: !p[k] }));
  const completed = defaultChecks.filter(c => checked[c.key]).length;
  const progress = Math.round((completed / defaultChecks.length) * 100);

  const portalUrl = tender?.source_url || (tender?.source === "CPPP" ? "https://eprocure.gov.in/cppp/" : "#");

  return (
    <main style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "system-ui", paddingBottom: 120 }}>
      <div style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)", padding: "20px 18px 24px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Link href={`/tenders/${tenderId}`} style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#C7D2FE" }}>← BACK TO TENDER</Link>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: "10px 0 6px" }}>Bid Preparation</h1>
        <p style={{ fontSize: 12, color: "#E0E7FF", margin: 0 }}>Auto-filled for {company?.name || "Your Company"}</p>
      </div>

      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: C.muted }}>PREPARATION PROGRESS</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#60A5FA" }}>{progress}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(99,102,241,0.15)", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6366F1, #A855F7)", borderRadius: 4, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: C.muted, letterSpacing: 1, marginBottom: 10 }}>REQUIRED DOCUMENTS</div>
        {defaultChecks.map((doc) => {
          const done = checked[doc.key];
          return (
            <div key={doc.key} onClick={() => toggle(doc.key)} style={{ background: C.card, borderRadius: 14, padding: 14, marginBottom: 8, border: `1px solid ${done ? "rgba(34,197,94,0.5)" : "rgba(99,102,241,0.15)"}`, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${done ? "#22C55E" : "rgba(99,102,241,0.4)"}`, background: done ? "#22C55E" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>
                {done ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{doc.label}</div>
                {doc.req && <div style={{ fontSize: 9.5, color: "#F59E0B", marginTop: 3, fontWeight: 800 }}>MANDATORY</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "0 18px", marginBottom: 20 }}>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#10B981", fontWeight: 700, textAlign: "center" }}>Note: You will be redirected to the official government portal to upload these documents and submit your bid.</div>
        </div>
        <a href={portalUrl} target="_blank" rel="noopener noreferrer" style={{ ...LINK, display: "block" }}>
          <button style={{ width: "100%", background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", color: "#fff", border: "none", borderRadius: 16, padding: "16px", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 18px rgba(16,185,129,0.35)" }}>
            🚀 Go to Official Portal & Submit
          </button>
        </a>
      </div>

      <BottomNav />
    </main>
  );
}
