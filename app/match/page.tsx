"use client";
import React, { useState } from "react";
import Link from "next/link";

const TENDERS = [
  { id: "GEM-2026-9841", title: "State Highway Road & Civil Upgradation", dept: "PWD • Uttar Pradesh", st: "UP", val: "₹4.85 Cr", emd: "MSME Exempt", match: 98, win: "89% Win", gap: "Solvency Cert" },
  { id: "CPPP-2026-4419", title: "Solar Street Lighting & Smart Grid", dept: "MP Urja Vikas • Bhopal", st: "MP", val: "₹1.92 Cr", emd: "₹3.84 L", match: 95, win: "84% Win", gap: "" },
  { id: "IREPS-2026-7731", title: "Railway Signalling & Track Works", dept: "Indian Railways • Gujarat", st: "GJ", val: "₹3.40 Cr", emd: "₹6.80 L", match: 92, win: "78% Win", gap: "OEM Auth" },
  { id: "BIHAR-2026-8821", title: "Rural Water Supply Pipeline (JJM)", dept: "PHED • Bihar Portal", st: "BR", val: "₹6.10 Cr", emd: "₹12.20 L", match: 91, win: "81% Win", gap: "" }
];

export default function CyberAIConsultant() {
  const [tab, setTab] = useState("matches");
  const [st, setSt] = useState("ALL");
  const list = st === "ALL" ? TENDERS : TENDERS.filter(t => t.st === st);

  return (
    <div className="min-h-screen bg-[#060916] text-white p-4 pb-28 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-lg font-extrabold text-cyan-400">⚡ BidWell Cyber AI Consultant</h1>
          <p className="text-xs text-slate-400">GeM • CPPP • IREPS • UP • MP • GJ • Bihar Live</p>
        </div>
        <Link href="/brain" className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold">← Back</Link>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-slate-900 border border-blue-500/30"><p className="text-[10px] text-blue-300">Profile</p><p className="font-extrabold">95% Match</p></div>
        <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/30"><p className="text-[10px] text-emerald-300">Live Sync</p><p className="font-extrabold">50+ Bids</p></div>
        <div className="p-3 rounded-2xl bg-slate-900 border border-purple-500/30"><p className="text-[10px] text-purple-300">Doc Vault</p><p className="font-extrabold">8/9 Ready</p></div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-900">
        {[["matches","🎯 AI Matches"],["docgap","🛡️ Doc Gap"],["strategy","🧠 L1 Price"]].map(([k,v]) => (
          <button key={k} onClick={() => setTab(k)} className={`py-2 rounded-xl text-xs font-bold ${tab===k ? "bg-blue-600" : "text-slate-400"}`}>{v}</button>
        ))}
      </div>

      {tab === "matches" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {["ALL","UP","MP","GJ","BR"].map(s => (
              <button key={s} onClick={() => setSt(s)} className={`px-3 py-1 rounded-full text-xs font-bold ${st===s ? "bg-cyan-600" : "bg-slate-900"}`}>{s}</button>
            ))}
          </div>
          {list.map(t => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <div><span className="text-xs text-cyan-400">{t.id}</span><h3 className="font-bold text-sm">{t.title}</h3><p className="text-xs text-slate-400">{t.dept}</p></div>
                <span className="px-2 py-1 h-fit rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">{t.match}% Match</span>
              </div>
              <div className="flex justify-between text-xs bg-slate-950 p-2.5 rounded-xl">
                <span>Val: <b>{t.val}</b></span><span>EMD: <b className="text-emerald-400">{t.emd}</b></span><span className="text-cyan-300 font-bold">{t.win}</span>
              </div>
              {t.gap ? <p className="text-xs text-amber-300">⚠️ Missing Doc: {t.gap}</p> : <p className="text-xs text-emerald-400">✅ All 9 Required Bid Docs Ready</p>}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/live-tenders" className="py-2 rounded-xl bg-slate-800 text-center text-xs font-bold">📄 View NIT</Link>
                <Link href="/bids" className="py-2 rounded-xl bg-blue-600 text-center text-xs font-bold">🚀 Prepare Bid</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "docgap" && (
        <div className="p-4 rounded-2xl bg-slate-900 space-y-2 text-xs">
          <p className="p-2.5 rounded-xl bg-slate-950">✅ GST & GSTR-3B (Verified)</p>
          <p className="p-2.5 rounded-xl bg-slate-950">✅ Udyam MSME EMD Exemption (Active)</p>
          <p className="p-2.5 rounded-xl bg-slate-950">✅ Class-III DSC & 3-Yr Balance Sheet (Ready)</p>
          <p className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300">⚠️ Bank Solvency Certificate (Click Below to Draft)</p>
          <Link href="/documents" className="block py-2.5 rounded-xl bg-emerald-600 text-center font-bold mt-2">📁 Open Document Vault →</Link>
        </div>
      )}

      {tab === "strategy" && (
        <div className="p-4 rounded-2xl bg-slate-900 space-y-2 text-xs">
          <p className="p-3 rounded-xl bg-slate-950">🏗️ Civil/Road Optimal L1 Quote: <b className="text-emerald-400">-3.8% to -5.2% Below BOQ</b></p>
          <p className="p-3 rounded-xl bg-slate-950">⚡ GeM/Solar Optimal L1 Quote: <b className="text-cyan-400">-6.5% to -8.0% Below MRP</b></p>
        </div>
      )}
    </div>
  );
}
