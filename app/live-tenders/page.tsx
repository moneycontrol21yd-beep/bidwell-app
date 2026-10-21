"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function LiveTendersMaster() {
  const [filterState, setFilterState] = useState("ALL");
  const tenders = [
    { id: "GEM-2026-9841", title: "State Highway Road & Civil Upgradation Works", dept: "PWD • Uttar Pradesh", state: "UP", val: "₹4.85 Cr", emd: "MSME Exempt", match: "98% Match" },
    { id: "CPPP-2026-4419", title: "Solar Street Lighting & Smart Grid Network", dept: "MP Urja Vikas • Bhopal", state: "MP", val: "₹1.92 Cr", emd: "₹3.84 L", match: "95% Match" },
    { id: "IREPS-2026-7731", title: "Railway Signalling & Track Infrastructure", dept: "Indian Railways • Gujarat", state: "GJ", val: "₹3.40 Cr", emd: "₹6.80 L", match: "92% Match" },
    { id: "BR-2026-8821", title: "Rural Water Supply Pipeline Execution (JJM)", dept: "PHED • Bihar Portal", state: "BR", val: "₹6.10 Cr", emd: "₹12.20 L", match: "91% Match" }
  ];
  const list = filterState === "ALL" ? tenders : tenders.filter(t => t.state === filterState);

  return (
    <div className="min-h-screen bg-[#060916] text-white p-4 pb-28 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-base font-extrabold text-cyan-400">🔥 Live Tenders Feed (Supabase Synced)</h1>
          <p className="text-[11px] text-slate-400">GeM • CPPP • IREPS • UP • MP • GJ • Bihar</p>
        </div>
        <Link href="/brain" className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold">← Home</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["ALL", "UP", "MP", "GJ", "BR"].map(s => (
          <button key={s} onClick={() => setFilterState(s)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filterState === s ? "bg-cyan-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"}`}>
            {s === "ALL" ? "🇮🇳 All Portals" : `📍 ${s} Portal`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map(t => (
          <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400">{t.id}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{t.title}</h3>
                <p className="text-[11px] text-slate-400">{t.dept}</p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-extrabold shrink-0">{t.match}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 text-xs">
              <div><span className="text-[10px] text-slate-400 block">Estimated Value</span><b>{t.val}</b></div>
              <div><span className="text-[10px] text-slate-400 block">EMD Status</span><b className="text-emerald-400">{t.emd}</b></div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/assistant" className="py-2 rounded-xl bg-slate-800 text-center text-xs font-bold">🛡️ Check Docs</Link>
              <Link href="/bids" className="py-2 rounded-xl bg-blue-600 text-center text-xs font-bold">📄 Generate Avedan</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
