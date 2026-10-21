"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) return setError("Email aur password daalo");
    setLoading(true); setError("");
    const { error } = await signIn(form.email, form.password);
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/dashboard"); }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 p-6 flex flex-col justify-center">
      <div className="flex flex-col items-center mb-10">
        <Logo size="lg" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-6 tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Log in to your account</p>
      </div>

      <div className="space-y-4 w-full max-w-sm mx-auto">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Password</label>
          <input
            type="password"
            placeholder="........"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="text-right -mt-2">
          <Link href="/forgot-password" className="text-blue-600 text-xs font-bold">Forgot Password?</Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-xl">
            <p className="text-red-700 dark:text-red-400 text-xs font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm tracking-wide disabled:opacity-60"
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-600 font-bold">Sign Up</Link>
      </p>
    </main>
  );
}
