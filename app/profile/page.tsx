"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function ProfilePage() {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const user = JSON.parse(u);
        const n = user.name || user.full_name || "User";
        setUserName(n);
        setInitials(n.split(" ").map((x: string) => x[0]).join("").slice(0, 2).toUpperCase());
        if (user.email) setUserEmail(user.email);
      }
    } catch {}
  }, []);

  const menuItems = [
    {
      section: "COMPANY",
      items: [
        { icon: "🏢", bg: "linear-gradient(135deg,#6366F1,#8B5CF6)", title: "Company Profile", sub: "Name, GST, ISO, PSARA", href: "/company" },
        { icon: "🧠", bg: "linear-gradient(135deg,#8B5CF6,#A855F7)", title: "Company Brain", sub: "AI insights for your business", href: "/brain" },
        { icon: "📄", bg: "linear-gradient(135deg,#059669,#10B981)", title: "Document Vault", sub: "Certificates & documents", href: "/documents" },
        { icon: "👥", bg: "linear-gradient(135deg,#2563EB,#3B82F6)", title: "Team Members", sub: "Manage your team", href: "/team" },
      ],
    },
    {
      section: "ACCOUNT",
      items: [
        { icon: "⚙️", bg: "linear-gradient(135deg,#D97706,#F59E0B)", title: "Settings", sub: "Theme, language & preferences", href: "/settings" },
        { icon: "💳", bg: "linear-gradient(135deg,#DB2777,#EC4899)", title: "Subscription", sub: "Plan & billing", href: "/subscription" },
        { icon: "🔔", bg: "linear-gradient(135deg,#7C3AED,#A855F7)", title: "Notifications", sub: "Alerts & reminders", href: "/notifications" },
        { icon: "👁️", bg: "linear-gradient(135deg,#0D9488,#14B8A6)", title: "BidWell Watch", sub: "Track tenders you care about", href: "/watch" },
      ],
    },
    {
      section: "SUPPORT",
      items: [
        { icon: "❓", bg: "linear-gradient(135deg,#3B82F6,#6366F1)", title: "Help & Support", sub: "FAQs & contact us", href: "/help" },
        { icon: "🎫", bg: "linear-gradient(135deg,#F59E0B,#FBBF24)", title: "Support Tickets", sub: "Your open tickets", href: "/support" },
        { icon: "🛡️", bg: "linear-gradient(135deg,#059669,#10B981)", title: "Audit Log", sub: "Activity history", href: "/audit" },
      ],
    },
    {
      section: "LEGAL",
      items: [
        { icon: "🔒", bg: "linear-gradient(135deg,#1E40AF,#3B82F6)", title: "Privacy Policy", sub: "How we protect your data", href: "/privacy" },
        { icon: "📋", bg: "linear-gradient(135deg,#0F766E,#14B8A6)", title: "Terms of Service", sub: "Usage terms & conditions", href: "/terms" },
        { icon: "💸", bg: "linear-gradient(135deg,#DC2626,#EF4444)", title: "Refund Policy", sub: "Cancellation & refunds", href: "/refund" },
      ],
    },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)`, padding: "14px 18px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{ ...LINK, fontSize: 20, opacity: 0.9 }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.1 }}>Profile</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Manage your account</div>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div style={{ position: "absolute", top: -2, right: -3, width: 15, height: 15, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 8, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>5</div>
          </div>
        </div>
      </div>

      {/* USER CARD */}
      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ background: "linear-gradient(135deg,#4338CA 0%,#6366F1 50%,#8B5CF6 100%)", borderRadius: 20, padding: 20, position: "relative", overflow: "hidden", boxShadow: "0 10px 30px rgba(99,102,241,0.35)" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "rgba(168,85,247,0.5)", filter: "blur(40px)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff", border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0, backdropFilter: "blur(10px)" }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>{userName}</div>
              <div style={{ fontSize: 11.5, color: "#C7D2FE", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, padding: "3px 10px", borderRadius: 10, background: "rgba(255,255,255,0.22)", fontSize: 9.5, fontWeight: 900, color: "#fff", letterSpacing: 0.5 }}>
                ⭐ FREE PLAN
              </div>
            </div>
            <Link href="/settings" style={{ ...LINK }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, backdropFilter: "blur(10px)" }}>⚙️</div>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div style={{ padding: "20px 18px 20px" }}>
        {menuItems.map((section, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.2, color: C.muted, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>
              {section.section}
            </div>
            <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, overflow: "hidden" }}>
              {section.items.map((item, i) => (
                <Link key={i} href={item.href} style={{ ...LINK, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < section.items.length - 1 ? `1px solid rgba(99,102,241,0.12)` : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{item.title}</div>
                    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: 16, color: C.muted, flexShrink: 0 }}>›</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 16, textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, margin: "0 auto 10px", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#fff" }}>B</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>BidWell v1.0</div>
          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 4 }}>Made in India 🇮🇳 · 13 Languages</div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="more" />
    </div>
  );
}
