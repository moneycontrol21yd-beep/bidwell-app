"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import CyberDeskCard from "@/components/CyberDeskCard";

const C = { bg: "#060B28", text: "#fff", card: "#0E1533", accent: "#818CF8" };

export default function Dashboard() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 100 }}>
      
      <div style={{ padding: "30px 18px 20px", background: "linear-gradient(135deg, #4338CA 0%, #1E1B4B 100%)" }}>
        <div style={{ fontSize: 12, color: C.accent, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Welcome Back</div>
        <div style={{ fontSize: 24, fontWeight: 900 }}>BidWell Command Center</div>
      </div>

      <div style={{ padding: "18px", display: "flex", gap: 12 }}>
        <Link href="/tenders" style={{ flex: 1, background: C.card, padding: 16, borderRadius: 16, textDecoration: "none", color: C.text, border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Live Tenders</div>
        </Link>
        <Link href="/assistant" style={{ flex: 1, background: C.card, padding: 16, borderRadius: 16, textDecoration: "none", color: C.text, border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🧠</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>AI Assistant</div>
        </Link>
      </div>

      {/* Yahan naya card add ho raha hai */}
      <div style={{ padding: "0 18px 18px 18px" }}>
        <CyberDeskCard />
      </div>

      <BottomNav />
    </div>
  );
}
