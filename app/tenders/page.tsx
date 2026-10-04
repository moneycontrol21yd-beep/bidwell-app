import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { SparklesIcon } from "@/components/icons";

function getDaysLeft(d: string | null) { if (!d) return null; return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

export default async function Tenders() {
  const { data: tenders } = await supabase.from("tenders").select("*").order("created_at", { ascending: false });
  const list = (tenders || []).filter((t: any) => t.status === "active");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">All Tenders</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{list.length} tenders available</p>
      </div>

      <div className="p-5">
        <Link href="/live-tenders">
          <button className="w-full mb-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-500/20 text-sm tracking-wide flex items-center justify-center">
            🔴 Live Tenders — For Me | Filter
          </button>
        </Link>

        <div className="space-y-3">
          {list.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 text-sm">Koi tender nahi hai</p>
              <Link href="/live-tenders">
                <button className="mt-3 text-blue-600 font-bold text-sm">Live Tenders fetch karo</button>
              </Link>
            </div>
          ) : list.map((t: any) => {
            const dl = getDaysLeft(t.deadline);
            return (
              <Link href={`/tenders/${t.id}`} key={t.id}>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-3">
                  <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{t.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.department}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">₹{t.value_in_cr || 0} Cr</span>
                    {dl !== null && (
                      <span className={`text-xs font-bold ${dl <= 3 ? "text-red-600" : dl <= 7 ? "text-orange-600" : "text-gray-500"}`}>
                        {dl > 0 ? `${dl}d` : "Expired"}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
