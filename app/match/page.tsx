"use client";
import React from "react";
import GlobalNavbar from "../components/GlobalNavbar";

export default function MatchPage() {
  return (
    <div className="min-h-screen p-4 pb-28 space-y-4">
      <GlobalNavbar />
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
        <h2 className="font-bold text-sm text-cyan-400">🔥 Live Tender Matching AI Suite</h2>
        <p className="text-slate-400 text-[11px]">AI is scanning daily portals across Uttar Pradesh, Madhya Pradesh, Gujarat, Rajasthan, and Bihar with 98% accuracy.</p>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold">
          ✨ System Status: All Live Tenders Synced & Matched.
        </div>
      </div>
    </div>
  );
}
