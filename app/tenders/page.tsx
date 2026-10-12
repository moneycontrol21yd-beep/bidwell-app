import React from 'react';
import TenderIntel from '../components/TenderIntel';
import DocumentScanner from '../components/DocumentScanner';

export default function TenderDetailsPage() {
  const intelData = {
    tenderId: "UP-PWD-2026-99041",
    winProbability: 88,
    l1PriceEstimate: "4,80,000",
    topCompetitors: ["Pratapgarh Local Builders", "Shree Ram Construction", "L&T Infra"],
    missingDocs: [
      "Latest GST Return (3B) for Q3 mandatory",
      "Valid District Registration Certificate needed",
      "EMD Deposit Slip format as per Annexure A"
    ],
    riskWarnings: [
      "Similar work value must be >= ₹2.5 Lakhs in last 3 years",
      "Turnover shortfall > 20% leads to immediate rejection"
    ],
    futureTrend: "Is department ka budget Q4 me 25% increase ho raha hai. Is zone me pichle 5 me se 4 tenders L1 bid pe hit hue hain."
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">Live Tender Intelligence</span>
        <h1 className="text-2xl font-black mt-1">Interlocking & Drainage Work - Pratapgarh Block</h1>
        <p className="text-sm text-slate-400 mt-1">Tender ID: {intelData.tenderId} | Value Range: Micro to Mega</p>
      </div>

      {/* Smart Camera & PDF Scanner */}
      <DocumentScanner />

      {/* Intelligence Dashboard */}
      <TenderIntel 
        tenderId={intelData.tenderId}
        winProbability={intelData.winProbability}
        l1PriceEstimate={intelData.l1PriceEstimate}
        topCompetitors={intelData.topCompetitors}
        riskWarnings={intelData.riskWarnings}
        missingDocs={intelData.missingDocs}
        futureTrend={intelData.futureTrend}
      />
    </main>
  );
}
