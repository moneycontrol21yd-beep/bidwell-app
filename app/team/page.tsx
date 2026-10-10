"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

const ROLES = ["Owner", "Manager", "Accounts", "Employee"];

export default function Team() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Manager" });

  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("created_at", { ascending: false });
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addMember = async () => {
    if (!newMember.name || !newMember.email) return alert("Name aur email daalo");
    await supabase.from("team_members").insert(newMember);
    setNewMember({ name: "", email: "", role: "Manager" });
    setShowForm(false);
    load();
  };

  const removeMember = async (id: string) => {
    if (!confirm("Member ko remove karna hai?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    load();
  };

  const roleColor = (r: string) => {
    const map: any = { Owner: "bg-purple-100 text-purple-700", Manager: "bg-blue-100 text-blue-700", Accounts: "bg-green-100 text-green-700", Employee: "bg-gray-100 text-gray-700" };
    return map[r] || "bg-gray-100 text-gray-700";
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <Link href="/profile" className="text-blue-600 text-sm">← Profile</Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">👥 Team Members</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{members.length} members</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full">
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      <div className="p-5 space-y-3">
        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-2 border-blue-200 dark:border-blue-700">
            <div className="space-y-3">
              <input placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white" />
              <input placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white" />
              <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white">
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <button onClick={addMember} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">Add Member</button>
            </div>
          </div>
        )}

        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          members.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No team members yet.</p>
              <p className="text-xs text-gray-400 mt-1">Add your team — To manage tenders, bids, contracts.</p>
            </div>
          ) : members.map((m) => (
            <div key={m.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-lg mr-3">👤</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{m.email}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${roleColor(m.role)}`}>{m.role}</span>
                <button onClick={() => removeMember(m.id)} className="block text-xs text-red-500 mt-2 ml-auto">Remove</button>
              </div>
            </div>
          ))}
      </div>
      <BottomNav />
    </main>
  );
}
