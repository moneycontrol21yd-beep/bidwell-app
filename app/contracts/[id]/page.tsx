"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { UsersIcon, FileTextIcon, WalletIcon, CheckSquareIcon } from "@/components/icons";

export default function ContractDetail() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [contract, setContract] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: c } = await supabase.from("contracts").select("*").eq("id", id).single();
      const { data: t } = await supabase.from("tasks").select("*").eq("contract_id", id);
      const { data: i } = await supabase.from("invoices").select("*").eq("contract_id", id);
      setContract(c); setTasks(t || []); setInvoices(i || []);
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6"><p className="text-center text-gray-500 text-sm py-10">Loading...</p></main>;
  if (!contract) return <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6"><p className="text-center text-red-500 text-sm py-10">Contract no mila</p></main>;

  const totalInvoiced = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);
  const pending = totalInvoiced - totalPaid;
  const doneTasks = tasks.filter(t => t.status === "completed").length;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-5 pt-5 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <Link href="/contracts" className="text-blue-100/80 text-xs font-bold tracking-wide">← CONTRACTS</Link>
          <h1 className="text-lg font-bold mt-3 leading-tight tracking-tight">{contract.title}</h1>
          <span className="text-[10px] bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-bold mt-2 inline-block tracking-wide uppercase">{contract.status}</span>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-100/70 font-bold tracking-wider uppercase">Value</p>
              <p className="font-bold text-sm mt-1">₹{contract.value_in_cr} Cr</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-100/70 font-bold tracking-wider uppercase">Invoiced</p>
              <p className="font-bold text-sm mt-1">₹{(totalInvoiced/100000).toFixed(1)}L</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-100/70 font-bold tracking-wider uppercase">Pending</p>
              <p className="font-bold text-sm mt-1">₹{(pending/100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 -mt-4 relative z-20 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <Link href={`/contracts/${id}/workforce`}>
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md active:scale-95 transition">
              <UsersIcon size={20} className="text-purple-600 mx-auto mb-1" />
              <p className="text-[9px] text-gray-600 dark:text-gray-400 font-bold tracking-wide uppercase">Workforce</p>
            </div>
          </Link>
          <Link href={`/contracts/${id}/tasks`}>
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md active:scale-95 transition">
              <CheckSquareIcon size={20} className="text-green-600 mx-auto mb-1" />
              <p className="text-[9px] text-gray-600 dark:text-gray-400 font-bold tracking-wide uppercase">Tasks</p>
            </div>
          </Link>
          <Link href={`/contracts/${id}/invoices`}>
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md active:scale-95 transition">
              <WalletIcon size={20} className="text-orange-600 mx-auto mb-1" />
              <p className="text-[9px] text-gray-600 dark:text-gray-400 font-bold tracking-wide uppercase">Invoices</p>
            </div>
          </Link>
          <Link href="/documents">
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md active:scale-95 transition">
              <FileTextIcon size={20} className="text-blue-600 mx-auto mb-1" />
              <p className="text-[9px] text-gray-600 dark:text-gray-400 font-bold tracking-wide uppercase">Docs</p>
            </div>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/contracts/${id}/tasks`}>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <CheckSquareIcon size={18} className="text-green-600" />
                <span className="text-[10px] text-gray-400 font-bold">→</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{doneTasks}/{tasks.length}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Tasks Done</p>
            </div>
          </Link>
          <Link href={`/contracts/${id}/invoices`}>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <WalletIcon size={18} className="text-orange-600" />
                <span className="text-[10px] text-gray-400 font-bold">→</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Invoices</p>
            </div>
          </Link>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 rounded-2xl">
          <p className="text-xs text-blue-900 dark:text-blue-300 font-bold mb-1">💡 Tip</p>
          <p className="text-[11px] text-gray-700 dark:text-gray-300">Manage Workforce, Tasks, Invoices and Documents from the 4 tabs above.</p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
