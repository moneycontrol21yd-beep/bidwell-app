import React from 'react';

interface IntelProps {
  tenderId: string;
  winProbability: number;
  l1PriceEstimate: string;
  topCompetitors: string[];
  riskWarnings: string[];
}

export default function TenderIntel({
  winProbability,
  l1PriceEstimate,
  topCompetitors,
  riskWarnings
}: IntelProps) {
  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 className="text-lg font-bold text-emerald-400">🧠 BidWell Intelligence Brain</h3>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold">
          {winProbability}% Match Score
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-800 p-2 rounded">
          <p className="text-xs text-slate-400">Estimated L1 Winning Bid</p>
          <p className="font-semibold text-amber-300">₹{l1PriceEstimate}</p>
        </div>
        <div className="bg-slate-800 p-2 rounded">
          <p className="text-xs text-slate-400">Top Likely Competitors</p>
          <p className="font-semibold text-slate-200">{topCompetitors.join(", ")}</p>
        </div>
      </div>

      <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-lg">
        <p className="text-xs font-bold text-rose-400 mb-1">⚠️ Disqualification Risk Watch (Past Rejection Reasons)</p>
        <ul className="list-disc list-inside text-xs text-rose-200 space-y-1">
          {riskWarnings.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
