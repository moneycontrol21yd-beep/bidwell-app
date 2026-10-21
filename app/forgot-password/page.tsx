"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!email) return setError("Email daalo");
    setLoading(true); setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-6 flex flex-col justify-center">
      <div className="flex flex-col items-center mb-10">
        <Logo size="lg" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 tracking-tight">Forgot Password?</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm text-center">
          {sent ? "Check your email for reset link" : "Apna registered email daalo — reset link milega"}
        </p>
      </div>

      <div className="space-y-4 w-full max-w-sm mx-auto">
        {!sent ? (
          <>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm tracking-wide disabled:opacity-60"
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-5 rounded-2xl text-center">
            <div className="text-5xl mb-3">📧</div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">Reset link sent!</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {email} पर एक email भेजा है। Link पर tap करके नया password बनाओ।
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-3">
              Email न मिले तो Spam folder check करो
            </p>
          </div>
        )}
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-sm">
        <Link href="/login" className="text-blue-600 font-bold">← Back to Login</Link>
      </p>
    </main>
  );
}
