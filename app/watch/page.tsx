"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };

export default function FutureRadarPage() {
  const [keyword, setKeyword] = useState("road");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/future-radar?keyword=${encodeURIComponent(keyword)}`);
      const d = await res.json();
      if (d.success) setData(d.radar_data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getMonthName = (m: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[m - 1] || "Unknown";
  };

  return (
    <main style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 100, fontFamily: "system-ui" }}>
      
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)", padding: "30px 20px 25px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Link href="/dashboard" style={{ textDecoration: "none", color: "#C7D2FE", fontSize: 11, fontWeight: 800 }}>← DASHBOARD</Link>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: "10px 0 6px" }}>Future Radar</h1>
        <p style={{ fontSize: 12, color: "#E0E7FF", margin: 0 }}>AI-driven predictions based on historical cycles.</p>
      </div>

      {/* SEARCH */}
      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ background: C.card, border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 12, display: "flex", gap: 10 }}>
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. road, construction, IT..." 
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", outline: "none", fontSize: 13 }}
          />
          <button onClick={handleSearch} style={{ background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", padding: "10px 16px", borderRadius: 10, color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
            Predict
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ padding: "20px 18px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>Analyzing historical patterns...</div>
        ) : !hasSearched ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            Enter a keyword above to predict upcoming tender cycles.
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            No strong historical patterns found for this keyword.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: C.muted, letterSpacing: 1, marginBottom: 4 }}>PREDICTED OPPORTUNITIES</div>
            
            {data.map((item, i) => (
              <div key={i} style={{ background: C.card, border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{item.department}</div>
                  <div style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 10, border: "1px solid rgba(245,158,11,0.3)" }}>
                    ⚡ FORECAST
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: 10, borderRadius: 10 }}>
                    <div style={{ fontSize: 10, color: C.muted }}>EXPECTED MONTH</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#60A5FA", marginTop: 4 }}>{getMonthName(item.predicted_month)}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: 10, borderRadius: 10 }}>
                    <div style={{ fontSize: 10, color: C.muted }}>CONFIDENCE</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: item.confidence === "High" ? "#10B981" : "#F59E0B", marginTop: 4 }}>{item.confidence}</div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.4 }}>
                  <span style={{ color: "#818CF8", fontWeight: 700 }}>Evidence:</span> {item.historical_evidence}
                </div>
              </div>
            ))}
            
            <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: 14, marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "#A5B4FC", fontWeight: 600, textAlign: "center" }}>
                Note: These are AI predictions based on historical trends, not confirmed tenders. We will notify you when the actual tender goes live.
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
