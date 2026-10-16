"use client";

import { useState } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

interface Member { id: number; name: string; role: string; email: string; status: "online" | "offline"; initials: string; color: string; }

export default function TeamPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Rajesh Kumar", role: "Owner / Director", email: "rajesh@bidwell.com", status: "online", initials: "RK", color: "linear-gradient(135deg,#6366F1,#A855F7)" },
    { id: 2, name: "Sandeep Sharma", role: "Manager", email: "sandeep@bidwell.com", status: "online", initials: "SS", color: "linear-gradient(135deg,#059669,#10B981)" },
    { id: 3, name: "Neha Verma", role: "Accountant", email: "neha@bidwell.com", status: "offline", initials: "NV", color: "linear-gradient(135deg,#DB2777,#EC4899)" },
    { id: 4, name: "Amit Singh", role: "Technical Expert", email: "amit@bidwell.com", status: "offline", initials: "AS", color: "linear-gradient(135deg,#D97706,#F59E0B)" },
    { id: 5, name: "Pooja Mishra", role: "Bid Writer", email: "pooja@bidwell.com", status: "offline", initials: "PM", color: "linear-gradient(135deg,#2563EB,#3B82F6)" },
  ]);

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const online = members.filter((m) => m.status === "online").length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)`, padding: "14px 18px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/profile" style={{ ...LINK, fontSize: 20, opacity: 0.9 }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.1 }}>Team Members</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{members.length} members · {online} online</div>
          </div>
          <button onClick={() => setShowAdd(true)}
            style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", color: "#fff", fontSize: 22, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>+</button>
        </div>
      </div>

      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Total</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#60A5FA", marginTop: 4 }}>{members.length}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Online</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981", marginTop: 4 }}>{online}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Roles</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#A855F7", marginTop: 4 }}>4</div>
          </div>
        </div>

        {members.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: C.card, borderRadius: 16, border: `1px solid rgba(99,102,241,0.2)` }}>
            <div style={{ fontSize: 40, opacity: 0.4 }}>👥</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 12, fontWeight: 600 }}>No team members yet</div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6 }}>Add your team to manage tenders together</div>
            <button onClick={() => setShowAdd(true)}
              style={{ marginTop: 16, padding: "12px 22px", borderRadius: 12, background: "linear-gradient(135deg,#4338CA,#6366F1)", color: "#fff", fontWeight: 800, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
              + Add Member
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {members.map((m) => (
              <div key={m.id} style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                      {m.initials}
                    </div>
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: m.status === "online" ? "#10B981" : "#64748B", border: `2px solid ${C.card}` }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "#A5B4FC", marginTop: 3, fontWeight: 700 }}>{m.role}</div>
                    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</div>
                  </div>
                  <button onClick={() => removeMember(m.id)}
                    style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#F87171", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div onClick={() => setShowAdd(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 380, background: C.card, borderRadius: 22, padding: 22, border: "1px solid rgba(99,102,241,0.3)" }}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Add Team Member</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 18 }}>Invite via email</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>Name</div>
              <input placeholder="Full name" style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "rgba(10,14,39,0.7)", border: "1px solid rgba(99,102,241,0.3)", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>Email</div>
              <input placeholder="email@company.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "rgba(10,14,39,0.7)", border: "1px solid rgba(99,102,241,0.3)", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>Role</div>
              <select style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "rgba(10,14,39,0.7)", border: "1px solid rgba(99,102,241,0.3)", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", appearance: "none" }}>
                <option>Manager</option>
                <option>Accountant</option>
                <option>Bid Writer</option>
                <option>Technical Expert</option>
                <option>Viewer</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAdd(false)}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: "rgba(148,163,184,0.15)", border: "1px solid rgba(148,163,184,0.3)", color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={() => { setShowAdd(false); alert("✅ Invitation sent!"); }}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(139,92,246,0.4)" }}>
                ✉️ Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      <AppNav active="more" />
    </div>
  );
}
