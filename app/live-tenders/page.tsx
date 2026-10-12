"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LiveTendersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "fresh" | "closing" | "high_value">("all");

  const sampleTenders = [
    {
      id: "101",
      title: "Provide Integrated Security Guards & Surveillance Equipment",
      department: "Public Works Department (PWD) MP",
      value: "₹2.5 Cr",
      deadline: "2026-10-28",
      source: "CPPP",
      location: "Indore, MP",
    },
    {
      id: "102",
      title: "Annual Maintenance and Housekeeping Services for Govt Offices",
      department: "Health & Family Welfare Dept",
      value: "₹1.1 Cr",
      deadline: "2026-10-24",
      source: "GeM",
      location: "Bhopal, MP",
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
        <h1 className="text-2xl font-bold">Live Tenders</h1>
        <p className="text-xs text-blue-100 mt-1">
          Explore active tenders aggregated across all government portals
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800 text-xs font-bold">
          {(
            [
              { id: "all", label: "All Tenders" },
              { id: "fresh", label: "Today's New" },
              { id: "closing", label: "Closing Soon" },
              { id: "high_value", label: "High Value" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-center rounded-xl transition text-[11px] ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tenders List */}
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
                <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0">
                  {tender.source}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-medium">Value: <strong className="text-gray-800 dark:text-gray-200">{tender.value}</strong></span>
                <span className="text-red-500 font-medium">Deadline: {tender.deadline}</span>
              </div>

              <Link href={`/tenders/${tender.id}`} className="block">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition">
                  View Full Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
