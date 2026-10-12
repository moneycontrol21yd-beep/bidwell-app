import React from 'react';

interface IntelProps {
  tenderId: string;
  winProbability: number;
  l1PriceEstimate: string;
  topCompetitors: string[];
  riskWarnings: string[];
  missingDocs: string[];
  futureTrend: string;
}

export default function TenderIntel({
  winProbability,
  l1PriceEstimate,
  topCompetitors,
  riskWarnings,
  missingDocs,
  futureTrend
}: IntelProps) {
  return (
    <div className="p-5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-emerald-400">🧠 BidWell Intelligence Brain</h3>
          <p className="text-xs text-slate-400">Micro (₹50k) to Enterprise (₹50,000 Cr) Ready</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold">
          {winProbability}% Match Score
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400">Estimated L1 Winning Bid</p>
          <p className="font-bold text-amber-300 text-base">₹{l1PriceEstimate}</p>
        </div>
        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-400">Likely Competitors Radar</p>
          <p className="font-semibold text-slate-200 text-xs mt-1">{topCompetitors.join(", ")}</p>
        </div>
      </div>

      {/* Missing Document Watch */}
      <div className="bg-amber-950/40 border border-amber-800/50 p-3 rounded-lg">
        <p className="text-xs font-bold text-amber-400 mb-1">📄 Missing & Compliance Checklist Alert</p>
        <ul className="list-disc list-inside text-xs text-amber-200 space-y-1">
          {missingDocs.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </div>

      {/* Disqualification Risk */}
      <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-lg">
        <p className="text-xs font-bold text-rose-400 mb-1">⚠️ Historical Disqualification Risks</p>
        <ul className="list-disc list-inside text-xs text-rose-200 space-y-1">
          {riskWarnings.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
        </ul>
      </div>

      {/* Future AI Trend */}
      <div className="bg-blue-950/40 border border-blue-800/50 p-3 rounded-lg">
        <p className="text-xs font-bold text-blue-400 mb-1">🔮 Future Market Trend & Insight</p>
        <p className="text-xs text-blue-200">{futureTrend}</p>
      </div>
    </div>
  );
}
