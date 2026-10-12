"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function BidsPage() {
  const [activeTab, setActiveTab] = useState<"draft" | "submitted" | "awarded">("submitted");

  const bids = [
    {
      id: "BID-2026-001",
      tenderTitle: "Supply, Installation and Maintenance of Security Systems & Manpower Services",
      department: "Public Works Department (PWD)",
      value: "₹2.5 Cr",
      submittedDate: "2026-10-11",
      status: "Under Technical Review",
      stageColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    {
      id: "BID-2026-002",
      tenderTitle: "Integrated Facility Management & CCTV Setup",
      department: "Smart City Indore",
      value: "₹1.2 Cr",
      submittedDate: "2026-09-28",
      status: "Awarded (L1)",
      stageColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
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
        <h1 className="text-2xl font-bold">My Bids Tracker</h1>
        <p className="text-xs text-blue-100 mt-1">
          Track prepared documents, active proposals, and awarded contracts
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800 text-xs font-bold">
          {(
            [
              { id: "submitted", label: "Submitted" },
              { id: "draft", label: "Drafts" },
              { id: "awarded", label: "Awarded" },
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

        {/* Bids List */}
        <div className="space-y-3">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">
                    Ref ID: {bid.id}
                  </span>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5 leading-snug">
                    {bid.tenderTitle}
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {bid.department}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Bid Value</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{bid.value}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${bid.stageColor}`}>
                  {bid.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
