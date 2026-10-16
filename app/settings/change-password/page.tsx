"use client";

import { useState } from "react";
import Link from "next/link";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };
const INPUT: React.CSSProperties = {
  width: "100%", padding: "14px 44px 14px 44px", borderRadius: 12,
  background: "rgba(10,14,39,0.7)", border: "1px solid rgba(99,102,241,0.3)",
  color: "#fff", fontSize: 13.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};
const LABEL: React.CSSProperties = {
  fontSize: 10, fontWeight: 900, letterSpacing: 1.2, color: C.muted,
  textTransform: "uppercase", marginBottom: 8, display: "block",
};

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = () => {
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const handleSubmit = () => {
    setError("");
    if (!current) return setError("Please enter current password");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setSuccess(true);
    setTimeout(() => { window.location.href = "/settings"; }, 1500);
  };

  const str = strength();
  const strColor = str <= 2 ? "#EF4444" : str <= 3 ? "#F59E0B" : "#10B981";
  const strLabel = str <= 2 ? "Weak" : str <= 3 ? "Medium" : "Strong";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      <div style={{ background: "linear-gradient(135deg,#4338CA 0%,#6366F1 100%)", padding: "16px 18px 24px", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(139,92,246,0.5)", filter: "blur(50px)" }} />
        <div style={{ position: "relative" }}>
          <Link href="/settings" style={{ ...LINK, fontSize: 11, fontWeight: 800, color: "#C7D2FE", letterSpacing: 1 }}>← SETTINGS</Link>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "10px 0 0", lineHeight: 1.1 }}>Change Password</h1>
          <p style={{ fontSize: 12, color: "#C7D2FE", margin: "6px 0 0", fontWeight: 600 }}>Keep your account secure</p>
        </div>
      </div>

      <div style={{ padding: "24px 18px 0" }}>
        {success ? (
          <div style={{ background: "linear-gradient(135deg,rgba(5,150,105,0.2),rgba(16,185,129,0.15))", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 18, padding: 30, textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981" }}>Password Updated!</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 8 }}>Redirecting to settings...</div>
          </div>
        ) : (
          <>
            <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 18, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>🔒 Security Tip</div>
              <div style={{ fontSize: 12, color: "#E2E8F0", lineHeight: 1.5 }}>
                Use a strong password with at least 6 characters, mixing uppercase, numbers, and symbols.
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={LABEL}>Current Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.6 }}>🔑</span>
                <input type={showCurrent ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" style={INPUT} />
                <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: C.muted, fontSize: 16, cursor: "pointer" }}>
                  {showCurrent ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={LABEL}>New Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.6 }}>🆕</span>
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" style={INPUT} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: C.muted, fontSize: 16, cursor: "pointer" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= str ? strColor : "rgba(99,102,241,0.15)", transition: "all 0.3s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 10.5, color: strColor, fontWeight: 800 }}>{strLabel} password</div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={LABEL}>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.6 }}>✓</span>
                <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" style={INPUT} />
                <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: C.muted, fontSize: 16, cursor: "pointer" }}>
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {confirm && password && confirm === password && (
                <div style={{ fontSize: 10.5, color: "#10B981", fontWeight: 800, marginTop: 8 }}>✓ Passwords match</div>
              )}
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 12, padding: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15 }}>⚠️</span>
                <span style={{ fontSize: 11.5, color: "#F87171", fontWeight: 700 }}>{error}</span>
              </div>
            )}

            <button onClick={handleSubmit}
              style={{ width: "100%", padding: "15px", borderRadius: 16, background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
              🔐 Update Password
            </button>
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30, background: "rgba(10,14,39,0.98)", backdropFilter: "blur(12px)", borderTop: `1px solid rgba(99,102,241,0.18)`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 0 14px" }}>
        {[
          { icon: "🏠", l: "Home", href: "/dashboard" },
          { icon: "📄", l: "Tenders", href: "/tenders" },
          { icon: "🧠", l: "Brain", href: "/brain", center: true },
          { icon: "✍️", l: "Bids", href: "/bids" },
          { icon: "⋯", l: "More", href: "/profile", on: true },
        ].map((n) => (
          <Link key={n.l} href={n.href} style={{ ...LINK, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", marginTop: n.center ? -28 : 0, minWidth: 55 }}>
            {n.center ? (
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1 0%,#A855F7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 10px 30px rgba(139,92,246,0.55)", border: `4px solid ${C.bg}` }}>🧠</div>
            ) : (
              <span style={{ fontSize: 22, opacity: n.on ? 1 : 0.55 }}>{n.icon}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 900, color: n.on ? "#818CF8" : C.muted, marginTop: n.center ? 4 : 5 }}>{n.l}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
