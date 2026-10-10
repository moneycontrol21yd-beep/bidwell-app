"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [tab, setTab] = useState("all");
  const [results, setResults] = useState<any>({ tenders: [], contracts: [], invoices: [] });
  const [loading, setLoading] = useState(false);

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults({ tenders: [], contracts: [], invoices: [] });
      return;
    }
    setLoading(true);
    const pattern = `%${q}%`;
    try {
      const [t, c, i] = await Promise.all([
        supabase.from("tenders").select("*").or(`title.ilike.${pattern},department.ilike.${pattern}`).limit(20),
        supabase.from("contracts").select("*").ilike("title", pattern).limit(10),
        supabase.from("invoices").select("*").ilike("invoice_no", pattern).limit(10),
      ]);
      setResults({
        tenders: t.data || [],
        contracts: c.data || [],
        invoices: i.data || [],
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => search(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const startVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert("Voice not supported on this browser");
      return;
    }
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setQuery(text);
    };
    rec.start();
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "tenders", label: "Tenders" },
    { key: "contracts", label: "Contracts" },
    { key: "invoices", label: "Invoices" },
  ];

  const showTenders = tab === "all" || tab === "tenders";
  const showContracts = tab === "all" || tab === "contracts";
  const showInvoices = tab === "all" || tab === "invoices";
  const total = (showTenders ? results.tenders.length : 0) + (showContracts ? results.contracts.length : 0) + (showInvoices ? results.invoices.length : 0);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 pt-5 pb-6">
        <Link href="/dashboard" className="text-blue-100/80 text-xs font-bold tracking-wide">← BACK</Link>
        <h1 className="text-2xl font-bold mt-2">🔍 Search</h1>
        <p className="text-blue-100/70 text-xs mt-1">Search tenders, contracts, and documents</p>

        <div className="mt-4 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            autoFocus
            className="w-full bg-white/95 text-gray-900 rounded-2xl pl-12 pr-14 py-3.5 text-sm font-medium outline-none shadow-lg"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
          <button
            onClick={startVoice}
            className={`absolute right-3 top-2.5 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold ${
              listening ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-blue-600 to-indigo-600"
            }`}
          >
            🎤
          </button>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-[11px] font-bold ${
                tab === t.key
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500 text-sm mt-6">Searching...</p>
      )}

      {!loading && !query && (
        <div className="px-5 mt-6">
          <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">Try These</p>
          <div className="space-y-2">
            {["Security tenders", "Housekeeping contract", "Pending invoices", "My ISO certificate", "Today's new tenders"].map((s, i) => (
              <button
                key={i}
                onClick={() => setQuery(s)}
                className="w-full text-left bg-white dark:bg-gray-900 rounded-xl p-3 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
              >
                💡 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && query && total === 0 && (
        <div className="px-5 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-sm">No results found for "{query}" ke liye</p>
          </div>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="px-5 mt-4 space-y-3">
          <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500">{total} Results</p>

          {showTenders && results.tenders.map((t: any) => (
            <Link
              key={t.id}
              href={`/tenders/${t.id}`}
              className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">📋</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">{t.title}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{t.department || "N/A"}</p>
                </div>
              </div>
            </Link>
          ))}

          {showContracts && results.contracts.map((c: any) => (
            <Link
              key={c.id}
              href={`/contracts/${c.id}`}
              className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">{c.title}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Contract</p>
                </div>
              </div>
            </Link>
          ))}

          {showInvoices && results.invoices.map((i: any) => (
            <Link
              key={i.id}
              href={`/payments`}
              className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">💰</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{i.invoice_no}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{i.status}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
