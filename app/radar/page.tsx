"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function OpportunityRadarPage() {
  const [activeTab, setActiveTab] = useState("For Me");

  const mockTenders = [
    {
      id: "2026_MP_001",
      department: "HEALTH DEPARTMENT MP",
      title: "Provide Manpower & Security Services at Civil Hospital",
      value: "₹1.8 Cr",
      deadline: "30 Oct 2026",
      match: 92,
      type: "For Me"
    },
    {
      id: "2026_MP_002",
      department: "SMART CITY INDORE",
      title: "Supply of CCTV Cameras and Facility Monitoring Setup",
      value: "₹3.2 Cr",
      deadline: "22 Oct 2026",
      match: 88,
      type: "For Me"
    },
    {
      id: "2026_MP_003",
      department: "PWD MP",
      title: "Construction of 4 Lane Road from X to Y",
      value: "₹12.5 Cr",
      deadline: "15 Nov 2026",
      match: 85,
      type: "Upcoming"
    }
  ];

  const filtered = activeTab === "For Me" 
    ? mockTenders.filter(t => t.type === "For Me")
    : activeTab === "Upcoming"
    ? mockTenders.filter(t => t.type === "Upcoming")
    : []; // Ending soon logic can be added here

  return (
    <main style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 100, fontFamily: "system-ui, sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ padding: "30px 20px 20px" }}>
        <Link href="/dashboard" style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#818CF8", letterSpacing: 1 }}>← BACK TO DASHBOARD</Link>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "14px 0 8px" }}>Opportunity Radar</h1>
        <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.4 }}>Smart radar highlighting high-match opportunities tailored for your company.</p>
      </div>

      {/* TABS */}
      <div style={{ padding: "0 20px 20px", overflowX: "auto", display: "flex", gap: 10 }}>
        {["For Me", "Upcoming", "Ending Soon"].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: "10px 16px", 
              borderRadius: 12, 
              background: activeTab === tab ? "linear-gradient(135deg,#6366F1,#A855F7)" : C.card, 
              border: `1px solid ${activeTab === tab ? "transparent" : "rgba(99,102,241,0.2)"}`, 
              color: "#fff", 
              fontSize: 12, 
              fontWeight: 800, 
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TENDERS LIST */}
      <div style={{ padding: "0 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>No opportunities in this category yet.</div>
        ) : (
          filtered.map((tender, i) => (
            <Link href={`/tenders/${tender.id}`} key={i} style={{ ...LINK, display: "block", marginBottom: 16 }}>
              <div style={{ background: C.card, border: "1px solid rgba(99,102,241,0.2)", borderRadius: 18, padding: 18, position: "relative", overflow: "hidden" }}>
                
                {/* Match Badge */}
                <div style={{ position: "absolute", top: 18, right: 18, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 10 }}>
                  {tender.match}% Match
                </div>

                {/* Department */}
                <div style={{ fontSize: 10, fontWeight: 900, color: "#818CF8", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8, paddingRight: 80 }}>
                  {tender.department}
                </div>

                {/* Title */}
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.4, marginBottom: 16 }}>
                  {tender.title}
                </div>

                {/* Value & Deadline Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 12 }}>
                    <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 800 }}>VALUE</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#60A5FA", marginTop: 4 }}>{tender.value}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 12 }}>
                    <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 800 }}>DEADLINE</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#F59E0B", marginTop: 4 }}>{tender.deadline}</div>
                  </div>
                </div>

                {/* CTA Button */}
                <div style={{ width: "100%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#A5B4FC", textAlign: "center", padding: "12px 0", borderRadius: 12, fontSize: 12, fontWeight: 800 }}>
                  View Details & Analysis →
                </div>

              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNav />
    </main>
  );
}
