"use client";
import React, { useState } from "react";
import GlobalNavbar from "./components/GlobalNavbar";

export default function MasterBrainDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Tenders", val: "158", sub: "+12 today", bg: "from-blue-600 to-indigo-700", text: "text-white" },
    { label: "Active Bids", val: "6", sub: "2 due soon", bg: "from-purple-600 to-pink-700", text: "text-white" },
    { label: "Contracts", val: "3", sub: "1 expiring", bg: "from-emerald-600 to-teal-700", text: "text-white" },
    { label: "Pending Payments", val: "₹12,45,000", sub: "2 invoices", bg: "from-amber-500 to-orange-600", text: "text-white" }
  ];

  const recentTenders = [
    { id: "GEM-9841", title: "Construction of Govt. School Building", dept: "Ministry of Education", loc: "Indore, MP", val: "₹2.5 Cr", match: "92%" },
    { id: "CPPP-4419", title: "Security Services for Govt. Offices", dept: "Ministry of Home Affairs", loc: "Bhopal, MP", val: "₹1.8 Cr", match: "87%" },
    { id: "GEM-7822", title: "Supply of Electrical Equipment", dept: "Power Corporation", loc: "Jabalpur, MP", val: "₹1.2 Cr", match: "76%" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-28">
      <GlobalNavbar />
      
      <div className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Vibrant Welcome Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Good Morning, Harsh 👋</span>
            <h1 className="text-xl md:text-2xl font-black mt-2">AI Action Center <span className="text-xs px-2 py-0.5 bg-yellow-400 text-slate-950 rounded-full font-extrabold">PRO</span></h1>
            <p className="text-xs text-blue-100">Find the best tenders for your business with AI analysis and match your eligibility instantly.</p>
          </div>
          <button onClick={() => alert("AI Deep Scanner Activated across UP, MP, Gujarat, Rajasthan & Bihar!")} className="px-5 py-3 rounded-2xl bg-white text-blue-900 font-extrabold text-xs shadow-lg hover:bg-blue-50 transition">
            Start AI Analysis →
          </button>
        </div>

        {/* Colorful Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, idx) => (
            <div key={idx} className={`p-4 rounded-2xl bg-gradient-to-br ${s.bg} shadow-lg space-y-1`}>
              <span className="text-[11px] text-white/80 font-medium">{s.label}</span>
              <div className={`text-xl md:text-2xl font-black ${s.text}`}>{s.val}</div>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded text-white/90 inline-block">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Vibrant Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button onClick={() => alert("Searching active state & central portals...")} className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs font-bold flex items-center gap-2.5 text-cyan-300 shadow">
            <span className="text-base">🔍</span> Search Tenders
          </button>
          <button onClick={() => alert("Upload BOQ or tender document for gap analysis")} className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs font-bold flex items-center gap-2.5 text-purple-300 shadow">
            <span className="text-base">📄</span> Upload Documents
          </button>
          <button onClick={() => alert("Workspace initialized for court-compliant bid generation")} className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs font-bold flex items-center gap-2.5 text-emerald-300 shadow">
            <span className="text-base">📝</span> Create Bid
          </button>
          <button onClick={() => alert("Tracking all active invoices and EMD refunds")} className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs font-bold flex items-center gap-2.5 text-amber-300 shadow">
            <span className="text-base">💳</span> Track Payments
          </button>
        </div>

        {/* Recent Live Tenders */}
        <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">🔥 Recent Live Tenders</h2>
            <span className="text-xs text-cyan-400 font-bold cursor-pointer hover:underline">View All →</span>
          </div>
          <div className="space-y-2.5">
            {recentTenders.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">{t.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{t.match} Match</span>
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-white">{t.title}</h3>
                  <p className="text-[11px] text-slate-400">{t.dept} • {t.loc}</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-xs font-extrabold text-cyan-300">{t.val}</span>
                  <button onClick={() => alert(`Opening tender ${t.id} for AI Legal Application Generation`)} className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs shadow hover:opacity-90">
                    Generate Bid →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Chat Widget */}
        <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-3 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <h2 className="text-sm font-bold text-white">AI Tender Assistant (Online)</h2>
          </div>
          <p className="text-xs text-slate-300">Ask me anything about tenders, eligibility, documents, or bid strategy.</p>
          <div className="flex gap-2">
            <input type="text" placeholder="Type your question or query..." className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400" />
            <button onClick={() => alert("AI Assistant is analyzing your query...")} className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow">
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
