"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

export default function TendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const fetchTenders = async (searchQuery: string, pageNumber: number = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenders?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`);
      const data = await res.json();
      if (data.success) {
        if (pageNumber === 0) {
          setTenders(data.tenders || []);
        } else {
          setTenders(prev => [...prev, ...(data.tenders || [])]);
        }
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchTenders("", 0); }, []);

  const clearSearch = () => {
    setQuery("");
    setPage(0);
    fetchTenders("", 0);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 100, fontFamily: "system-ui" }}>
      <div style={{ padding: "30px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/dashboard" style={{ ...LINK, fontSize: 20, color: C.muted }}>&lt;</Link>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Live Tenders</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{tenders.length} active tenders loaded</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", background: C.card, border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: "12px 16px", marginBottom: 16 }}>
          <span style={{ fontSize: 18, marginRight: 10 }}>🔍</span>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tenders..." style={{ flex: 1, background: "transparent", border: "none", color: "#fff", outline: "none", fontSize: 14 }} />
          {query && <button onClick={clearSearch} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>}
        </div>
      </div>

      <div style={{ padding: "0 18px" }}>
        {tenders.map((t, i) => (
          <Link href={`/tenders/${encodeURIComponent(t.source_tender_id)}`} key={i} style={{ ...LINK, display: "block", marginBottom: 12 }}>
            <div style={{ background: C.card, border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 16, position: "relative" }}>
              <div style={{ position: "absolute", top: 16, right: 16, background: t.match_score >= 80 ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)", color: t.match_score >= 80 ? "#10B981" : "#818CF8", fontSize: 10, fontWeight: 900, padding: "4px 8px", borderRadius: 10 }}>
                {t.match_score}% Match
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.4, marginBottom: 12, paddingRight: 60 }}>
                {t.title}
              </div>
              <div style={{ fontSize: 11, color: C.sub, marginBottom: 12 }}>
                🏢 {t.org_name || "Department N/A"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: C.muted, fontWeight: 800 }}>DEADLINE</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B", marginTop: 2 }}>
                    {t.closing_date ? new Date(t.closing_date).toLocaleDateString() : "Check Portal"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, color: C.muted, fontWeight: 800 }}>STATE</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginTop: 2 }}>{t.state || "India"}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchTenders(query, nextPage);
            }}
            style={{
              padding: "12px 24px",
              background: C.card,
              color: C.text,
              border: "1px solid rgba(99,102,241,0.5)",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {loading ? "Loading..." : "Load More Tenders"}
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
