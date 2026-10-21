"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CyberDeskCard from "@/components/CyberDeskCard";

export default function AISuggestionsEngine() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch("/api/eligibility-match").catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setTenders(data);
        }
      } catch (e) {}
      setLoading(false);
    }
    loadMatches();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b19] text-white p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              ⚡ Cyber AI Consultant & Suggestions
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Connected to VPS Multi-Source Scrapers & Supabase Live Sync
            </p>
          </div>
          <Link href="/brain" className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
            ← Back
          </Link>
        </div>

        {/* Hamara Naya Cyber AI Desk */}
        <CyberDeskCard />

        {/* AI Action Center & Document Gap Engine */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              95% Match Engine Active
            </span>
            <span className="text-xs text-slate-400">GeM • CPPP • IREPS • States</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Personalized High-Winning Tender Recommendations
          </h2>
          <p className="text-sm text-slate-300">
            Purana basic chat hata diya gaya hai. Ab yeh engine seedha aapke profile, turnover aur past awards ke hisaab se top matching tenders aur missing document checklist (GST, Udyam, DSC, EMD) taiyar karta hai.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href="/live-tenders" className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-center font-semibold text-sm">
              🔥 View 95% Match Tenders
            </Link>
            <Link href="/match" className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-center font-semibold text-sm">
              🛡️ Check Document Gaps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
