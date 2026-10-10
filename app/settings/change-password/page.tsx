"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/auth";

export default function ChangePassword() {
  const router = useRouter();
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.newPass || !form.confirm) return setError("Saari details bharo");
    if (form.newPass.length < 6) return setError("Password kam se kam 6 characters");
    if (form.newPass !== form.confirm) return setError("Dono passwords match no");

    setLoading(true); setError("");
    const { error } = await changePassword(form.newPass);
    if (error) setError(error.message);
    else { setSuccess(true); setTimeout(() => router.push("/settings"), 2500); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-6">
      <Link href="/settings" className="text-blue-600 text-xs font-bold tracking-wide">← SETTINGS</Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2 tracking-tight">Change Password</h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Set new password</p>

      <div className="space-y-4 max-w-sm">
        {!success ? (
          <>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">New Password</label>
              <input type="password" value={form.newPass} onChange={(e) => setForm({ ...form, newPass: e.target.value })} placeholder="Min 6 characters" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Re-enter password" className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white" />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button onClick={submit} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl text-sm tracking-wide disabled:opacity-60">
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-5 rounded-2xl text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">Password Updated!</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">2 seconds me redirect hoga...</p>
          </div>
        )}
      </div>
    </main>
  );
}
