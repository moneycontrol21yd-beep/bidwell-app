"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function GlobalNavbar() {
  const [lang, setLang] = useState("EN");
  const [isDark, setIsDark] = useState(true);

  return (
    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-sm shadow-lg">B</div>
        <div>
          <h1 className="text-sm font-extrabold text-cyan-400">BidWell Global</h1>
          <p className="text-[10px] text-slate-400">World-Class Tender Intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-xs text-slate-200 px-2 py-1 rounded-xl outline-none font-bold"
        >
          <option value="EN">🌐 English</option>
          <option value="HI">🇮🇳 Hindi (हिन्दी)</option>
          <option value="GU">🟢 Gujarati (ગુજરાતી)</option>
          <option value="MR">🟣 Marathi (मराठी)</option>
          <option value="TA">🔵 Tamil (தமிழ்)</option>
          <option value="TE">🟠 Telugu (తెలుగు)</option>
        </select>

        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)} 
          className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs"
        >
          {isDark ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
}
