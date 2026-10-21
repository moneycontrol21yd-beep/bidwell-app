import React from "react";

export default function CyberDeskCard() {
  return (
    <div style={{ 
      background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
      borderRadius: 20, 
      padding: 20, 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between",
      marginBottom: 16
    }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.2)", padding: 10, borderRadius: 12 }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
          </div>
          <span style={{ color: "#fff", fontSize: 18 }}>→</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, marginTop: 16, color: "#fff" }}>Cyber AI Desk</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 8, lineHeight: 1.4 }}>
          Smart document gap scanner. Check missing docs (Udyam, GST, DSC) instantly.
        </div>
      </div>
    </div>
  );
}
