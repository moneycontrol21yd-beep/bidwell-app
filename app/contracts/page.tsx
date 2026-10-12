"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "pending">("active");

  const contracts = [
    {
      id: "CNT-2026-881",
      title: "Security & Facility Management Services",
      organisation: "Executive Engineer PWD Division Indore",
      value: "₹2.5 Cr",
      startDate: "2026-04-01",
      endDate: "2027-03-31",
      workforceCount: 45,
      status: "Active Execution",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    {
      id: "CNT-2025-412",
      title: "Smart City Surveillance Setup & Maintenance",
      organisation: "Smart City Development Ltd",
      value: "₹1.2 Cr",
      startDate: "2025-01-15",
      endDate: "2026-01-14",
      workforceCount: 18,
      status: "Completed",
      statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800",
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
        <h1 className="text-2xl font-bold">Active Contracts</h1>
        <p className="text-xs text-blue-100 mt-1">
          Manage ongoing projects, site deployment, and billing status
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800 text-xs font-bold">
          {(
            [
              { id: "active", label: "Active" },
              { id: "pending", label: "Pending Start" },
              { id: "completed", label: "Completed" },
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

        {/* Contracts List */}
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">
                    Ref ID: {contract.id}
                  </span>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5 leading-snug">
                    {contract.title}
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {contract.organisation}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${contract.statusColor}`}>
                  {contract.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Contract Value</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{contract.value}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Deployed Staff</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{contract.workforceCount} Employees</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
                <span>Duration: {contract.startDate} to {contract.endDate}</span>
              </div>

              <Link href={`/contracts/${contract.id}`} className="block">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition">
                  Manage Site & Workforce
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
