"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

function getDaysLeft(d: string | null) { if (!d) return null; return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

export default function WatchPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("tenders").select("*").eq("is_watched", true).order("created_at", { ascending: false });
    setTenders(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const unwatch = async (id: string) => {
    await supabase.from("tenders").update({ is_watched: false }).eq("id", id);
    load();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="text-blue-600 text-sm">← Dashboard</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">👁️ BidWell Watch</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tenders.length} tenders monitored</p>
      </div>

      <div className="p-5 space-y-3">
        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          tenders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-3">👁️</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Abhi koi tender watch nahi kar rahe.</p>
              <p className="text-xs text-gray-400 mt-1">Tenders page par 👁️ button daba kar watch karo.</p>
              <Link href="/tenders"><button className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-sm">Go to Tenders</button></Link>
            </div>
          ) : tenders.map((t) => {
            const dl = getDaysLeft(t.deadline);
            return (
              <div key={t.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-gray-900 dark:text-white text-sm flex-1 pr-2 leading-tight">{t.title}</p>
                  <button onClick={() => unwatch(t.id)} className="text-xs text-red-600 font-semibold">✕</button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.department}</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded font-semibold">₹{t.value_in_cr} Cr</span>
                  {dl !== null && (<span className={`text-xs font-semibold ${dl <= 3 ? "text-red-600" : dl <= 7 ? "text-orange-600" : "text-gray-500"}`}>{dl > 0 ? `${dl}d left` : "Expired"}</span>)}
                </div>
                <Link href={`/tenders/${t.id}`}>
                  <button className="w-full mt-3 bg-blue-600 text-white font-bold py-2 rounded-xl text-xs">View Tender</button>
                </Link>
              </div>
            );
          })}
      </div>
      <BottomNav />
    </main>
  );
}
