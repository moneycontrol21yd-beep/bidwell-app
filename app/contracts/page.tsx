import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BuildingIcon, ChevronRightIcon } from "@/components/icons";

function getHealth(c: any) {
  const now = new Date();
  const endDate = c.end_date ? new Date(c.end_date) : null;
  const daysLeft = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
  if (daysLeft !== null && daysLeft < 0) return { label: "At Risk", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-500", text: "text-red-700 dark:text-red-400", reason: "Contract expired" };
  if (daysLeft !== null && daysLeft <= 30) return { label: "Attention", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-500", text: "text-orange-700 dark:text-orange-400", reason: `Contract ${daysLeft} din me khatam` };
  if ((c.receivable_in_lakh || 0) > 500) return { label: "Attention", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-500", text: "text-orange-700 dark:text-orange-400", reason: "₹5Cr+ payment pending" };
  return { label: "Healthy", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-500", text: "text-green-700 dark:text-green-400", reason: "All on track" };
}

export default async function Contracts() {
  const { data: contracts } = await supabase.from("contracts").select("*").order("created_at", { ascending: false });
  const list = contracts || [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 py-5 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Contracts</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{list.length} active contracts</p>
      </div>

      <div className="p-5 space-y-4">
        {list.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BuildingIcon size={28} className="text-blue-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Abhi koi contract no hai.</p>
            <Link href="/bids"><p className="text-blue-600 text-xs mt-2 font-bold">Mark as 'Awarded' in Bids →</p></Link>
          </div>
        ) : (
          list.map((c: any) => {
            const h = getHealth(c);
            return (
              <Link href={`/contracts/${c.id}`} key={c.id}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight tracking-tight">{c.title}</p>
                  </div>
                  <div className={`${h.bg} border-l-4 ${h.border} p-3.5 flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mr-3 ${h.border.replace("border-", "bg-")}`}></div>
                      <div>
                        <p className={`text-sm font-bold tracking-tight ${h.text}`}>{h.label}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{h.reason}</p>
                      </div>
                    </div>
                    <ChevronRightIcon size={16} className="text-gray-400" />
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Value</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm">₹{c.value_in_cr} Cr</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Receivable</p>
                      <p className="font-bold text-orange-600 mt-1 text-sm">₹{c.receivable_in_lakh} L</p>
                    </div>
                  </div>
                  {c.end_date && (
                    <p className="text-[10px] text-gray-400 text-center pb-3 font-semibold tracking-wide">
                      END: {new Date(c.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
      <BottomNav />
    </main>
  );
}
