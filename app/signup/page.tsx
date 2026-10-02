"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) return setError("Saari details bharo");
    if (form.password.length < 6) return setError("Password kam se kam 6 characters");
    setLoading(true); setError("");

    const { error } = await signUp(form.email, form.password, form.name);
    if (error) { setError(error.message); setLoading(false); }
    else { alert("Account ban gaya! Ab login karo."); router.push("/login"); }
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col justify-center">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-blue-900 p-4 rounded-2xl mb-4">
          <span className="text-4xl font-bold text-white">B</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-500 mt-1">BidWell me apna account banao</p>
      </div>

      <div className="space-y-4 w-full max-w-sm mx-auto">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input type="text" placeholder="Rohit Sharma" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input type="email" placeholder="you@company.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input type="password" placeholder="min 6 characters" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 p-3 rounded-xl"><p className="text-red-700 text-xs">{error}</p></div>}

        <button onClick={handleSignup} disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:bg-gray-400">
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </div>

      <p className="text-center text-gray-600 mt-8 text-sm">
        Already have an account? <Link href="/login" className="text-blue-600 font-bold">Login</Link>
      </p>
    </main>
  );
}
