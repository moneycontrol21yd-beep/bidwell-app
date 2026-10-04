"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UsersIcon, CheckSquareIcon } from "@/components/icons";

export default function Workforce() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [tab, setTab] = useState("employees");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", role: "", phone: "" });

  const load = async () => {
    const { data } = await supabase.from("employees").select("*").eq("contract_id", id).order("created_at", { ascending: false });
    setEmployees(data || []);
    setLoading(false);
  };
  useEffect(() => { if (id) load(); }, [id]);

  const addEmp = async () => {
    if (!newEmp.name) return alert("Name daalo");
    await supabase.from("employees").insert({ ...newEmp, contract_id: id });
    setNewEmp({ name: "", role: "", phone: "" });
    setShowForm(false);
    load();
  };

  const removeEmp = async (empId: string) => {
    if (!confirm("Remove karna hai?")) return;
    await supabase.from("employees").delete().eq("id", empId);
    load();
  };

  const present = employees.filter(e => e.status === "active").length;
  const absent = employees.length - present;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href={`/contracts/${id}`} className="text-blue-600 text-xs font-bold tracking-wide">← CONTRACT</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Workforce</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Team & attendance manage karo</p>
      </div>

      <div className="px-5 py-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-1.5 flex gap-1">
          {[
            { key: "employees", label: "Employees" },
            { key: "attendance", label: "Attendance" },
            { key: "compliance", label: "Compliance" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-wide transition ${tab === t.key ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400"}`}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Total</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-2xl border border-green-100 dark:border-green-900/40 text-center">
          <p className="text-2xl font-bold text-green-600">{present}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Present</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-2xl border border-red-100 dark:border-red-900/40 text-center">
          <p className="text-2xl font-bold text-red-600">{absent}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mt-1">Absent</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {tab === "employees" && (
          <>
            <button onClick={() => setShowForm(!showForm)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 text-sm tracking-wide">
              {showForm ? "CANCEL" : "+ ADD EMPLOYEE"}
            </button>

            {showForm && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border-2 border-blue-200 dark:border-blue-800 space-y-3">
                <input placeholder="Full Name" value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
                <input placeholder="Role (Security Guard)" value={newEmp.role} onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
                <input placeholder="Phone" value={newEmp.phone} onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white" />
                <button onClick={addEmp} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">Save</button>
              </div>
            )}

            {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
              employees.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
                  <UsersIcon size={32} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Abhi koi employee nahi hai</p>
                </div>
              ) : employees.map((emp) => (
                <div key={emp.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
                  <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-600">{emp.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{emp.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{emp.role || "Employee"} {emp.phone ? `· ${emp.phone}` : ""}</p>
                  </div>
                  <button onClick={() => removeEmp(emp.id)} className="text-red-500 text-xs font-bold">×</button>
                </div>
              ))}
          </>
        )}

        {tab === "attendance" && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 tracking-tight">Today's Attendance</h2>
            {employees.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">Pehle employees add karo</p>
            ) : (
              <div className="space-y-2">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex-1">{emp.name}</span>
                    <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md font-bold tracking-wide">PRESENT</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "compliance" && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 tracking-tight flex items-center">
              <CheckSquareIcon size={16} className="mr-2 text-blue-600" />
              COMPLIANCE STATUS
            </h2>
            <div className="space-y-2">
              {["PF Registration", "ESIC Registration", "Labour License", "PSARA License", "Insurance"].map((c, i) => (
                <div key={i} className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 ${i < 3 ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
                    <span className="text-xs font-bold">{i < 3 ? "✓" : "!"}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white flex-1">{c}</p>
                  <p className={`text-[10px] font-bold tracking-wide ${i < 3 ? "text-green-600" : "text-orange-600"}`}>{i < 3 ? "VALID" : "VERIFY"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
