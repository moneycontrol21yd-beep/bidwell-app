"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    setNotifs(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    load();
  };

  const typeIcon = (t: string) => {
    const map: any = { deadline: "🔴", payment: "🟠", document: "🔵", tender: "🟢", corrigendum: "⚠️" };
    return map[t] || "📌";
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="text-blue-600 text-sm">← Dashboard</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">🔔 Notifications</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notifs.filter(n => !n.is_read).length} unread</p>
      </div>

      <div className="p-5 space-y-3">
        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          notifs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-3">🔔</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Abhi koi notification no hai.</p>
              <p className="text-xs text-gray-400 mt-1">Watch tenders — updates will appear here.</p>
            </div>
          ) : notifs.map((n) => (
            <div key={n.id} onClick={() => markRead(n.id)} className={`p-4 rounded-2xl shadow-sm cursor-pointer ${n.is_read ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"}`}>
              <div className="flex items-start">
                <span className="text-2xl mr-3">{typeIcon(n.type)}</span>
                <div className="flex-1">
                  <p className={`text-sm ${n.is_read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white font-bold"}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{new Date(n.created_at).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <BottomNav />
    </main>
  );
}
