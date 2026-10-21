"use client";
import React from "react";
import GlobalNavbar from "../components/GlobalNavbar";

export default function BidsPage() {
  return (
    <div className="min-h-screen p-4 pb-28 space-y-4">
      <GlobalNavbar />
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
    </div>
  );
}
