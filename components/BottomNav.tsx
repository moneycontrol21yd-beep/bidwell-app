"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const C = { bg: "#0A0E27", text: "#fff", muted: "#64748B", active: "#818CF8" };

export default function BottomNav() {
  const pathname = usePathname();

  const navs = [
    { icon: "🏠", label: "Home", href: "/dashboard" },
    { icon: "📄", label: "Tenders", href: "/tenders" },
    { icon: "🧠", label: "Brain", href: "/match", center: true },
    { icon: "✍️", label: "Bids", href: "/bids" },
    { icon: "⋯", label: "More", href: "/profile" },
  ];

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: C.bg, borderTop: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 0 15px", paddingBottom: "max(15px, env(safe-area-inset-bottom))" }}>
      {navs.map((n) => {
        const isActive = pathname === n.href;
        return (
          <Link key={n.label} href={n.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60, position: "relative", marginTop: n.center ? -30 : 0 }}>
            {n.center ? (
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1 0%,#A855F7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 10px 25px rgba(139,92,246,0.5)", border: `4px solid ${C.bg}` }}>
                🧠
              </div>
            ) : (
              <span style={{ fontSize: 22, opacity: isActive ? 1 : 0.5 }}>{n.icon}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 800, color: isActive ? C.active : C.muted, marginTop: n.center ? 4 : 6 }}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
