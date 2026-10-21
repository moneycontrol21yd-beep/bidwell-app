"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import CyberDeskCard from "@/components/CyberDeskCard";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", accent: "#818CF8", border: "rgba(255,255,255,0.1)" };

export default function FastRecordPage() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 20px" }}>
        <Link href="/brain" style={{ textDecoration: "none", color: C.accent, fontSize: 12, fontWeight: 800, display: "inline-block", marginBottom: 12 }}>
          ← Back to Brain
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Fast Record & AI Desk</h1>
        <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>Urgent tenders, Document scanning & Cyber AI</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* AI Scanner Button */}
        <div style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
              📸 AI Tender Scanner
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              Scan Document or PDF for Instant Audit
            </div>
          </div>
          <button onClick={() => setShowScanner(true)} style={{ background: "#fff", color: "#1E1B4B", border: "none", padding: "10px 16px", borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
            Open Scanner
          </button>
        </div>

        {/* Cyber AI Desk Card (From VPS) */}
        <CyberDeskCard />
        
        {/* Urgent Tenders List (Placeholder for Fast Record) */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>⏰ Closing Soon Tenders</div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
             <div style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B" }}>Loading urgent tenders...</div>
             <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>System is fetching high priority items from VPS Brain.</div>
          </div>
        </div>
      </div>

      {/* Scanner Modal (Camera/PDF) */}
      {showScanner && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ background: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 900 }}>Select Scan Option</div>
              <button onClick={() => setShowScanner(false)} style={{ background: "transparent", border: "none", color: C.sub, fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button style={{ background: C.bg, border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", alignItems: "center", gap: 16, color: "#fff" }}>
                <span style={{ fontSize: 24 }}>📸</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Camera Capture</div>
                  <div style={{ fontSize: 12, color: C.sub }}>Take a photo of Notice or BOQ</div>
                </div>
              </button>
              <button style={{ background: C.bg, border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", alignItems: "center", gap: 16, color: "#fff" }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Upload PDF File</div>
                  <div style={{ fontSize: 12, color: C.sub }}>Choose NIT / BOQ PDF from device</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}
