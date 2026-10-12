"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"received" | "pending" | "invoices">("pending");

  const paymentSummary = {
    totalReceived: "₹1.8 Cr",
    pendingBills: "₹45 Lakhs",
    overdueEMD: "₹50,000",
  };

  const invoices = [
    {
      id: "INV-2026-089",
      contractTitle: "Security & Facility Services - PWD Indore",
      amount: "₹12,50,000",
      dueDate: "2026-10-30",
      status: "Bill Submitted",
      statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    {
      id: "INV-2026-042",
      contractTitle: "CCTV Setup & Maintenance - Smart City",
      amount: "₹8,00,000",
      dueDate: "2026-09-15",
      status: "Payment Received",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
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
        <h1 className="text-2xl font-bold">Payments & Financials</h1>
        <p className="text-xs text-blue-100 mt-1">
          Monitor bill clearance, pending invoices, and EMD refunds
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <span className="text-[9px] font-bold tracking-wider uppercase text-gray-400 block">Received</span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">{paymentSummary.totalReceived}</span>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <span className="text-[9px] font-bold tracking-wider uppercase text-gray-400 block">Pending Bills</span>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 block mt-1">{paymentSummary.pendingBills}</span>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <span className="text-[9px] font-bold tracking-wider uppercase text-gray-400 block">EMD Locked</span>
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 block mt-1">{paymentSummary.overdueEMD}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800 text-xs font-bold">
          {(
            [
              { id: "pending", label: "Pending Bills" },
              { id: "received", label: "Cleared" },
              { id: "invoices", label: "All Invoices" },
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

        {/* Invoices List */}
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">
                    Invoice No: {inv.id}
                  </span>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5 leading-snug">
                    {inv.contractTitle}
                  </h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${inv.statusColor}`}>
                  {inv.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Bill Amount</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{inv.amount}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] block uppercase">Due Date</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{inv.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
