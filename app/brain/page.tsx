"use client";
import React from "react";
import Link from "next/link";

export default function BrainHubMaster() {
  const cards = [
    { title: "Live Tenders & 95% Match", desc: "GeM, CPPP, UP, MP, GJ, BR real-time synced tenders.", href: "/live-tenders", icon: "🔥", bg: "from-blue-600 to-indigo-700" },
    { title: "Cyber AI Consultant", desc: "Eligibility scoring & smart market insights.", href: "/assistant", icon: "🤖", bg: "from-indigo-600 to-purple-700" },
    { title: "Document Gap Scanner", desc: "Check GST, Udyam MSME, DSC & Solvency readiness.", href: "/assistant", icon: "🛡️", bg: "from-emerald-500 to-teal-700" },
    { title: "Legal PDF & Avedan Generator", desc: "1-Click affidavits, covering letters & bid packages.", href: "/bids", icon: "📄", bg: "from-purple-600 to-pink-600" },
    { title: "Fast Closing Records", desc: "High priority tenders closing in next 48-72 hours.", href: "/fast-record", icon: "⚡", bg: "from-amber-500 to-orange-600" },
    { title: "India Wide Coverage", desc: "Central + State + UT portals unified in one place.", href: "/live-tenders", icon: "🇮🇳", bg: "from-teal-500 to-emerald-700" }
  ];

  return (
    <div className="min-h-screen bg-[#070b18] text-white p-4 pb-28 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-extrabold text-lg">B</div>
          <div>
            <h1 className="text-lg font-extrabold">BidWell</h1>
            <p className="text-[11px] text-slate-400">Smarter Tenders. Bigger Opportunities.</p>
          </div>
        </div>
        <Link href="/profile" className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">BR</Link>
      </div>

      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950 via-blue-950 to-emerald-950 border border-cyan-500/40 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold">⚡ VPS SCRAPERS & SUPABASE LIVE</span>
          <span className="text-[11px] text-emerald-400 font-bold">● Active Sync</span>
        </div>
        <h2 className="text-base font-extrabold">95% Profile-Matched Tenders & Automated Legal Avedan Engine</h2>
        <p className="text-xs text-slate-300">Koi faltu chat nahi. Seedha live tenders, document gap check aur 1-click legal PDF generation.</p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href="/live-tenders" className="py-2.5 rounded-xl bg-cyan-600 text-center text-xs font-extrabold">🔥 View Live Tenders</Link>
          <Link href="/bids" className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center text-xs font-bold">📄 Generate Legal Avedan</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((c, i) => (
          <Link key={i} href={c.href} className={`p-4 rounded-3xl bg-gradient-to-br ${c.bg} flex flex-col justify-between min-h-[160px] shadow-lg`}>
            <div className="flex justify-between items-center">
              <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-base">{c.icon}</span>
              <span>→</span>
            </div>
            <div className="my-2">
              <h3 className="text-sm font-extrabold">{c.title}</h3>
              <p className="text-[11px] text-white/85 mt-1">{c.desc}</p>
            </div>
            <span className="self-start px-3 py-1 rounded-full bg-black/25 text-[10px] font-bold">Open Module →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
