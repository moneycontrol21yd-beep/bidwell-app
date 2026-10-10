"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

function getDaysLeft(d: string | null) { if (!d) return null; return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

export default function WatchPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const load = async () => {
    const { data } = await supabase.from("tenders").select("*").eq("is_watched", true).order("created_at", { ascending: false });
    setTenders(data || []);
    setLastChecked(new Date());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const unwatch = async (id: string) => {
    if (!confirm("Watch se hatana hai?")) return;
    await supabase.from("tenders").update({ is_watched: false }).eq("id", id);
    load();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <div className="flex justify-between items-center mt-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">BidWell Watch</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {tenders.length} tenders monitored
              {lastChecked && ` · Checked ${Math.floor((Date.now() - lastChecked.getTime()) / 60000)}m ago`}
            </p>
          </div>
          <button onClick={refresh} disabled={refreshing} className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-60">
            <span className={refreshing ? "animate-spin" : ""}>🔄</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl">
          <p className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">👁️ What is Watch?</p>
          <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
            Jo tenders tum watch karte ho, unke deadline change, corrigendum aane, ya cancellation ki alert yahan aayegi. Roz check karna.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm py-6">Loading...</p>
        ) : tenders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
            <div className="text-5xl mb-3">👁️</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No tenders being watched</p>
            <p className="text-xs text-gray-400 mt-1">Go to Tenders and tap the eye button</p>
            <Link href="/live-tenders">
              <button className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-sm">Go to Live Tenders</button>
            </Link>
          </div>
        ) : tenders.map((t) => {
          const dl = getDaysLeft(t.deadline);
          const urgent = dl !== null && dl <= 7 && dl > 0;
          return (
            <div key={t.id} className={`bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border-l-4 ${urgent ? "border-red-500" : "border-blue-500"}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-gray-900 dark:text-white text-sm flex-1 pr-2 leading-tight">{t.title}</p>
                <button onClick={() => unwatch(t.id)} className="text-xs text-red-600 font-bold">✕</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.department}</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded font-bold">₹{t.value_in_cr} Cr</span>
                {dl !== null && (
                  <span className={`text-xs font-bold ${dl <= 3 ? "text-red-600" : dl <= 7 ? "text-orange-600" : "text-gray-500"}`}>
                    {dl > 0 ? `${dl}d left` : "Expired"}
                  </span>
                )}
              </div>
              {urgent && (
                <div className="mt-3 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
                  <p className="text-[10px] text-red-700 dark:text-red-400 font-bold">⚠️ Deadline aa rahi hai</p>
                </div>
              )}
              <Link href={`/tenders/${t.id}`}>
                <button className="w-full mt-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2 rounded-xl text-xs">View Tender</button>
              </Link>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </main>
  );
}
