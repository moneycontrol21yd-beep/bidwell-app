"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

const CHECKS = [
  { key: "gst", label: "GST Registration Certificate", required: true },
  { key: "pan", label: "PAN Card", required: true },
  { key: "iso", label: "ISO 9001:2015 Certificate", required: false },
  { key: "psara", label: "PSARA License", required: false },
  { key: "msme", label: "MSME / Udyam Registration", required: false },
  { key: "turnover", label: "Turnover Certificate (CA certified)", required: true },
  { key: "experience", label: "Past Experience Certificates", required: true },
  { key: "emd", label: "EMD / Bid Security", required: true },
  { key: "technical", label: "Technical Bid Document", required: true },
  { key: "financial", label: "Financial Bid Document", required: true },
];

export default function BidPreparePage() {
  const params = useParams();
  const tenderId = params?.id as string;
  const [tender, setTender] = useState<any>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!tenderId) return;
    fetch(`/api/tenders/${tenderId}`).then(r => r.json()).then(d => setTender(d.tender || d)).catch(() => {});
    const stored = localStorage.getItem(`bid_prep_${tenderId}`);
    if (stored) { try { setChecked(JSON.parse(stored)); } catch {} }
  }, [tenderId]);

  const toggle = (k: string) => setChecked(p => ({ ...p, [k]: !p[k] }));
  const completed = CHECKS.filter(c => checked[c.key]).length;
  const requiredCount = CHECKS.filter(c => c.required).length;
  const requiredDone = CHECKS.filter(c => c.required && checked[c.key]).length;
  const progress = Math.round((completed / CHECKS.length) * 100);

  const save = () => {
    localStorage.setItem(`bid_prep_${tenderId}`, JSON.stringify(checked));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: 100 }}>
      <div style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)", padding: "20px 18px 24px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(139,92,246,0.5)", filter: "blur(50px)" }} />
        <div style={{ position: "relative" }}>
          <Link href={`/tenders/${tenderId}`} style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#C7D2FE", letterSpacing: 1 }}>← BACK TO TENDER</Link>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "10px 0 6px", lineHeight: 1.2 }}>Bid Preparation</h1>
          <p style={{ fontSize: 12, color: "#E0E7FF", margin: 0, lineHeight: 1.4 }}>{tender?.title?.substring(0, 100) || "Loading tender..."}</p>
        </div>
      </div>

      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 16, border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Progress</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#60A5FA" }}>{progress}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(99,102,241,0.15)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6366F1, #A855F7)", transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 11, color: C.sub, marginTop: 8 }}>Mandatory: {requiredDone}/{requiredCount} • Total: {completed}/{CHECKS.length}</div>
        </div>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Document Checklist</div>
        {CHECKS.map(doc => {
          const done = checked[doc.key];
          return (
            <div key={doc.key} onClick={() => toggle(doc.key)} style={{ background: C.card, borderRadius: 14, padding: 14, marginBottom: 8, border: `1px solid ${done ? "rgba(34,197,94,0.5)" : "rgba(99,102,241,0.15)"}`, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${done ? "#22C55E" : "rgba(99,102,241,0.4)"}`, background: done ? "#22C55E" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", flexShrink: 0 }}>
                {done ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{doc.label}</div>
                {doc.required && <div style={{ fontSize: 9.5, color: "#F59E0B", marginTop: 3, fontWeight: 800, letterSpacing: 0.5 }}>MANDATORY</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "8px 18px 20px" }}>
        <button onClick={save} style={{ width: "100%", background: saved ? "#22C55E" : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", color: "#fff", border: "none", borderRadius: 16, padding: "16px", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 18px rgba(59,130,246,0.35)" }}>
          {saved ? "✓ Saved" : "Save Progress"}
        </button>
        <Link href={`/tenders/${tenderId}`} style={{ ...LINK, display: "block", marginTop: 10 }}>
          <button style={{ width: "100%", background: "transparent", color: C.sub, border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            ← Back to Tender
          </button>
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
