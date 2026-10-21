"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function MasterDashboard() {
  const [activeTab, setActiveTab] = useState("tenders");

  const tenders = [
    { id: "GEM-9841", title: "State Highway Road & Civil Upgradation Works", dept: "PWD • Uttar Pradesh", val: "₹4.85 Cr", emd: "MSME Exempt", match: "98% Match" },
    { id: "CPPP-4419", title: "Solar Street Lighting & Smart Grid Network", dept: "MP Urja Vikas • Bhopal", val: "₹1.92 Cr", emd: "₹3.84 L", match: "95% Match" },
    { id: "IREPS-7731", title: "Railway Signalling & Track Infrastructure", dept: "Indian Railways • Gujarat", val: "₹3.40 Cr", emd: "₹6.80 L", match: "92% Match" }
  ];

  return (
    <div className="min-h-screen bg-[#070b18] text-white p-4 pb-28 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-extrabold text-lg">B</div>
          <div>
            <h1 className="text-lg font-extrabold text-cyan-400">BidWell Cyber AI Hub</h1>
            <p className="text-[11px] text-slate-400">Live Supabase Sync & Legal Avedan Generator</p>
          </div>
        </div>
        <Link href="/profile" className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">BR</Link>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
        <button onClick={() => setActiveTab("tenders")} className={`py-2.5 rounded-xl text-xs font-bold ${activeTab === "tenders" ? "bg-blue-600 text-white" : "text-slate-400"}`}>
          🔥 Live Matched Tenders
        </button>
        <button onClick={() => setActiveTab("bids")} className={`py-2.5 rounded-xl text-xs font-bold ${activeTab === "bids" ? "bg-purple-600 text-white" : "text-slate-400"}`}>
          📄 1-Click Legal Avedan
        </button>
      </div>

      {activeTab === "tenders" && (
        <div className="space-y-3">
          {tenders.map(t => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400">{t.id}</span>
                  <h3 className="text-sm font-bold text-white">{t.title}</h3>
                  <p className="text-[11px] text-slate-400">{t.dept}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">{t.match}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 text-xs">
                <div><span className="text-[10px] text-slate-400 block">Value</span><b>{t.val}</b></div>
                <div><span className="text-[10px] text-slate-400 block">EMD Status</span><b className="text-emerald-400">{t.emd}</b></div>
              </div>
              <button onClick={() => setActiveTab("bids")} className="w-full py-2 rounded-xl bg-blue-600 text-center text-xs font-bold">
                ✨ Generate Legal Avedan & Bid Docs →
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "bids" && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-cyan-400">🛡️ Automated Legal PDF Generator</h2>
          <p className="text-xs text-slate-300">Enter details to generate court-compliant affidavits & covering letters instantly:</p>
          
          <div className="space-y-2 text-xs">
            <div>
              <label className="text-slate-400 text-[10px]">Company Name</label>
              <input type="text" defaultValue="M/s Enterprise & Engineers" className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1" />
            </div>
            <div>
              <label className="text-slate-400 text-[10px]">GSTIN / Udyam Number</label>
              <input type="text" defaultValue="09AABBC1234Z1ZU" className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1" />
            </div>
          </div>

          <button onClick={() => alert("Court-Compliant PDF Generated Successfully!")} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-extrabold text-xs shadow-lg">
            📥 Download Court-Compliant PDF Avedan
          </button>
        </div>
      )}
    </div>
  );
}
