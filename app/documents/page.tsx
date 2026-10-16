"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

interface Doc {
  id: number;
  title: string;
  number: string;
  expiry?: string;
  status: "valid" | "expiring" | "expired";
  icon: string;
  bg: string;
  fileName?: string;
  fileUrl?: string;
}

export default function DocumentsPage() {
  const [tab, setTab] = useState<"company" | "tender" | "templates">("company");
  const [showUpload, setShowUpload] = useState(false);
  const [viewDoc, setViewDoc] = useState<Doc | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<Doc | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [docs, setDocs] = useState<Doc[]>([
    { id: 1, title: "Experience Certificate", number: "EXP/DMRC/2023/001", status: "valid", icon: "📜", bg: "linear-gradient(135deg,#059669,#10B981)" },
    { id: 2, title: "Bank Certificate", number: "HDFC/BC/2024/1234", expiry: "15 Oct 2026", status: "expiring", icon: "🏦", bg: "linear-gradient(135deg,#D97706,#F59E0B)" },
    { id: 3, title: "ISO 9001 Certificate", number: "ISO-9001-2024-7890", expiry: "30 Jun 2027", status: "valid", icon: "✅", bg: "linear-gradient(135deg,#059669,#10B981)" },
    { id: 4, title: "Labour License", number: "LAB/MH/2024/5678", expiry: "31 Dec 2026", status: "valid", icon: "👷", bg: "linear-gradient(135deg,#2563EB,#3B82F6)" },
    { id: 5, title: "PSARA License", number: "PSARA/MH/2024/1234", expiry: "31 Mar 2027", status: "valid", icon: "🛡️", bg: "linear-gradient(135deg,#6366F1,#8B5CF6)" },
    { id: 6, title: "EPF & ESIC", number: "MH/BAN/12345", status: "valid", icon: "💼", bg: "linear-gradient(135deg,#7C3AED,#A855F7)" },
    { id: 7, title: "Company Registration", number: "U74999MH2019PTC123456", status: "valid", icon: "🏢", bg: "linear-gradient(135deg,#DB2777,#EC4899)" },
    { id: 8, title: "MSME/Udyam", number: "UDYAM-MH-00-1234567", status: "valid", icon: "📋", bg: "linear-gradient(135deg,#0D9488,#14B8A6)" },
  ]);

  const statusColor = (s: string) => s === "valid" ? "#10B981" : s === "expiring" ? "#F59E0B" : "#EF4444";
  const statusText = (s: string) => s === "valid" ? "✓ Saved" : s === "expiring" ? "⚠ Expiring" : "✗ Expired";
  const statusBg = (s: string) => s === "valid" ? "rgba(16,185,129,0.15)" : s === "expiring" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newDoc: Doc = {
      id: Date.now(),
      title: file.name.replace(/\.[^/.]+$/, "").slice(0, 40) || "New Document",
      number: `UPLOAD/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000) + 1000}`,
      status: "valid",
      icon: file.type.includes("pdf") ? "📄" : "🖼️",
      bg: file.type.includes("pdf") ? "linear-gradient(135deg,#DC2626,#EF4444)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
      fileName: file.name,
      fileUrl: url,
    };
    setDocs([newDoc, ...docs]);
    setShowUpload(false);
    alert(`✅ ${file.name} uploaded successfully!`);
  };

  const handleDelete = () => {
    if (!deleteDoc) return;
    setDocs(docs.filter((d) => d.id !== deleteDoc.id));
    setDeleteDoc(null);
    alert("🗑️ Document deleted");
  };

  const stats = {
    valid: docs.filter((d) => d.status === "valid").length,
    expiring: docs.filter((d) => d.status === "expiring").length,
    expired: docs.filter((d) => d.status === "expired").length,
  };

  const tabs = [
    { id: "company", l: "Company Docs", c: docs.length },
    { id: "tender", l: "Tender Docs", c: 0 },
    { id: "templates", l: "Templates", c: 0 },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 100, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)` }}>
        <div style={{ padding: "14px 18px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/profile" style={{ ...LINK, fontSize: 20, opacity: 0.9 }}>←</Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.1 }}>Document Vault</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{docs.length} documents · {stats.expiring} expiring soon</div>
          </div>
          <button onClick={() => setShowUpload(true)}
            style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", color: "#fff", fontSize: 22, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        </div>

        <div style={{ padding: "0 18px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "inline-flex", gap: 8 }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                style={{
                  flexShrink: 0, padding: "8px 14px", borderRadius: 20,
                  background: tab === t.id ? "linear-gradient(135deg,#4338CA,#6366F1)" : C.card,
                  border: `1px solid ${tab === t.id ? "#6366F1" : "rgba(99,102,241,0.2)"}`,
                  color: "#fff", fontSize: 11.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: tab === t.id ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
                }}>
                {t.l} {t.c > 0 && <span style={{ opacity: 0.8 }}>({t.c})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Valid</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981", marginTop: 4 }}>{stats.valid}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Expiring</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#F59E0B", marginTop: 4 }}>{stats.expiring}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6 }}>Expired</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#EF4444", marginTop: 4 }}>{stats.expired}</div>
          </div>
        </div>
      </div>

      {/* DOCS LIST */}
      <div style={{ padding: "16px 18px 20px" }}>
        {tab === "company" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {docs.map((d) => (
              <div key={d.id} style={{ background: C.card, border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 16, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: d.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                    {d.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 900, color: "#fff", lineHeight: 1.2, flex: 1 }}>{d.title}</div>
                      <div style={{ padding: "3px 9px", borderRadius: 8, fontSize: 9.5, fontWeight: 900, background: statusBg(d.status), color: statusColor(d.status), border: `1px solid ${statusColor(d.status)}40`, whiteSpace: "nowrap" }}>
                        {statusText(d.status)}
                      </div>
                    </div>
                    <div style={{ fontSize: 10.5, color: C.sub, marginBottom: 8, wordBreak: "break-all" }}>
                      {d.number}
                      {d.expiry && <span style={{ color: d.status === "expiring" ? "#FBBF24" : C.muted }}> · Exp: {d.expiry}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setViewDoc(d)}
                        style={{ flex: 1, padding: "9px 12px", borderRadius: 10, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", color: "#A5B4FC", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                        👁️ View
                      </button>
                      <button onClick={() => setDeleteDoc(d)}
                        style={{ padding: "9px 14px", borderRadius: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#F87171", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", background: C.card, borderRadius: 16, border: `1px solid rgba(99,102,241,0.2)` }}>
            <div style={{ fontSize: 40, opacity: 0.4 }}>{tab === "tender" ? "📄" : "📋"}</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 12, fontWeight: 600 }}>
              {tab === "tender" ? "No tender documents yet" : "No templates yet"}
            </div>
            <button onClick={() => setShowUpload(true)}
              style={{ marginTop: 16, padding: "12px 22px", borderRadius: 12, background: "linear-gradient(135deg,#4338CA,#6366F1)", color: "#fff", fontWeight: 800, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
              + Add Document
            </button>
          </div>
        )}
      </div>

      {/* HIDDEN FILE INPUTS */}
      <input ref={fileRef} type="file" accept="application/pdf,image/*" onChange={handleFile} style={{ display: "none" }} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div onClick={() => setShowUpload(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, border: "1px solid rgba(99,102,241,0.3)", borderBottom: "none", paddingBottom: 40 }}>
            <div style={{ width: 40, height: 4, borderRadius: 4, background: "rgba(148,163,184,0.4)", margin: "0 auto 18px" }} />
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6, textAlign: "center" }}>Add Document</div>
            <div style={{ fontSize: 11.5, color: C.muted, textAlign: "center", marginBottom: 20 }}>Camera se photo ya PDF upload karo</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <button onClick={() => cameraRef.current?.click()}
                style={{ padding: 20, borderRadius: 18, background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
                <span style={{ fontSize: 32 }}>📷</span>
                Camera
              </button>
              <button onClick={() => fileRef.current?.click()}
                style={{ padding: 20, borderRadius: 18, background: "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(59,130,246,0.4)" }}>
                <span style={{ fontSize: 32 }}>📄</span>
                Upload PDF
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => fileRef.current?.click()}
                style={{ padding: 14, borderRadius: 14, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.35)", color: "#A5B4FC", fontSize: 11.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                🖼️ From Gallery
              </button>
              <button onClick={() => setShowUpload(false)}
                style={{ padding: 14, borderRadius: 14, background: "rgba(148,163,184,0.12)", border: "1px solid rgba(148,163,184,0.3)", color: C.sub, fontSize: 11.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewDoc && (
        <div onClick={() => setViewDoc(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400, background: C.card, border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: viewDoc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{viewDoc.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{viewDoc.title}</div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>{viewDoc.number}</div>
              </div>
            </div>

            {viewDoc.fileUrl ? (
              viewDoc.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={viewDoc.fileUrl} alt={viewDoc.title} style={{ width: "100%", borderRadius: 12, marginBottom: 14 }} />
              ) : (
                <div style={{ padding: 20, background: "rgba(99,102,241,0.08)", borderRadius: 12, textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 40 }}>📄</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 8 }}>{viewDoc.fileName}</div>
                </div>
              )
            ) : (
              <div style={{ padding: 30, background: "rgba(99,102,241,0.08)", borderRadius: 12, textAlign: "center", marginBottom: 14, border: "1px dashed rgba(99,102,241,0.3)" }}>
                <div style={{ fontSize: 40, opacity: 0.5 }}>📄</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>No file uploaded yet</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Sample document</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              {viewDoc.fileUrl && (
                <a href={viewDoc.fileUrl} download={viewDoc.fileName} style={{ ...LINK, flex: 1 }}>
                  <button style={{ width: "100%", padding: 12, borderRadius: 12, background: "linear-gradient(135deg,#059669,#10B981)", border: "none", color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                    ⬇️ Download
                  </button>
                </a>
              )}
              <button onClick={() => setViewDoc(null)}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: "rgba(148,163,184,0.15)", border: "1px solid rgba(148,163,184,0.3)", color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteDoc && (
        <div onClick={() => setDeleteDoc(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 340, background: C.card, border: "1px solid rgba(239,68,68,0.3)", borderRadius: 20, padding: 22, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Delete Document?</div>
            <div style={{ fontSize: 12, color: C.sub, marginBottom: 20, lineHeight: 1.5 }}>
              <strong style={{ color: "#F87171" }}>{deleteDoc.title}</strong>
              <br />
              Ye permanently delete ho jayega. Undo nahi hoga.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteDoc(null)}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: "rgba(148,163,184,0.15)", border: "1px solid rgba(148,163,184,0.3)", color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={handleDelete}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: "linear-gradient(135deg,#DC2626,#EF4444)", border: "none", color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(239,68,68,0.4)" }}>
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <AppNav active="more" />
    </div>
  );
}
