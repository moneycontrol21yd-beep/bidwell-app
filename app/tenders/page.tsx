"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Tender {
  id: string;
  title: string;
  department: string;
  value: string;
  deadline: string;
  source: string;
  location: string;
  category: string;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTenders() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tenders?source=${selectedSource}`);
        const data = await res.json();
        if (data.success) {
          setTenders(data.tenders);
          setTotalCount(data.totalCount);
        }
      } catch (err) {
        console.error("Failed to load tenders", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTenders();
  }, [selectedSource]);

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
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold">All India Tenders</h1>
            <p className="text-xs text-blue-100 mt-1">
              Live updates across CPPP, GeM, State Portals & UTs
            </p>
          </div>
          <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-white/30">
            {totalCount.toLocaleString()}+ Live
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Source Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
          {[
            { id: "all", label: "All Sources" },
            { id: "cppp", label: "CPPP Central" },
            { id: "gem", label: "GeM Portal" },
            { id: "state", label: "State Portals" },
            { id: "ut", label: "Union Territories" },
          ].map((src) => (
            <button
              key={src.id}
              onClick={() => setSelectedSource(src.id)}
              className={`px-3.5 py-2 rounded-xl flex-shrink-0 transition ${
                selectedSource === src.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>

        {/* Tenders Stream */}
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading tenders database...</div>
        ) : (
          <div className="space-y-3">
            {tenders.map((tender) => (
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
                    View Tender Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
