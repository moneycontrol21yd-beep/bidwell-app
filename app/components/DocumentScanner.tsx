"use client";
import React, { useState } from 'react';

export default function DocumentScanner() {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-slate-200">📷 AI Document & Tender Scanner</h4>
          <p className="text-xs text-slate-400">PDF Upload karein ya Camera se photo kheenchin</p>
        </div>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-1 rounded">
          OCR Enabled
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* PDF Upload Button */}
        <label className="flex flex-col items-center justify-center p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 border-dashed rounded-lg cursor-pointer transition">
          <span className="text-2xl mb-1">📄</span>
          <span className="text-xs font-semibold text-slate-300">Upload Tender PDF</span>
          <span className="text-[10px] text-slate-500">Files up to 50MB</span>
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>

        {/* Camera Snap Button */}
        <label className="flex flex-col items-center justify-center p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 border-dashed rounded-lg cursor-pointer transition">
          <span className="text-2xl mb-1">📸</span>
          <span className="text-xs font-semibold text-slate-300">Take Photo</span>
          <span className="text-[10px] text-slate-500">Auto Scan via Camera</span>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      </div>

      {fileName && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 p-2 rounded text-xs text-emerald-300 flex justify-between items-center">
          <span>✅ Selected: {fileName}</span>
          <span className="animate-pulse text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">Ready for Scanning...</span>
        </div>
      )}
    </div>
  );
}
