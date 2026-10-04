"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("Reset link invalid or expired. Dobara try karo.");
      }
    };
    checkSession();
  }, []);

  const handleUpdate = async () => {
    if (!password || !confirm) return setError("Saari details bharo");
    if (password.length < 6) return setError("Password kam se kam 6 characters");
    if (password !== confirm) return setError("Dono passwords match nahi kar rahe");

    setLoading(true); setError("");
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-6 flex flex-col justify-center">
      <div className="flex flex-col items-center mb-10">
        <Logo size="lg" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 tracking-tight">New Password</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Create a strong password</p>
      </div>

      <div className="space-y-4 w-full max-w-sm mx-auto">
        {!success ? (
          <>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm tracking-wide disabled:opacity-60"
            >
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-5 rounded-2xl text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">Password Updated!</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              3 seconds में login page पर redirect hoga...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
