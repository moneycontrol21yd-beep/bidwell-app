"use client";
import React, { useState } from 'react';

export default function CompanyBrainPage() {
  const [selectedFilter, setSelectedFilter] = useState('matched');

  const contractorProfile = {
    companyName: "Shivam Security Services Pvt. Ltd.",
    state: "Madhya Pradesh",
    turnoverInLakhs: 250,
    isoCertified: true,
    psaraLicense: true,
  };

  const tenderData = [
    {
      id: "TND-2026-8801",
      title: "Supply of Security Personnel & Surveillance Staff",
      department: "Public Works Dept (PWD)",
      state: "Madhya Pradesh",
      estimatedValue: "₹1.8 Crores",
      matchScore: 95,
      status: "Active",
      winningForecast: "High Chance (L1 Estimate: ₹1.65 Cr)",
      insights: "Matches ISO 9001 + PSARA license requirement. Prior MP region experience gives top priority.",
    },
    {
      id: "TND-2026-9042",
      title: "Smart City Facility Management & Guard Services",
      department: "Smart City Indore",
      state: "Madhya Pradesh",
      estimatedValue: "₹3.2 Crores",
      matchScore: 88,
      status: "Active",
      winningForecast: "Moderate Chance (Top Rival: L&T Infra)",
      insights: "Turnover criteria met. Additional manpower deployment certificate required.",
    },
    {
      id: "PRED-2026-102",
      title: "Upcoming Q4 Highway Security & Maintenance Setup",
      department: "NHAI / Regional Zone",
      state: "Madhya Pradesh",
      estimatedValue: "₹5.5 Crores",
      matchScore: 82,
      status: "Predicted (Next 6 Months)",
      winningForecast: "Pre-Notice Notice Expected in Nov 2026",
      insights: "State infrastructure budget allocation increased by 22%. High-value tender pipeline detected.",
    },
    {
      id: "RETND-2026-009",
      title: "CCTV Installation & Campus Monitoring",
      department: "Health Department MP",
      state: "Madhya Pradesh",
      estimatedValue: "₹75 Lakhs",
      matchScore: 90,
      status: "Cancelled & Retendering Soon",
      winningForecast: "Single bidder cancellation in Round 1",
      insights: "Re-issue expected with relaxed experience clause. Fast-track approval zone.",
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">
            🧠 BidWell Intelligence Brain
          </span>
          <h1 className="text-2xl font-black mt-1">GovWin IQ Intelligence Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalized for <strong className="text-slate-200">{contractorProfile.companyName}</strong> ({contractorProfile.state})
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-mono font-bold">
            Pan-India Engine Active
          </span>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-800/60 p-3 rounded-lg">
          <span className="text-slate-400 block text-[10px]">Annual Turnover</span>
          <strong className="text-amber-300 text-sm">₹{contractorProfile.turnoverInLakhs} Lakhs</strong>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-lg">
          <span className="text-slate-400 block text-[10px]">Certifications</span>
          <strong className="text-emerald-400 text-sm">ISO 9001 + PSARA</strong>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-lg">
          <span className="text-slate-400 block text-[10px]">Primary Operating Zone</span>
          <strong className="text-slate-200 text-sm">{contractorProfile.state}</strong>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-lg">
          <span className="text-slate-400 block text-[10px]">Target Scale</span>
          <strong className="text-indigo-300 text-sm">Micro to Enterprise</strong>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button 
          onClick={() => setSelectedFilter('matched')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedFilter === 'matched' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
        >
          🎯 Top Matched Tenders
        </button>
        <button 
          onClick={() => setSelectedFilter('predicted')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedFilter === 'predicted' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
        >
          🔮 Next 6-Month Pipeline
        </button>
        <button 
          onClick={() => setSelectedFilter('retender')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedFilter === 'retender' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
        >
          🔄 Re-Tenders & Cancelled
        </button>
      </div>

      {/* Tender Cards Listing */}
      <div className="space-y-4">
        {tenderData.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{item.id}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    {item.matchScore}% Profile Match
                  </span>
                </div>
                <h3 className="font-bold text-base mt-1 text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.department} • {item.state}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Est. Value</span>
                <span className="text-sm font-bold text-amber-300">{item.estimatedValue}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Status & Forecast</span>
                <p className="text-indigo-300 font-semibold">{item.winningForecast}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">AI Match Insight</span>
                <p className="text-slate-300">{item.insights}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
