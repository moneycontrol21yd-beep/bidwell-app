"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RadarPage() {
  const [tab, setTab] = useState("forme");
  const [tenders, setTenders] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, c] = await Promise.all([
          supabase
            .from("tenders")
            .select("*")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(100),
          supabase.from("contracts").select("*").limit(20),
        ]);
        setTenders(t.data || []);
        setContracts(c.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Compute stats
  const now = Date.now();
  const newTenders = tenders.filter((t) => {
    const created = new Date(t.created_at).getTime();
    return now - created < 24 * 60 * 60 * 1000;
  });

  const endingSoon = tenders.filter((t) => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline).getTime();
    if (isNaN(d)) return false;
    const days = (d - now) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 7;
  });

  const topMatches = tenders
    .filter((t) => (t.match_score || 50) >= 70 || t.ai_summary)
    .slice(0, 5);

  const filtered =
    tab === "forme"
      ? tenders.filter((t) => t.ai_summary || (t.match_score || 50) >= 70).slice(0, 20)
      : tab === "upcoming"
      ? tenders
          .filter((t) => {
            if (!t.deadline) return false;
            const d = new Date(t.deadline).getTime();
            return !isNaN(d) && d > now + 7 * 24 * 60 * 60 * 1000;
          })
          .slice(0, 20)
      : tab === "ending"
      ? endingSoon.slice(0, 20)
      : tenders;

  const tabs = [
    { key: "forme", label: "For Me" },
    { key: "upcoming", label: "Upcoming" },
    { key: "ending", label: "Ending Soon" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white px-5 pt-5 pb-6 rounded-b-[2rem]">
        <Link href="/dashboard" className="text-purple-100/80 text-xs font-bold tracking-wide">
          ← DASHBOARD
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
            🎯
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Opportunity Radar</h1>
            <p className="text-purple-100/70 text-xs mt-0.5">
              {newTenders.length} new opportunities today
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">New Tenders</p>
            </div>
            <p className="text-white font-bold text-lg mt-1">{newTenders.length}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-lg">⏰</span>
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Ending Soon</p>
            </div>
            <p className="text-white font-bold text-lg mt-1">{endingSoon.length}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Changed</p>
            </div>
            <p className="text-white font-bold text-lg mt-1">0</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Cancelled</p>
            </div>
            <p className="text-white font-bold text-lg mt-1">0</p>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      {topMatches.length > 0 && (
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
              🏆 Top Opportunities for You
            </p>
            <Link href="/live-tenders" className="text-blue-600 text-xs font-bold">See All</Link>
          </div>

          <div className="space-y-2">
            {topMatches.slice(0, 3).map((t) => {
              const score = t.match_score || 50;
              return (
                <Link key={t.id} href={`/tenders/${t.id}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
                          {t.title?.slice(0, 90)}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">{t.department || "CPPP"}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        score >= 85 ? "bg-green-100 text-green-700" :
                        score >= 70 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {score}%
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="bg-blue-50 dark:bg-blue-950 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                        Match {score}%
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-2 py-1 rounded-full">
                        {t.source || "CPPP"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-5 mt-6">
        <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition ${
                tab === t.key
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tender List */}
      <div className="px-5 mt-4">
        {loading ? (
          <p className="text-center text-gray-500 text-sm py-8">Loading radar...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800">
            <p className="text-4xl mb-3">📡</p>
            <p className="text-gray-500 text-sm">No opportunities in this category</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((t) => {
              const days = t.deadline
                ? Math.ceil((new Date(t.deadline).getTime() - now) / (1000 * 60 * 60 * 24))
                : null;
              return (
                <Link key={t.id} href={`/tenders/${t.id}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition">
                    <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
                      {t.title?.slice(0, 100)}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">{t.department || "CPPP"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {days !== null && days > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          days <= 3 ? "bg-red-100 text-red-700" :
                          days <= 7 ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {days}d left
                        </span>
                      )}
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-2 py-1 rounded-full">
                        {t.source || "CPPP"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Contract Ending Soon (Early Opportunity) */}
      {contracts.length > 0 && (
        <div className="px-5 mt-6">
          <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">
            🔔 Contract Ending Soon
          </p>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500">
              {contracts.length} active contracts. When they expire, new tenders may be published.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
