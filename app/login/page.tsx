"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const C = { bg: "#f5f7fb", card: "#ffffff", text: "#17233b", sub: "#64748b", accent: "#315efb", border: "#e2e8f0" };

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && data.session === null) {
          setMessage("Account created! Please check your email for verification.");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: C.card, width: "100%", maxWidth: 400, borderRadius: 20, padding: 30, border: `1px solid ${C.border}`, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ display: "inline-flex", height: 48, width: 48, borderRadius: 14, background: C.accent, alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 900, marginBottom: 16 }}>B</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 8 }}>
            {isLogin ? "Log in to your BidWell workspace." : "Start your AI-powered tender journey."}
          </p>
        </div>

        {error && <div style={{ background: "#fef2f2", color: "#ef4444", padding: 12, borderRadius: 8, fontSize: 12, marginBottom: 16, border: "1px solid #fecaca" }}>{error}</div>}
        {message && <div style={{ background: "#ecfdf5", color: "#10b981", padding: 12, borderRadius: 8, fontSize: 12, marginBottom: 16, border: "1px solid #a7f3d0" }}>{message}</div>}

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.com"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#f8fafc", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#f8fafc", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ background: C.accent, color: "#fff", border: "none", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }} 
            style={{ background: "none", border: "none", color: C.accent, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>

      </div>
    </div>
  );
}
