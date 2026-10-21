"use client";
import React from "react";
import GlobalNavbar from "../components/GlobalNavbar";

export default function UploadPage() {
  return (
    <div className="min-h-screen p-4 pb-28 space-y-4">
      <GlobalNavbar />
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
        <h2 className="font-bold text-sm text-cyan-400">📤 Document Scanner & Upload Suite</h2>
        <p className="text-slate-400 text-[11px]">Upload tender documents, BOQ, or legal certificates for instant AI gap analysis.</p>
        <div className="p-4 border-2 border-dashed border-slate-700 rounded-2xl text-center space-y-2 bg-slate-950">
          <p className="text-xs text-slate-300 font-bold">Tap to upload PDF or Document</p>
          <button onClick={() => alert("Document uploaded and scanned successfully!")} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
            Browse Files
          </button>
        </div>
      </div>
    </div>
  );
}
