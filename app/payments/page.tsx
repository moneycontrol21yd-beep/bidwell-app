import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Payments() {
  const { data: contracts } = await supabase.from("contracts").select("*");
  const { data: invoices } = await supabase.from("invoices").select("*");

  const list = contracts || [];
  const allInv = invoices || [];

  const totalInvoiced = allInv.reduce((s, i) => s + (i.amount || 0), 0);
  const submitted = allInv.filter(i => i.status === "submitted").reduce((s, i) => s + (i.amount || 0), 0);
  const approved = allInv.filter(i => i.status === "approved").reduce((s, i) => s + (i.amount || 0), 0);
  const paid = allInv.filter(i => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);
  const pending = submitted + approved;

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)} K`;
    return `₹${n}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-6">
        <p className="text-blue-200 text-sm">Total Receivable (Pending)</p>
        <h1 className="text-4xl font-bold mt-1">{fmt(pending)}</h1>
        <p className="text-blue-200 text-xs mt-2">
          {allInv.filter(i => i.status !== "paid").length} pending invoices · {allInv.filter(i => i.status === "paid").length} paid
        </p>
      </div>

      <div className="p-5 -mt-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm mb-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-500">Submitted</p>
              <p className="font-bold text-orange-600 mt-1 text-sm">{fmt(submitted)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Approved</p>
              <p className="font-bold text-blue-600 mt-1 text-sm">{fmt(approved)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Paid</p>
              <p className="font-bold text-green-600 mt-1 text-sm">{fmt(paid)}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Collection Progress</span>
              <span>{totalInvoiced > 0 ? Math.round((paid / totalInvoiced) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${totalInvoiced > 0 ? (paid / totalInvoiced) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Total invoiced: {fmt(totalInvoiced)}
            </p>
          </div>
        </div>

        <h2 className="font-bold text-gray-900 mb-3">Recent Invoices</h2>
        <div className="space-y-2">
          {allInv.length > 0 ? (
            allInv.slice(0, 10).map((inv: any) => (
              <Link href={`/contracts/${inv.contract_id}`} key={inv.id}>
                <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{inv.invoice_no}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(inv.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">₹{inv.amount.toLocaleString("en-IN")}</p>
                    <span className={`text-xs font-semibold ${
                      inv.status === "paid" ? "text-green-600" :
                      inv.status === "approved" ? "text-blue-600" :
                      "text-orange-600"
                    }`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center">
              <p className="text-gray-500 text-sm">Abhi koi invoice nahi hai.</p>
              <p className="text-xs text-gray-400 mt-1">Contracts page se invoice banao</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
