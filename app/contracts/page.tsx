import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function getHealth(c: any) {
  const now = new Date();
  const endDate = c.end_date ? new Date(c.end_date) : null;
  const daysLeft = endDate
    ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (daysLeft !== null && daysLeft < 0) {
    return { label: "🔴 At Risk", bg: "bg-red-50", text: "text-red-700", reason: "Contract expire ho gaya" };
  }
  if (daysLeft !== null && daysLeft <= 30) {
    return { label: "🟠 Attention", bg: "bg-orange-50", text: "text-orange-700", reason: `Contract ${daysLeft} din me khatam` };
  }
  if ((c.receivable_in_lakh || 0) > 500) {
    return { label: "🟠 Attention", bg: "bg-orange-50", text: "text-orange-700", reason: "₹5Cr+ receivable pending" };
  }
  return { label: "🟢 Healthy", bg: "bg-green-50", text: "text-green-700", reason: "Sab track par hai" };
}

export default async function Contracts() {
  const { data: contracts } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  const list = contracts || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Contract Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">{list.length} active contracts</p>
      </div>

      <div className="p-5 space-y-4">
        {list.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center">
            <p className="text-gray-500 text-sm">Abhi koi contract nahi hai.</p>
            <Link href="/bids">
              <p className="text-blue-600 text-xs mt-2 font-medium">Bids page par jaake "Mark as Won" dabao →</p>
            </Link>
          </div>
        ) : (
          list.map((c: any) => {
            const h = getHealth(c);
            return (
              <Link href={`/contracts/${c.id}`} key={c.id}>
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                  <p className="font-bold text-gray-900 text-sm leading-tight mb-3">{c.title}</p>

                  <div className={`${h.bg} p-3 rounded-xl mb-3 flex items-center justify-between`}>
                    <div>
                      <p className={`text-sm font-bold ${h.text}`}>{h.label}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{h.reason}</p>
                    </div>
                    <span className="text-gray-400">›</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Value</p>
                      <p className="font-bold text-gray-900 mt-1 text-sm">₹{c.value_in_cr} Cr</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Receivable</p>
                      <p className="font-bold text-orange-600 mt-1 text-sm">₹{c.receivable_in_lakh} L</p>
                    </div>
                  </div>

                  {c.end_date && (
                    <p className="text-xs text-gray-400 text-center mt-3">
                      End: {new Date(c.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
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
