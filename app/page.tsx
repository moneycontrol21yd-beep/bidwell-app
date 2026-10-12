"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [showScannerModal, setShowScannerModal] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-5 rounded-2xl border border-indigo-800/50 shadow-lg">
        <span className="text-[10px] text-indigo-300 font-mono font-bold uppercase tracking-widest block">
          CONTRACTOR DASHBOARD
        </span>
        <h1 className="text-2xl font-black mt-1 text-white">Shivam Security Services Pvt. Ltd.</h1>
        
        <div className="mt-4 relative">
          <input 
            type="text" 
            placeholder="Search tenders by keyword, city, or department..." 
            className="w-full bg-slate-950/80 border border-indigo-500/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
          />
          <span className="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Unified Scanner Quick Action */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h2>
        
        {/* Single Unified Card */}
        <div 
          onClick={() => setShowScannerModal(true)}
          className="bg-slate-900 border border-indigo-500/30 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-indigo-400 transition group shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="text-2xl bg-indigo-950 p-2.5 rounded-lg border border-indigo-800/50">
              📸📄
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                AI Tender Scanner & Brain
              </h3>
              <p className="text-xs text-slate-400">Camera Scan or PDF Upload for Instant Audit</p>
            </div>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-3 py-2 rounded-lg shadow transition">
            Open Scanner
          </button>
        </div>
      </div>

      {/* Active Matched Tender Preview Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-indigo-400 uppercase">PUBLIC WORKS DEPT (PWD)</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-full">
            95% Match
          </span>
        </div>
        
        <h3 className="font-bold text-base text-slate-100">Supply of Security Guards & Manpower Setup</h3>
        <p className="text-xs text-slate-400">Matched based on your ISO 9001 certification, PSARA license, and prior MP region experience.</p>
        
        <Link 
          href="/brain" 
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-lg transition"
        >
          Explore AI Scan & Match
        </Link>
      </div>

      {/* Modal Popup with Camera & PDF Options */}
      {showScannerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowScannerModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>
            
            <div className="text-center">
              <span className="text-2xl">🧠</span>
              <h3 className="text-lg font-black text-white mt-1">Select Scan Option</h3>
              <p className="text-xs text-slate-400 mt-0.5">Choose how you want to import your tender document</p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option 1: Camera */}
              <label className="flex items-center space-x-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-3 rounded-xl cursor-pointer transition">
                <span className="text-xl">📸</span>
                <div className="flex-1">
                  <strong className="text-xs block text-slate-100">Camera Capture</strong>
                  <span className="text-[10px] text-slate-400">Take a photo of Notice or BOQ</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={() => {
                    setShowScannerModal(false);
                    alert("Camera photo captured! Brain processing document...");
                  }}
                />
              </label>

              {/* Option 2: PDF Upload */}
              <label className="flex items-center space-x-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-3 rounded-xl cursor-pointer transition">
                <span className="text-xl">📄</span>
                <div className="flex-1">
                  <strong className="text-xs block text-slate-100">Upload PDF File</strong>
                  <span className="text-[10px] text-slate-400">Choose NIT / BOQ PDF from device</span>
                </div>
                <input 
                  type="file" 
                  accept=".pdf,image/*" 
                  className="hidden" 
                  onChange={() => {
                    setShowScannerModal(false);
                    alert("PDF uploaded successfully! Brain analyzing compliance...");
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 py-2 px-6 flex justify-around text-[10px] font-bold text-slate-400 z-40 max-w-4xl mx-auto">
        <Link href="/" className="text-amber-400 flex flex-col items-center">
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <Link href="/brain" className="hover:text-slate-200 flex flex-col items-center">
          <span>📋</span>
          <span>Tenders</span>
        </Link>
        <Link href="/brain" className="hover:text-slate-200 flex flex-col items-center">
          <span>💼</span>
          <span>Bids</span>
        </Link>
        <Link href="/brain" className="hover:text-slate-200 flex flex-col items-center">
          <span>🧠</span>
          <span>Brain</span>
        </Link>
      </nav>
    </main>
  );
}
