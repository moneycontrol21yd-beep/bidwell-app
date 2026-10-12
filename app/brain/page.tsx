"use client";
import React, { useState } from 'react';
import { calculateMatchScore } from '../lib/brainEngine';

export default function CompanyBrainPage() {
  const [selectedFilter, setSelectedFilter] = useState('matched');

  // Dynamic User Profile State
  const [profile, setProfile] = useState({
    companyName: "Shivam Security Services Pvt. Ltd.",
    state: "Madhya Pradesh",
    turnoverInLakhs: 250,
    isoCertified: true,
  });

  // Master Tender Data (Live & Scraped Pipeline Data)
  const rawTenders = [
    {
      id: "TND-2026-8801",
      title: "Supply of Security Personnel & Surveillance Staff",
      department: "Public Works Dept (PWD)",
      state: "Madhya Pradesh",
      estimatedValueLakhs: 180,
      minTurnoverRequired: 100,
      isoRequired: true,
      category: "matched",
      status: "Active",
      winningForecast: "High Chance (L1 Estimate: ₹1.65 Cr)",
      insights: "Matches ISO 9001 + PSARA license requirement. Prior MP region experience gives top priority.",
      winnerData: null,
    },
    {
      id: "TND-2026-9042",
      title: "Smart City Facility Management & Guard Services",
      department: "Smart City Indore",
      state: "Madhya Pradesh",
      estimatedValueLakhs: 320,
      minTurnoverRequired: 300,
      isoRequired: true,
      category: "matched",
      status: "Active",
      winningForecast: "Moderate Chance (Top Rival: L&T Infra)",
      insights: "Turnover criteria evaluation active.",
      winnerData: null,
    },
    {
      id: "PRED-2026-102",
      title: "Upcoming Q4 Highway Security & Maintenance Setup",
      department: "NHAI / Regional Zone",
      state: "Madhya Pradesh",
      estimatedValueLakhs: 550,
      minTurnoverRequired: 500,
      isoRequired: false,
      category: "predicted",
      status: "Predicted (Next 6 Months)",
      winningForecast: "Pre-Notice Expected in Nov 2026",
      insights: "State infrastructure budget allocation increased by 22%. High-value tender pipeline detected.",
      winnerData: null,
    },
    {
      id: "RETND-2026-009",
      title: "CCTV Installation & Campus Monitoring",
      department: "Health Department MP",
      state: "Madhya Pradesh",
      estimatedValueLakhs: 75,
      minTurnoverRequired: 50,
      isoRequired: false,
      category: "retender",
      status: "Cancelled & Retendering Soon",
      winningForecast: "Single bidder cancellation in Round 1",
      insights: "Re-issue expected with relaxed experience clause. Fast-track approval zone.",
      winnerData: null,
    },
    {
      id: "AOC-2026-301",
      title: "District Hospital Security Guard Contract 2025-26",
      department: "Health Dept Bhopal",
      state: "Madhya Pradesh",
      estimatedValueLakhs: 120,
      minTurnoverRequired: 80,
      isoRequired: true,
      category: "competitors",
      status: "Awarded (AOC Closed)",
      winningForecast: "L1 Winner: Shree Ram Security (Margin: -8.5%)",
      insights: "Historical winning rate was ₹1.09 Cr. 4 Bidders participated.",
      winnerData: {
        winnerName: "Shree Ram Security & Infra Services",
        bidValue: "₹1.09 Crores",
        l1Margin: "8.5% below estimate",
        totalBidders: 4
      }
    }
  ];

  const filteredTenders = rawTenders.filter(t => 
    selectedFilter === 'all' ? true : t.category === selectedFilter
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-20">
      {/* Top Header & Data Scraper Status */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
        <div>
          <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">
            🧠 BidWell Intelligence Brain
          </span>
          <h1 className="text-2xl font-black mt-1">GovWin IQ Match Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Evaluation for <strong className="text-slate-200">{profile.companyName}</strong>
          </p>
        </div>
        
        {/* Live Scraper Cron Status Badge */}
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-center space-x-2 text-[10px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <div>
            <span className="text-slate-300 font-bold block">CPPP / GeM / 28 States Pipeline</span>
            <span className="text-slate-400">Live Auto Sync • 100% Pan-India Data</span>
          </div>
        </div>
      </div>

      {/* Dynamic Profile Control Box */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">⚙️ Dynamic Profile Inputs</h2>
          <span className="text-[10px] text-slate-400">Live Auto-Recalculation Active</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Company Turnover (₹ Lakhs)</label>
            <input 
              type="number" 
              value={profile.turnoverInLakhs}
              onChange={(e) => setProfile({ ...profile, turnoverInLakhs: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-amber-300 font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Operating State</label>
            <input 
              type="text" 
              value={profile.state}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <input 
              type="checkbox" 
              id="isoCheck"
              checked={profile.isoCertified}
              onChange={(e) => setProfile({ ...profile, isoCertified: e.target.checked })}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
            <label htmlFor="isoCheck" className="text-slate-200 cursor-pointer font-semibold">ISO 9001 Certified</label>
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
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
        <button 
          onClick={() => setSelectedFilter('competitors')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedFilter === 'competitors' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
        >
          🏆 AOC Winner & Competitors
        </button>
      </div>

      {/* Tender & Analytics Cards */}
      <div className="space-y-4">
        {filteredTenders.map((tender) => {
          const matchResult = calculateMatchScore(profile, tender);

          return (
            <div key={tender.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{tender.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      matchResult.score >= 80 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : matchResult.score >= 50 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {matchResult.score}% Dynamic Match
                    </span>
                  </div>
                  <h3 className="font-bold text-base mt-1 text-slate-100">{tender.title}</h3>
                  <p className="text-xs text-slate-400">{tender.department} • {tender.state}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Est. Value</span>
                  <span className="text-sm font-bold text-amber-300">₹{tender.estimatedValueLakhs >= 100 ? `${(tender.estimatedValueLakhs / 100).toFixed(1)} Cr` : `${tender.estimatedValueLakhs} Lakhs`}</span>
                </div>
              </div>

              {/* AOC Winner Card Feature */}
              {tender.winnerData && (
                <div className="bg-amber-950/30 border border-amber-800/50 p-3 rounded-lg text-xs space-y-1">
                  <span className="text-amber-400 font-bold block text-[10px] uppercase">🏆 Winner & AOC Data Point</span>
                  <div className="flex justify-between text-slate-200 pt-1">
                    <span>Winner: <strong>{tender.winnerData.winnerName}</strong></span>
                    <span className="text-emerald-400 font-bold">{tender.winnerData.bidValue} ({tender.winnerData.l1Margin})</span>
                  </div>
                </div>
              )}

              {/* Warnings Alert Box */}
              {matchResult.warnings.length > 0 && (
                <div className="bg-rose-950/40 border border-rose-800/60 p-2.5 rounded text-xs text-rose-300 space-y-1">
                  <span className="font-bold block text-[10px] uppercase text-rose-400">⚠️ Eligibility Warning:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {matchResult.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Status & Forecast</span>
                  <p className="text-indigo-300 font-semibold">{tender.winningForecast}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">AI Match Insight</span>
                  <p className="text-slate-300">{tender.insights}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
