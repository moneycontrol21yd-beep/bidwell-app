"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { WalletIcon } from "@/components/icons";
import { generateInvoicePDF } from "@/lib/invoice-pdf";

export default function Invoices() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [invoices, setInvoices] = useState<any[]>([]);
  const [contract, setContract] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newInv, setNewInv] = useState({ invoice_no: "", amount: "" });

  const load = async () => {
    const { data: invs } = await supabase.from("invoices").select("*").eq("contract_id", id).order("submitted_at", { ascending: false });
    const { data: con } = await supabase.from("contracts").select("*").eq("id", id).single();
    const { data: comp } = await supabase.from("companies").select("*").limit(1).maybeSingle();
    setInvoices(invs || []);
    setContract(con);
    setCompany(comp);
    setLoading(false);
  };
  useEffect(() => { if (id) load(); }, [id]);

  const add = async () => {
    if (!newInv.invoice_no || !newInv.amount) return alert("Details daalo");
    await supabase.from("invoices").insert({ contract_id: id, invoice_no: newInv.invoice_no, amount: parseFloat(newInv.amount), status: "submitted" });
    setNewInv({ invoice_no: "", amount: "" }); setShowForm(false); load();
  };
  const updateStatus = async (invId: string, status: string) => {
    await supabase.from("invoices").update({ status, paid_at: status === "paid" ? new Date().toISOString() : null }).eq("id", invId);
    load();
  };
  const remove = async (invId: string) => {
    if (!confirm("Delete karna hai?")) return;
    await supabase.from("invoices").delete().eq("id", invId);
    load();
  };

  const handleDownload = (inv: any) => {
    try {
      generateInvoicePDF(inv, contract, company);
    } catch (e: any) {
      alert("PDF error: " + e.message);
    }
  };

  const fmt = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)} K`;
    return `₹${n}`;
  };

  const submitted = invoices.filter(i => i.status === "submitted").reduce((s, i) => s + (i.amount || 0), 0);
  const approved = invoices.filter(i => i.status === "approved").reduce((s, i) => s + (i.amount || 0), 0);
  const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href={`/contracts/${id}`} className="text-blue-600 text-xs font-bold tracking-wide">← CONTRACT</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Invoices</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Billing & payments</p>
      </div>

      <div className="px-5 grid grid-cols-3 gap-3 mt-4 mb-4">
        <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/40 text-center">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Submitted</p>
          <p className="text-sm font-bold text-orange-600 mt-1">{fmt(submitted)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-center">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Approved</p>
          <p className="text-sm font-bold text-blue-600 mt-1">{fmt(approved)}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-2xl border border-green-100 dark:border-green-900/40 text-center">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">Paid</p>
          <p className="text-sm font-bold text-green-600 mt-1">{fmt(paid)}</p>
        </div>
      </div>

      <div className="px-5 space-y-3">
        <button onClick={() => setShowForm(!showForm)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 text-sm tracking-wide">
          {showForm ? "CANCEL" : "+ NEW INVOICE"}
        </button>

        {showForm && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border-2 border-blue-200 dark:border-blue-800 space-y-3">
            <input placeholder="Invoice No (INV-1050)" value={newInv.invoice_no} onChange={(e) => setNewInv({ ...newInv, invoice_no: e.target.value })} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            <input type="number" placeholder="Amount (₹)" value={newInv.amount} onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            <button onClick={add} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">Create Invoice</button>
          </div>
        )}

        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          invoices.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
              <WalletIcon size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Koi invoice nahi hai</p>
            </div>
          ) : invoices.map((inv) => (
            <div key={inv.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{inv.invoice_no}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{new Date(inv.submitted_at).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">₹{inv.amount.toLocaleString("en-IN")}</p>
                  <button onClick={() => remove(inv.id)} className="text-red-500 text-[10px] font-bold mt-1">Delete</button>
                </div>
              </div>

              <select value={inv.status} onChange={(e) => updateStatus(inv.id, e.target.value)} className={`w-full text-[11px] font-bold tracking-wide px-3 py-2.5 rounded-lg border-0 mb-3 ${inv.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : inv.status === "approved" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                <option value="submitted">SUBMITTED</option>
                <option value="approved">APPROVED</option>
                <option value="paid">PAID</option>
              </select>

              <button onClick={() => handleDownload(inv)} className="w-full bg-gray-800 dark:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-xs tracking-wide flex items-center justify-center">
                📄 DOWNLOAD PDF
              </button>
            </div>
          ))}
      </div>
    </main>
  );
}
