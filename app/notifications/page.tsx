"use client";

import { useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

interface Notif {
  id: number;
  type: "tender" | "invoice" | "license" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionHref?: string;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "tender" | "system">("all");
  const [notifs, setNotifs] = useState<Notif[]>([
    { id: 1, type: "tender", title: "New Tender Matched", message: "Security Services - AIIMS Delhi (₹2.8 Cr)", time: "2 min ago", read: false, actionHref: "/tenders" },
    { id: 2, type: "tender", title: "Tender Closing Soon", message: "NHAI Road Construction - 2 days left", time: "1 hour ago", read: false, actionHref: "/tenders" },
    { id: 3, type: "invoice", title: "Invoice Overdue", message: "INV-1042 — ₹16.4L pending 35 days", time: "3 hours ago", read: false, actionHref: "/payments" },
    { id: 4, type: "license", title: "PSARA License Expiring", message: "Expires in 15 days — Renew now", time: "5 hours ago", read: false, actionHref: "/documents" },
    { id: 5, type: "tender", title: "Future Opportunity Alert", message: "Delhi Metro Phase 4 (₹12,000 Cr) - 2026-2028", time: "1 day ago", read: true, actionHref: "/radar" },
    { id: 6, type: "system", title: "Bid Status Updated", message: "Your bid for Water Treatment Plant is now In Progress", time: "2 days ago", read: true, actionHref: "/bids" },
    { id: 7, type: "system", title: "Welcome to BidWell", message: "Setup your company profile to get started", time: "3 days ago", read: true, actionHref: "/company" },
  ]);

  const markRead = (id: number) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const getTypeStyle = (t: string) => {
    if (t === "tender") return { color: "#60A5FA", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", icon: "📊" };
    if (t === "invoice") return { color: "#F59E0B", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", icon: "💰" };
    if (t === "license") return { color: "#EF4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", icon: "⚠️" };
    return { color: "#A855F7", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)", icon: "🔔" };
  };

  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "tender") return n.type === "tender";
    if (filter === "system") return n.type === "system" || n.type === "license" || n.type === "invoice";
    return true;
  });

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filters = [
    { id: "all", l: "All", c: notifs.length },
    { id: "unread", l: "Unread", c: unreadCount },
    { id: "tender", l: "Tenders", c: notifs.filter((n) => n.type === "tender").length },
    { id: "system", l: "System", c: notifs.filter((n) => n.type !== "tender").length },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)` }}>
        <div style={{ padding: "14px 18px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{ ...LINK, fontSize: 20, opacity: 0.9 }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.1 }}>Notifications</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{unreadCount} unread</div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              style={{ padding: "7px 12px", borderRadius: 10, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", color: "#A5B4FC", fontSize: 10.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
              ✓ Mark all read
            </button>
          )}
        </div>

        <div style={{ padding: "0 18px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "inline-flex", gap: 8 }}>
            {filters.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id as any)}
                style={{
                  flexShrink: 0, padding: "8px 14px", borderRadius: 20,
                  background: filter === f.id ? "linear-gradient(135deg,#4338CA,#6366F1)" : C.card,
                  border: `1px solid ${filter === f.id ? "#6366F1" : "rgba(99,102,241,0.2)"}`,
                  color: "#fff", fontSize: 11.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: filter === f.id ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
                }}>
                {f.l} <span style={{ opacity: 0.75 }}>({f.c})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div style={{ padding: "16px 18px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: C.card, borderRadius: 16, border: `1px solid rgba(99,102,241,0.2)` }}>
            <div style={{ fontSize: 40, opacity: 0.4 }}>🔔</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 12, fontWeight: 600 }}>No notifications</div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6 }}>You're all caught up!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((n) => {
              const style = getTypeStyle(n.type);
              return (
                <Link key={n.id} href={n.actionHref || "#"} style={{ ...LINK, display: "block" }}>
                  <div onClick={() => markRead(n.id)}
                    style={{
                      background: n.read ? C.card : "linear-gradient(135deg,rgba(67,56,202,0.25),rgba(99,102,241,0.15))",
                      border: `1px solid ${n.read ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.4)"}`,
                      borderRadius: 16, padding: 14, position: "relative",
                    }}>
                    {!n.read && (
                      <div style={{ position: "absolute", top: 14, right: 14, width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px rgba(59,130,246,0.8)" }} />
                    )}
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: style.bg, border: `1px solid ${style.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {style.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: 5 }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.45, marginBottom: 7 }}>{n.message}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 9.5, color: C.muted, fontWeight: 700 }}>{n.time}</span>
                          <span style={{ fontSize: 10, color: "#818CF8", fontWeight: 800 }}>View →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <AppNav active="more" />
    </div>
  );
}
