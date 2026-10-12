"use client";

import React from "react";
import Link from "next/link";

export default function BrainPage() {
  const brainData = {
    summary:
      "Shivam Security Services Pvt. Ltd. is an established security and manpower provider with 7+ years of expertise in facility management and security guard deployment across MP.",
    strengths: [
      "Valid ISO 9001 & PSARA Certifications",
      "Over 200+ Trained Security Personnel",
      "Proven Track Record in Government Establishments",
      "Financial Capacity for Projects up to ₹5 Cr",
    ],
    weaknesses: [
      "Limited direct presence in North-Eastern states",
      "Subcontracting capabilities restricted for mega IT tenders",
    ],
    certifications: [
      { name: "ISO 9001:2015 Quality Management", status: "Valid", expiry: "2028-05-15" },
      { name: "PSARA License (Madhya Pradesh)", status: "Valid", expiry: "2027-11-20" },
      { name: "EPF & ESIC Registration", status: "Active", expiry: "Permanent" },
    ],
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
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <h1 className="text-2xl font-bold">Company Brain</h1>
        </div>
        <p className="text-xs text-indigo-100 mt-1">
          AI-generated Intelligence Profile used to evaluate tender match scores
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Executive Summary Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-2">
          <div className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            Executive Summary
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            {brainData.summary}
          </p>
        </div>

        {/* Core Strengths */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
          <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
            Core Strengths
          </div>
          <ul className="space-y-2">
            {brainData.strengths.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
          <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
            Registered Documents & Certifications
          </div>
          <div className="space-y-2">
            {brainData.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-xs"
              >
                <div>
                  <strong className="block font-semibold text-gray-800 dark:text-gray-200">
                    {cert.name}
                  </strong>
                  <span className="text-[10px] text-gray-400">Expires: {cert.expiry}</span>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {cert.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regenerate Brain CTA */}
        <button
          onClick={() => alert("Re-analyzing company profile with AI...")}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl text-xs active:scale-95 transition shadow-sm flex items-center justify-center gap-2"
        >
          <span>✨</span>
          <span>Regenerate Company Brain with AI</span>
        </button>
      </div>
    </div>
  );
}
