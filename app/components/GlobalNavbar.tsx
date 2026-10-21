"use client";
import React from "react";
import Link from "next/link";

export default function GlobalNavbar() {
  return (
    <nav className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-black text-cyan-400 text-sm tracking-wider">BidWell Pro</span>
        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">Enterprise AI</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Link href="/" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">Dashboard</Link>
        <Link href="/match" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">Live Tenders</Link>
        <Link href="/bids" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">Workspace</Link>
        <Link href="/upload" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">Documents</Link>
      </div>
    </nav>
  );
}
