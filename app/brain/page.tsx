"use client";
import React from "react";
import Link from "next/link";

const CARDS = [
  { t: "Tender Analysis", d: "AI insights on tenders & L1 competition.", b: "View Analysis →", h: "/assistant", c: "from-indigo-600 to-purple-700", i: "📊" },
  { t: "Eligibility Check", d: "Scan GST, Udyam & missing bid docs.", b: "Check Eligibility →", h: "/assistant", c: "from-emerald-500 to-teal-700", i: "🛡️" },
  { t: "Fast Record", d: "High priority & closing soon tenders.", b: "View Fast Record →", h: "/fast-record", c: "from-amber-500 to-orange-600", i: "⚡" },
  { t: "Future Record", d: "Upcoming tenders & project forecasts.", b: "Explore Future →", h: "/future-record", c: "from-pink-500 to-rose-600", i: "📅" },
  { t: "AI Suggestions", d: "95% matched tenders & doc checklist.", b: "Get Recommendations →", h: "/assistant", c: "from-blue-500 to-indigo-700", i: "🤖" },
  { t: "India Wide Coverage", d: "GeM + CPPP + UP, MP, GJ, RJ, Bihar.", b: "Explore All →", h: "/live-tenders", c: "from-teal-500 to-emerald-700", i: "🇮🇳" }
];

export default function BrainHubPage() {
  return (
    <div className="min-h-screen bg-[#070b18] text-white p-4 pb-28 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div><h1 className="text-lg font-extrabold">BidWell</h1><p className="text-xs text-slate-400">Smarter Tenders. Bigger Opportunities.</p></div>
        <Link href="/profile" className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">BR</Link>
      </div>
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950 to-emerald-950 border border-cyan-500/40 space-y-2">
        <span className="text-[10px] font-extrabold text-cyan-300">⚡ CYBER AI CONSULTANT DESK • LIVE</span>
        <h2 className="text-sm font-extrabold">95% Matched Tenders & Automated Doc Gap Scanner</h2>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href="/assistant" className="py-2 rounded-xl bg-cyan-600 text-center text-xs font-bold">🚀 Open AI Engine →</Link>
          <Link href="/live-tenders" className="py-2 rounded-xl bg-slate-900 text-center text-xs font-bold">📄 50+ Live Tenders</Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map((x, idx) => (
          <Link key={idx} href={x.h} className={`p-4 rounded-3xl bg-gradient-to-br ${x.c} flex flex-col justify-between min-h-[155px]`}>
            <div className="flex justify-between"><span>{x.i}</span><span>→</span></div>
            <div><h3 className="text-sm font-extrabold">{x.t}</h3><p className="text-[11px] text-white/85 mt-1">{x.d}</p></div>
            <span className="px-2.5 py-1 rounded-full bg-black/25 text-[10px] font-bold w-fit">{x.b}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
