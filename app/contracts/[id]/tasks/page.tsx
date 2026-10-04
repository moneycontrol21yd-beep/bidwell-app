"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CheckSquareIcon } from "@/components/icons";

export default function Tasks() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", due_date: "" });

  const load = async () => {
    const { data } = await supabase.from("tasks").select("*").eq("contract_id", id).order("due_date");
    setTasks(data || []);
    setLoading(false);
  };
  useEffect(() => { if (id) load(); }, [id]);

  const add = async () => {
    if (!newTask.title) return alert("Title daalo");
    await supabase.from("tasks").insert({ contract_id: id, title: newTask.title, due_date: newTask.due_date || null });
    setNewTask({ title: "", due_date: "" }); setShowForm(false); load();
  };
  const toggle = async (t: any) => {
    await supabase.from("tasks").update({ status: t.status === "completed" ? "pending" : "completed" }).eq("id", t.id);
    load();
  };
  const remove = async (tid: string) => {
    if (!confirm("Delete karna hai?")) return;
    await supabase.from("tasks").delete().eq("id", tid);
    load();
  };

  const done = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.length - done;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href={`/contracts/${id}`} className="text-blue-600 text-xs font-bold tracking-wide">← CONTRACT</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Tasks</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contract ke saare tasks</p>
      </div>

      <div className="px-5 grid grid-cols-3 gap-3 mt-4 mb-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Total</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-2xl border border-green-100 dark:border-green-900/40 text-center">
          <p className="text-2xl font-bold text-green-600">{done}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Done</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/40 text-center">
          <p className="text-2xl font-bold text-orange-600">{pending}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Pending</p>
        </div>
      </div>

      <div className="px-5 space-y-3">
        <button onClick={() => setShowForm(!showForm)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 text-sm tracking-wide">
          {showForm ? "CANCEL" : "+ ADD TASK"}
        </button>

        {showForm && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border-2 border-blue-200 dark:border-blue-800 space-y-3">
            <input placeholder="Task ka naam" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
            <button onClick={add} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">Save Task</button>
          </div>
        )}

        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          tasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
              <CheckSquareIcon size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Koi task nahi hai</p>
            </div>
          ) : tasks.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
              <button onClick={() => toggle(t)} className={`w-6 h-6 rounded-lg border-2 mr-3 flex items-center justify-center text-xs ${t.status === "completed" ? "bg-green-500 border-green-500 text-white" : "border-gray-300 dark:border-gray-600"}`}>
                {t.status === "completed" ? "✓" : ""}
              </button>
              <div className="flex-1">
                <p className={`text-sm ${t.status === "completed" ? "line-through text-gray-400" : "text-gray-900 dark:text-white font-medium"}`}>{t.title}</p>
                {t.due_date && <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Due: {new Date(t.due_date).toLocaleDateString("en-IN")}</p>}
              </div>
              <button onClick={() => remove(t.id)} className="text-red-500 text-xs font-bold">×</button>
            </div>
          ))}
      </div>
    </main>
  );
}
