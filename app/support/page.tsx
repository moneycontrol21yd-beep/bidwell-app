"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

export default function Support() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    const { data } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
    setTickets(data || []);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.subject || !form.message) return alert("Subject aur message daalo");
    setLoading(true);
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user?.id,
      user_email: user?.email,
      subject: form.subject,
      message: form.message,
      status: "open",
    });
    if (error) alert("Error: " + error.message);
    else {
      setSent(true);
      setForm({ subject: "", message: "" });
      setShowForm(false);
      load();
      setTimeout(() => setSent(false), 3000);
    }
    setLoading(false);
  };

  const statusColor = (s: string) => {
    if (s === "resolved") return "bg-green-100 text-green-700";
    if (s === "in_progress") return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Support</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Koi problem? Ticket banao</p>
      </div>

      <div className="p-5 space-y-4">
        {sent && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-xl">
            <p className="text-sm font-bold text-green-700 dark:text-green-400">✅ Ticket submit ho gaya!</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">24 hours me reply milega.</p>
          </div>
        )}

        <button onClick={() => setShowForm(!showForm)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 text-sm tracking-wide">
          {showForm ? "CANCEL" : "+ NEW TICKET"}
        </button>

        {showForm && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border-2 border-blue-200 dark:border-blue-800 space-y-3">
            <input
              placeholder="Subject (e.g. Payment issue)"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
            />
            <textarea
              placeholder="Apni problem detail me batao..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
            />
            <button onClick={submit} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60">
              {loading ? "SUBMITTING..." : "SUBMIT TICKET"}
            </button>
          </div>
        )}

        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">My Tickets ({tickets.length})</p>

        {tickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 text-sm">Koi ticket no hai</p>
            <p className="text-xs text-gray-400 mt-1">Upar "+ NEW TICKET" daba kar banao</p>
          </div>
        ) : tickets.map((t) => (
          <div key={t.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-gray-900 dark:text-white text-sm flex-1">{t.subject}</p>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${statusColor(t.status)}`}>{t.status.replace("_", " ")}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t.message}</p>
            <p className="text-[10px] text-gray-400 mt-2">{new Date(t.created_at).toLocaleString("en-IN")}</p>
          </div>
        ))}

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl mt-4">
          <p className="text-xs text-gray-800 dark:text-gray-200 font-bold mb-2">📧 Direct Contact</p>
          <a href="mailto:support@bidwell.app" className="text-xs text-blue-600 font-semibold">support@bidwell.app</a>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">Response time: 24 hours</p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
