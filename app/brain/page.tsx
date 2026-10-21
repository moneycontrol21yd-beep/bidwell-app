import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import CyberDeskCard from '@/components/CyberDeskCard';

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", accent: "#818CF8" };

export default function BrainPage() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#818CF8", color: "#fff", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20 }}>B</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>BidWell</div>
            <div style={{ fontSize: 10, color: C.sub }}>Smarter Tenders. Bigger Opportunities.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 24 }}>🔔</span>
            <div style={{ position: "absolute", top: -5, right: -5, background: "red", color: "white", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: "bold" }}>5</div>
          </div>
          <div style={{ background: "#C084FC", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>BR</div>
        </div>
      </div>

      {/* Hero Tags */}
      <div style={{ padding: "0 20px", display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap" }}>📊 Analysis</div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap" }}>🛡️ Eligibility</div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap" }}>⚡ Fast Track</div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap" }}>📅 Future Tenders</div>
      </div>

      <div style={{ textAlign: "center", fontSize: 10, fontWeight: 800, letterSpacing: 2, color: C.sub, margin: "20px 0" }}>
        THINK · ANALYZE · BID · SUCCEED
      </div>

      {/* Top Scroll Cards */}
      <div style={{ display: "flex", gap: 12, padding: "0 20px", overflowX: "auto", paddingBottom: 20 }}>
        <div style={{ minWidth: 140, background: "linear-gradient(135deg, #6366F1, #4F46E5)", padding: 15, borderRadius: 16 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>🧠</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Brain</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>AI Insights</div>
        </div>
        <div style={{ minWidth: 140, background: C.card, border: "1px solid rgba(255,255,255,0.1)", padding: 15, borderRadius: 16 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>📄</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Live Tenders</div>
          <div style={{ fontSize: 10, color: C.sub }}>Current Opportunities</div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px" }}>
        
        <div style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160 }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>📊</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Tender Analysis</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>AI based insights on tenders, market & competition.</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, textAlign: "center", marginTop: 10 }}>View Analysis →</div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #10B981, #047857)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160 }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>🛡️</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Eligibility Check</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>Know if you're eligible in seconds.</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, textAlign: "center", marginTop: 10 }}>Check Eligibility →</div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #F59E0B, #B45309)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160 }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>⚡</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Fast Record</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>Quick view of high priority, urgent & closing soon tenders.</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, textAlign: "center", marginTop: 10 }}>View Fast Record →</div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #EC4899, #BE185D)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160 }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>📅</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Future Record</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>Upcoming tenders & project forecasts (Central/State/UT).</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, textAlign: "center", marginTop: 10 }}>Explore Future Tenders →</div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160 }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>🤖</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>AI Suggestions</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>Personalized tender recommendations for your business.</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, textAlign: "center", marginTop: 10 }}>Get Recommendations →</div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #14B8A6, #0F766E)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160 }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>🇮🇳</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>India Wide Coverage</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>Central + State + UT. All in one place.</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, textAlign: "center", marginTop: 10 }}>Explore All →</div>
        </div>
      </div>

      {/* 🚀 NAYA CYBER AI DESK CARD YAHAN ADD HO GAYA HAI */}
      <div style={{ padding: "20px 20px 0 20px" }}>
        <CyberDeskCard />
      </div>

      {/* Brain Insights */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>🧠 Brain Insights</div>
            <div style={{ fontSize: 11, color: C.sub }}>Top Insights for You</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 800 }}>View All →</div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
           <div style={{ background: C.card, border: "1px solid rgba(255,255,255,0.1)", padding: 16, borderRadius: 16 }}>
             <div style={{ fontSize: 20, marginBottom: 10 }}>📈</div>
             <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>High Demand Sectors</div>
             <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.8 }}>• Roads & Highways<br/>• Construction<br/>• Health & Medical<br/>• IT & Software</div>
           </div>
           <div style={{ background: C.card, border: "1px solid rgba(255,255,255,0.1)", padding: 16, borderRadius: 16 }}>
             <div style={{ fontSize: 20, marginBottom: 10 }}>🏢</div>
             <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Best Winning Chances</div>
             <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.8 }}>• Low Competition<br/>• High Value</div>
             <div style={{ background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", border: "1px solid #F59E0B", padding: "6px", borderRadius: 8, fontSize: 10, fontWeight: 800, textAlign: "center", marginTop: 12 }}>✨ Your Advantage</div>
           </div>
        </div>
      </div>
      
      {/* Closing Soon & Upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px 20px 20px" }}>
        <div style={{ background: C.card, border: "1px solid rgba(255,255,255,0.1)", padding: 16, borderRadius: 16 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>⏰</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Closing Soon</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#3B82F6", marginTop: 10 }}>0</div>
          <div style={{ fontSize: 11, color: C.sub }}>Live Tenders</div>
        </div>
        <div style={{ background: C.card, border: "1px solid rgba(255,255,255,0.1)", padding: 16, borderRadius: 16 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>📅</div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Upcoming Projects</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#8B5CF6", marginTop: 10 }}>AI</div>
          <div style={{ fontSize: 11, color: C.sub }}>Predictions</div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
