"use client";
import React, { useState } from "react";
import GlobalNavbar from "./components/GlobalNavbar";

export default function MasterBrainDashboard() {
  const [activeTab, setActiveTab] = useState("tenders");

  const liveTenders = [
    { id: "GEM-9841", title: "State Highway Road & Civil Upgradation", dept: "PWD • Uttar Pradesh", val: "₹4.85 Cr", emd: "MSME Exempt", match: "98% Match" },
    { id: "CPPP-4419", title: "Solar Street Lighting & Smart Grid", dept: "MP Urja Vikas • Bhopal", val: "₹1.92 Cr", emd: "₹3.84 L", match: "95% Match" }
  ];

  return (
    <div className="min-h-screen p-4 pb-28 space-y-4">
      <GlobalNavbar />

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
        <button onClick={() => setActiveTab("tenders")} className={`py-2 rounded-xl text-xs font-bold ${activeTab === "tenders" ? "bg-cyan-600 text-white" : "text-slate-400"}`}>
          🔥 Live Matched Tenders
        </button>
        <button onClick={() => setActiveTab("bids")} className={`py-2 rounded-xl text-xs font-bold ${activeTab === "bids" ? "bg-purple-600 text-white" : "text-slate-400"}`}>
          📄 Legal PDF Application
        </button>
      </div>

      {activeTab === "tenders" && (
        <div className="space-y-3">
          {liveTenders.map(t => (
            <div key={t.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400">{t.id}</span>
                  <h3 className="text-sm font-bold text-white">{t.title}</h3>
                  <p className="text-[11px] text-slate-400">{t.dept}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">{t.match}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl">
                <div><span className="text-[10px] text-slate-400 block">Value</span><b>{t.val}</b></div>
                <div><span className="text-[10px] text-slate-400 block">EMD Status</span><b className="text-emerald-400">{t.emd}</b></div>
              </div>
              <button onClick={() => setActiveTab("bids")} className="w-full py-2 rounded-xl bg-blue-600 text-center text-xs font-bold">
                ✨ Generate Legal Tender Application PDF →
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "bids" && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
          <h2 className="font-bold text-sm text-cyan-400">🛡️ Court-Compliant Legal PDF Application Generator</h2>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-slate-400">Company Name</label>
              <input type="text" defaultValue="M/s Enterprise & Engineers" className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">GSTIN / Udyam MSME</label>
              <input type="text" defaultValue="09AABBC1234Z1ZU" className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1" />
            </div>
          </div>
          <button onClick={() => alert("Court-Compliant Legal PDF Application Downloaded Successfully!")} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-extrabold text-xs shadow-lg">
            📥 Download Legal PDF Application Package
          </button>
        </div>
      )}
    </div>
  );
}
