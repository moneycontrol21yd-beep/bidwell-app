"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

const C = { bg: "#060B28", card: "#0E1533", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function AppNav({ active = "home" }: { active?: "home" | "tenders" | "brain" | "bids" | "more" }) {
  const t = useT();

  const nav = [
    { id: "home", icon: "🏠", key: "nav.home", href: "/dashboard" },
    { id: "tenders", icon: "📄", key: "nav.tenders", href: "/tenders" },
    { id: "brain", icon: "🧠", key: "nav.brain", href: "/brain", center: true },
    { id: "bids", icon: "✍️", key: "nav.bids", href: "/bids" },
    { id: "more", icon: "⋯", key: "nav.more", href: "/profile" },
  ];

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30, background: "rgba(10,14,39,0.98)", backdropFilter: "blur(12px)", borderTop: `1px solid rgba(99,102,241,0.18)`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 0 14px" }}>
      {nav.map((n) => {
        const on = active === n.id;
        return (
          <Link key={n.id} href={n.href} style={{ ...LINK, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", marginTop: n.center ? -28 : 0, minWidth: 55 }}>
            {n.center ? (
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1 0%,#A855F7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 10px 30px rgba(139,92,246,0.55)", border: `4px solid ${C.bg}` }}>{n.icon}</div>
            ) : (
              <span style={{ fontSize: 22, opacity: on ? 1 : 0.55 }}>{n.icon}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 900, color: on ? "#818CF8" : C.muted, marginTop: n.center ? 4 : 5 }}>{t(n.key)}</span>
          </Link>
        );
      })}
    </div>
  );
}
