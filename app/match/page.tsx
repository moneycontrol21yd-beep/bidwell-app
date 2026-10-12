"use client";

import React from "react";
import Link from "next/link";

export default function MatchAnalysisPage() {
  const matchData = {
    tenderTitle: "Supply, Installation and Maintenance of Security Systems & Manpower Services",
    department: "Public Works Department (PWD) MP",
    overallScore: 88,
    breakdown: [
      { category: "Technical Eligibility", score: 95, detail: "ISO 9001 & PSARA licenses validated" },
      { category: "Financial Capacity", score: 85, detail: "Turnover > ₹1 Cr requirement met" },
      { category: "Regional Experience", score: 90, detail: "Active projects in MP state" },
      { category: "Workforce Strength", score: 80, detail: "200+ trained personnel ready for deployment" },
    ],
    aiVerdict: "STRONG GO",
    aiRecommendation:
      "Your company meets all mandatory technical and financial eligibility criteria. High probability of technical qualification."
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-5 pt-5 pb-6 rounded-b-[2rem] shadow-md">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-indigo-200 hover:text-white mb-3"
        >
          ← Back to Dashboard
        </Link>
        <div className="text-[10px] font-bold tracking-wider uppercase text-indigo-200 mb-1">
          {matchData.department}
        </div>
        <h1 className="text-xl font-bold leading-tight">{matchData.tenderTitle}</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Match Score Circle Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center space-y-3">
          <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
            AI Compatibility Score
          </div>
          <div className="relative inline-flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
              {matchData.overallScore}%
            </div>
          </div>
          <div>
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
              Verdict: {matchData.aiVerdict}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 pt-1 leading-relaxed">
            {matchData.aiRecommendation}
          </p>
        </div>

        {/* Score Breakdown Bars */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
          <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
            Eligibility Breakdown
          </div>

          {matchData.breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-800 dark:text-gray-200">{item.category}</span>
                <span className="text-indigo-600 dark:text-indigo-400">{item.score}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Back to Tender Action */}
        <button
          onClick={() => window.history.back()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-xs active:scale-95 transition shadow-sm"
        >
          Return to Tender Details
        </button>
      </div>
    </div>
  );
}
