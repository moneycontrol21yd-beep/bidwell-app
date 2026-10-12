import React from 'react';
import TenderIntel from '../components/TenderIntel';

export default function TenderDetailsPage() {
  // Demo Intelligence Data (In production, fetched from Supabase AOC & Eval tables)
  const intelData = {
    tenderId: "CPPP-2026-88219",
    winProbability: 84,
    l1PriceEstimate: "42,50,000",
    topCompetitors: ["L&T Infrastructure", "ABC Buildcon", "Shree Tech Solutions"],
    riskWarnings: [
      "3-Year Average Turnover must be > ₹50 Lakhs (Common Rejection Factor)",
      "EMD Bank Guarantee format strictly as per Annexure-III",
      "Similar work completion certificate required from Govt department"
    ]
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">Live Tender Intelligence</span>
        <h1 className="text-2xl font-black mt-1">Construction & Maintenance of Rural Roads - Pratapgarh Zone</h1>
        <p className="text-sm text-slate-400 mt-1">Tender ID: {intelData.tenderId} | Est. Value: ₹50,000,000</p>
      </div>

      {/* BidWell Intelligence Brain Card */}
      <TenderIntel 
        tenderId={intelData.tenderId}
        winProbability={intelData.winProbability}
        l1PriceEstimate={intelData.l1PriceEstimate}
        topCompetitors={intelData.topCompetitors}
        riskWarnings={intelData.riskWarnings}
      />
    </main>
  );
}
