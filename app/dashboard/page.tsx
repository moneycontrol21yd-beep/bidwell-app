"use client";

import React from "react";
import Link from "next/link";

export default function DashboardPage() {
  const company = {
    name: "Shivam Security Services Pvt. Ltd.",
    type: "Security & Manpower",
    turnover: "₹5 Cr",
  };

  const quickActions = [
    { title: "Search Tenders", href: "/search", icon: "🔍", color: "from-blue-600 to-indigo-600" },
    { title: "Opportunity Radar", href: "/radar", icon: "📡", color: "from-indigo-600 to-purple-600" },
    { title: "Live Tenders", href: "/live-tenders", icon: "📋", color: "from-emerald-600 to-teal-600" },
    { title: "Company Brain", href: "/brain", icon: "🧠", color: "from-purple-600 to-pink-600" },
    { title: "My Bids", href: "/bids", icon: "💼", color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 pt-6 pb-8 rounded-b-[2rem] shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-blue-200">
              Contractor Dashboard
            </div>
            <h1 className="text-xl font-bold leading-snug">{company.name}</h1>
          </div>
          <Link href="/profile" className="bg-white/20 p-2 rounded-xl text-sm">
            🏢
          </Link>
        </div>

        {/* Quick Search Bar */}
        <Link href="/search" className="block">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center gap-3 text-xs text-blue-100">
            <span>🔍</span>
            <span className="flex-1">Search tenders by keyword, city, or department...</span>
          </div>
        </Link>
      </div>

      <div className="p-4 space-y-5">
        {/* Quick Actions Grid */}
        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
            Quick Actions
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-24 active:scale-95 transition">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {action.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Radar High-Match Highlight Card */}
        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
            Recommended Opportunity
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  Public Works Dept (PWD)
                </span>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                  Supply of Security Guards & Manpower Setup
                </h3>
              </div>
              <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-2 py-1 rounded-lg">
                95% Match
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Matched based on your ISO 9001 certification, PSARA license, and prior MP region experience.
            </p>

            <Link href="/radar" className="block">
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition shadow-sm">
                Explore All Matches
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
