"use client";

import { useState, useEffect } from "react";

interface Props {
  tenderTitle: string;
}

export default function BrainIntel({ tenderTitle }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenderTitle) return;
    fetch(`/api/tender-intel?title=${encodeURIComponent(tenderTitle)}`)
      .then((r) => r.json())
      .then((d) => d.success && setData(d))
      .finally(() => setLoading(false));
  }, [tenderTitle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.totalSimilar) {
    return (
      <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        Is tender ke liye historical data available nahi hai.
      </div>
    );
  }

  const bid = data.avgWinningValue * 0.98;
  const isGood = data.totalSimilar >= 10;
  const matchScore = Math.min(95, Math.round(data.totalSimilar * 1.5 + 40));

  return (
    <div className="space-y-4">
      {/* Match Score Circle + Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          {/* Score Circle */}
          <div className="relative flex-shrink-0">
            <svg className="w-20 h-20" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={matchScore >= 80 ? "#10b981" : matchScore >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray={`${matchScore * 2.64} 264`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{matchScore}%</span>
              <span className="text-[8px] font-bold uppercase text-gray-500">Match</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Overall Analysis
            </div>
            <div className={`text-lg font-bold ${isGood ? "text-emerald-600" : "text-amber-600"}`}>
              {isGood ? "✅ Recommended" : "⚠️ Consider"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.totalSimilar} similar tenders in last 2 years
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Bid */}
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white">
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-1">
          Recommended Bid Range
        </div>
        <div className="text-3xl font-bold">₹{(bid / 100000).toFixed(1)} Lakh</div>
        <div className="flex items-center gap-4 mt-3 text-xs opacity-90">
          <span>Average bidders: <strong>{data.avgBidders.toFixed(1)}</strong></span>
          <span>Avg winning: <strong>₹{(data.avgWinningValue / 100000).toFixed(1)}L</strong></span>
        </div>
      </div>

      {/* Competitors */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚔️</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Top Competitors
          </span>
        </div>
        <div className="space-y-2">
          {data.topCompetitors.slice(0, 5).map((c: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? "bg-red-100 text-red-600" :
                  i === 1 ? "bg-amber-100 text-amber-600" :
                  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}>
                  {i + 1}
                </div>
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  {c.name}
                </span>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-xs font-bold text-emerald-600">
                  ₹{(c.avg_value / 100000).toFixed(1)}L
                </div>
                <div className="text-[10px] text-gray-500">{c.wins} wins</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
