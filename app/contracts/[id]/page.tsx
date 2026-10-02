"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default function ContractDetail() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const [contract, setContract] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showInvForm, setShowInvForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", due_date: "" });
  const [newInv, setNewInv] = useState({ invoice_no: "", amount: "" });

  const loadAll = async () => {
    const { data: c } = await supabase.from("contracts").select("*").eq("id", id).single();
    const { data: t } = await supabase.from("tasks").select("*").eq("contract_id", id).order("due_date");
    const { data: i } = await supabase.from("invoices").select("*").eq("contract_id", id).order("submitted_at", { ascending: false });
    setContract(c);
    setTasks(t || []);
    setInvoices(i || []);
    setLoading(false);
  };

  useEffect(() => { if (id) loadAll(); }, [id]);

  const addTask = async () => {
    if (!newTask.title) return alert("Title daalo");
    await supabase.from("tasks").insert({
      contract_id: id,
      title: newTask.title,
      due_date: newTask.due_date || null,
    });
    setNewTask({ title: "", due_date: "" });
    setShowTaskForm(false);
    loadAll();
  };

  const toggleTask = async (task: any) => {
    await supabase.from("tasks").update({
      status: task.status === "completed" ? "pending" : "completed",
    }).eq("id", task.id);
    loadAll();
  };

  const deleteTask = async (tid: string) => {
    await supabase.from("tasks").delete().eq("id", tid);
    loadAll();
  };

  const addInvoice = async () => {
    if (!newInv.invoice_no || !newInv.amount) return alert("Invoice no aur amount daalo");
    await supabase.from("invoices").insert({
      contract_id: id,
      invoice_no: newInv.invoice_no,
      amount: parseFloat(newInv.amount),
      status: "submitted",
    });
    setNewInv({ invoice_no: "", amount: "" });
    setShowInvForm(false);
    loadAll();
  };

  const updateInvStatus = async (invId: string, status: string) => {
    await supabase.from("invoices").update({
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    }).eq("id", invId);
    loadAll();
  };

  const deleteInvoice = async (invId: string) => {
    await supabase.from("invoices").delete().eq("id", invId);
    loadAll();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-center text-gray-500 text-sm py-10">Loading...</p>
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-center text-red-500 text-sm py-10">Contract nahi mila</p>
        <Link href="/contracts"><p className="text-blue-600 text-center text-sm">← Back</p></Link>
      </main>
    );
  }

  const totalInvoiced = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);
  const pending = totalInvoiced - totalPaid;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-5">
        <Link href="/contracts" className="text-blue-200 text-sm">← Contracts</Link>
        <h1 className="text-lg font-bold mt-3 leading-tight">{contract.title}</h1>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-semibold mt-2 inline-block">
          {contract.status}
        </span>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/10 p-2 rounded-xl text-center">
            <p className="text-xs text-blue-200">Value</p>
            <p className="font-bold text-sm mt-1">₹{contract.value_in_cr} Cr</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl text-center">
            <p className="text-xs text-blue-200">Invoiced</p>
            <p className="font-bold text-sm mt-1">₹{(totalInvoiced/100000).toFixed(1)}L</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl text-center">
            <p className="text-xs text-blue-200">Pending</p>
            <p className="font-bold text-sm mt-1">₹{(pending/100000).toFixed(1)}L</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900">📋 Tasks ({tasks.length})</h2>
            <button onClick={() => setShowTaskForm(!showTaskForm)} className="text-blue-600 text-sm font-semibold">
              {showTaskForm ? "Cancel" : "+ Add"}
            </button>
          </div>

          {showTaskForm && (
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-3 border-2 border-blue-200 space-y-3">
              <input
                placeholder="Task ka naam"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <button onClick={addTask} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">
                Save Task
              </button>
            </div>
          )}

          {tasks.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4 bg-white rounded-2xl">Koi task nahi hai</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="bg-white p-3 rounded-2xl shadow-sm flex items-center">
                  <button
                    onClick={() => toggleTask(t)}
                    className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-xs ${
                      t.status === "completed" ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                    }`}
                  >
                    {t.status === "completed" ? "✓" : ""}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm ${t.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                      {t.title}
                    </p>
                    {t.due_date && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Due: {new Date(t.due_date).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                  <button onClick={() => deleteTask(t.id)} className="text-red-400 text-xs ml-2">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900">💰 Invoices ({invoices.length})</h2>
            <button onClick={() => setShowInvForm(!showInvForm)} className="text-blue-600 text-sm font-semibold">
              {showInvForm ? "Cancel" : "+ New"}
            </button>
          </div>

          {showInvForm && (
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-3 border-2 border-blue-200 space-y-3">
              <input
                placeholder="Invoice No (e.g. INV-1050)"
                value={newInv.invoice_no}
                onChange={(e) => setNewInv({ ...newInv, invoice_no: e.target.value })}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newInv.amount}
                onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <button onClick={addInvoice} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">
                Create Invoice
              </button>
            </div>
          )}

          {invoices.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4 bg-white rounded-2xl">Koi invoice nahi hai</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-white p-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{inv.invoice_no}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(inv.submitted_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">₹{inv.amount.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={inv.status}
                      onChange={(e) => updateInvStatus(inv.id, e.target.value)}
                      className={`flex-1 text-xs font-semibold px-2 py-2 rounded-lg border-0 ${
                        inv.status === "paid" ? "bg-green-100 text-green-700" :
                        inv.status === "approved" ? "bg-blue-100 text-blue-700" :
                        "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button onClick={() => deleteInvoice(inv.id)} className="text-red-400 text-xs">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
