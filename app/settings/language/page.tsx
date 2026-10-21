"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ur", name: "Urdu", native: "اردو" },
];

export default function LanguagePage() {
  const [selected, setSelected] = useState("en");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelected(localStorage.getItem("language") || "en");
    }
  }, []);

  const choose = (code: string) => {
    setSelected(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", code);
      window.dispatchEvent(new Event("languageChange"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 40, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)`, padding: "14px 18px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/settings" style={{ ...LINK, fontSize: 20 }}>←</Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 900 }}>Language</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Choose your preferred language</div>
        </div>
      </div>

      {saved && (
        <div style={{ position: "fixed", top: 70, left: 18, right: 18, zIndex: 100, padding: 14, borderRadius: 14, background: "linear-gradient(135deg,#059669,#10B981)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(16,185,129,0.4)" }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <div style={{ fontSize: 12.5, fontWeight: 800 }}>Language saved! AI Assistant will use it now.</div>
        </div>
      )}

      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, overflow: "hidden" }}>
          {LANGUAGES.map((l, i) => (
            <button key={l.code} onClick={() => choose(l.code)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderBottom: i < LANGUAGES.length - 1 ? `1px solid rgba(99,102,241,0.12)` : "none",
                background: selected === l.code ? "rgba(99,102,241,0.12)" : "transparent",
                border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: selected === l.code ? "linear-gradient(135deg,#6366F1,#A855F7)" : "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#fff" }}>
                {l.code.toUpperCase()}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{l.native}</div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>{l.name}</div>
              </div>
              {selected === l.code && (
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff" }}>✓</div>
              )}
            </button>
          ))}
        </div>

        <Link href="/assistant" style={{ ...LINK, display: "block", marginTop: 16 }}>
          <button style={{ width: "100%", padding: 14, borderRadius: 14, background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 18px rgba(139,92,246,0.4)" }}>
            🤖 Test with AI Assistant
          </button>
        </Link>
      </div>
    </div>
  );
}
