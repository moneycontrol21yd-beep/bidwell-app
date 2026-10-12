"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported on this browser.");
      return;
    }

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: new () => SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 pt-5 pb-6 rounded-b-[2rem] shadow-md">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-blue-200 hover:text-white mb-3"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Search Tenders</h1>
        <p className="text-xs text-blue-100 mt-1">
          Search across 70,000+ government tenders by keyword, location, or department
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Input Box */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything (e.g. Security, CCTV, PWD MP)..."
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
          <button
            onClick={handleVoiceSearch}
            className={`p-2.5 rounded-xl transition ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
            title="Voice Search"
          >
            🎤
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs active:scale-95 transition">
            Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
            Popular Categories
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Manpower Services", "Security Guards", "CCTV Installation", "Housekeeping", "Civil Works"].map((cat) => (
              <button
                key={cat}
                onClick={() => setQuery(cat)}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-xl text-gray-700 dark:text-gray-300 font-medium active:scale-95 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Placeholder */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center space-y-2">
          <span className="text-2xl block">🔍</span>
          <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {query ? `Showing results for "${query}"` : "Start typing to find tenders"}
          </div>
          <p className="text-xs text-gray-500">
            Enter keywords above or tap on popular categories to filter instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
