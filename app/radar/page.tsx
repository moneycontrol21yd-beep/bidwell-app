"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RadarPage() {
  const [activeTab, setActiveTab] = useState<"matched" | "upcoming" | "ending">("matched");

  const sampleTenders = [
    {
      id: "1",
      title: "Provide Manpower & Security Services at Civil Hospital",
      department: "Health Department MP",
      value: "₹1.8 Cr",
      deadline: "2026-10-30",
      matchScore: "92%",
    },
    {
      id: "2",
      title: "Supply of CCTV Cameras and Facility Monitoring Setup",
      department: "Smart City Indore",
      value: "₹3.2 Cr",
      deadline: "2026-10-22",
      matchScore: "88%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 pt-5 pb-6 rounded-b-[2rem] shadow-md">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-blue-200 hover:text-white mb-3"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Opportunity Radar</h1>
        <p className="text-xs text-blue-100 mt-1">
          Smart radar highlighting high-match opportunities tailored for your company
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800 text-xs font-bold">
          {(
            [
              { id: "matched", label: "For Me" },
              { id: "upcoming", label: "Upcoming" },
              { id: "ending", label: "Ending Soon" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-center rounded-xl transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Radar Tenders List */}
        <div className="space-y-3">
          {sampleTenders.map((tender) => (
            <div
              key={tender.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 block">
                    {tender.department}
                  </span>
                  <h3 className="text-sm font-bold mt-0.5 leading-snug text-gray-800 dark:text-gray-200">
                    {tender.title}
                  </h3>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-2 py-1 rounded-lg">
                  {tender.matchScore} Match
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Value: <strong className="text-gray-800 dark:text-gray-200">{tender.value}</strong></span>
                <span className="text-red-500 font-medium">Deadline: {tender.deadline}</span>
              </div>

              <Link href={`/tenders/${tender.id}`} className="block">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition">
                  View Details & Analysis
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
