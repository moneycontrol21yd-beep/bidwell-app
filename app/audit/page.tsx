"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default function Audit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
      setLogs(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/settings" className="text-blue-600 text-sm">← Settings</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">🔒 Audit Log</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{logs.length} activities</p>
      </div>
      <div className="p-5 space-y-2">
        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          logs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Koi activity no hai.</p>
            </div>
          ) : logs.map((l) => (
            <div key={l.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{l.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{l.resource}</p>
                </div>
                <p className="text-[10px] text-gray-400">{new Date(l.created_at).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
      </div>
      <BottomNav />
    </main>
  );
}
