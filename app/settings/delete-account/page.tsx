"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeleteAccount() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CONFIRM_TEXT = "DELETE MY ACCOUNT";

  const submit = async () => {
    if (confirm !== CONFIRM_TEXT) return setError(`Type exactly: "${CONFIRM_TEXT}"`);
    setLoading(true); setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Delete user's data (RLS handles isolation)
      await supabase.from("documents").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("tenders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("contracts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("invoices").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("companies").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      await supabase.auth.signOut();
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-6">
      <Link href="/settings" className="text-blue-600 text-xs font-bold tracking-wide">← SETTINGS</Link>
      <h1 className="text-2xl font-bold text-red-600 mt-4 mb-2 tracking-tight">Delete Account</h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Ye action permanent hai</p>

      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-5 rounded-2xl mb-6">
        <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">⚠️ Warning</p>
        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
          <li>• Saara data permanently delete ho jayega</li>
          <li>• Company profile, tenders, contracts, invoices sab delete</li>
          <li>• Documents bhi hat jayenge</li>
          <li>• Ye action undo no ho sakta</li>
        </ul>
      </div>

      <div className="space-y-4 max-w-sm">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">
            Type "{CONFIRM_TEXT}" to confirm
          </label>
          <input type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={CONFIRM_TEXT} className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white" />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded-xl">
            <p className="text-red-700 dark:text-red-400 text-xs font-medium">{error}</p>
          </div>
        )}

        <button onClick={submit} disabled={loading || confirm !== CONFIRM_TEXT} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-sm tracking-wide disabled:opacity-40">
          {loading ? "DELETING..." : "DELETE MY ACCOUNT PERMANENTLY"}
        </button>

        <Link href="/settings">
          <button className="w-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl text-sm tracking-wide">
            CANCEL
          </button>
        </Link>
      </div>
    </main>
  );
}
