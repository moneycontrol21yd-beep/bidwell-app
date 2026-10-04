"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { WalletIcon, ClockIcon, CheckSquareIcon, AlertIcon } from "@/components/icons";

export default function Payments() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: invs } = await supabase.from("invoices").select("*").order("submitted_at", { ascending: false });
    const { data: cons } = await supabase.from("contracts").select("*");
    setInvoices(invs || []);
    setContracts(cons || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)} K`;
    return `₹${n}`;
  };

  const submitted = invoices.filter(i => i.status === "submitted").reduce((s, i) => s + (i.amount || 0), 0);
  const approved = invoices.filter(i => i.status === "approved").reduce((s, i) => s + (i.amount || 0), 0);
  const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);
  const overdue = invoices.filter(i => i.status === "submitted" && new Date(i.submitted_at).getTime() < Date.now() - 30 * 86400000).reduce((s, i) => s + (i.amount || 0), 0);
  const totalReceivable = contracts.reduce((s, c) => s + (c.receivable_in_lakh || 0), 0) * 100000;

  const contractMap: any = {};
  contracts.forEach((c: any) => { contractMap[c.id] = c.title; });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-5 pt-6 pb-24 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <p className="text-blue-100/80 text-xs font-medium tracking-wide uppercase">Total Receivable</p>
          <h1 className="text-4xl font-bold mt-2 tracking-tight">{fmt(totalReceivable)}</h1>
          <p className="text-blue-100/70 text-xs mt-2 font-medium">{contracts.length} active contracts · {invoices.length} invoices</p>
        </div>
      </div>

      <div className="px-5 -mt-14 relative z-20">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xl shadow-blue-600/5 border border-gray-100 dark:border-gray-800 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl">
              <div className="flex items-center mb-1">
                <ClockIcon size={14} className="text-orange-600 mr-1.5" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Submitted</p>
              </div>
              <p className="font-bold text-orange-600 text-sm mt-1">{fmt(submitted)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl">
              <div className="flex items-center mb-1">
                <CheckSquareIcon size={14} className="text-blue-600 mr-1.5" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Approved</p>
              </div>
              <p className="font-bold text-blue-600 text-sm mt-1">{fmt(approved)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl">
              <div className="flex items-center mb-1">
                <CheckSquareIcon size={14} className="text-green-600 mr-1.5" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Paid</p>
              </div>
              <p className="font-bold text-green-600 text-sm mt-1">{fmt(paid)}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-xl">
              <div className="flex items-center mb-1">
                <AlertIcon size={14} className="text-red-600 mr-1.5" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Overdue</p>
              </div>
              <p className="font-bold text-red-600 text-sm mt-1">{fmt(overdue)}</p>
            </div>
          </div>
        </div>

        {overdue > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-3">🔴 PAYMENT FOLLOW-UP</h2>
            <div className="space-y-2">
              {invoices.filter(i => i.status === "submitted" && new Date(i.submitted_at).getTime() < Date.now() - 30 * 86400000).map((inv) => {
                const days = Math.ceil((Date.now() - new Date(inv.submitted_at).getTime()) / 86400000);
                return (
                  <div key={inv.id} className="bg-white dark:bg-gray-900 border-l-4 border-red-500 p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">{inv.invoice_no}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{contractMap[inv.contract_id] || "Contract"}</p>
                      </div>
                      <p className="font-bold text-red-600 text-sm">{fmt(inv.amount)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] text-red-600 font-bold tracking-wide uppercase">{days} days overdue</span>
                      <button className="text-[11px] bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg tracking-wide">REMIND</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-3">ALL INVOICES</p>
        <div className="space-y-2">
          {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
            invoices.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
                <WalletIcon size={28} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Koi invoice nahi hai</p>
              </div>
            ) : invoices.map((inv) => (
              <div key={inv.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">{inv.invoice_no}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{contractMap[inv.contract_id] || "Contract"}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(inv.submitted_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{fmt(inv.amount)}</p>
                    <span className={`text-[10px] font-bold tracking-wide uppercase ${inv.status === "paid" ? "text-green-600" : inv.status === "approved" ? "text-blue-600" : "text-orange-600"}`}>{inv.status}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
