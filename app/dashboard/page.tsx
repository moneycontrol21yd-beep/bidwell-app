"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tender = { id: string; title: string; department: string; location: string; value: string; deadline: string; match: number; category: string; status: string; source: string; rawDeadline: string; };

const nav = [
  { group: "WORKSPACE", items: [["Overview", "⌂"], ["Live tenders", "⌕"], ["AI tender brain", "✳"], ["Bid workspace", "▤"]] },
  { group: "DELIVERY", items: [["Contracts", "▣"], ["Payments & invoices", "₹"], ["Documents", "▧"], ["Workforce", "♙"]] },
  { group: "MANAGE", items: [["Team", "♧"], ["Notifications", "♢"], ["Company profile", "◉"], ["Subscription", "★"], ["Settings", "⚙"]] },
];

const descriptions: Record<string, string> = {
  "Overview": "Your business command centre",
  "Live tenders": "Discover opportunities matched to your company",
  "AI tender brain": "Turn tender documents into clear next steps",
  "Bid workspace": "Move every bid from preparation to submission",
  "Contracts": "Keep delivery, milestones and obligations under control",
  "Payments & invoices": "Track invoices, receivables and payment status",
  "Documents": "Keep your bid-ready documents organised",
  "Workforce": "Manage people, attendance and deployment",
  "Team": "Bring your bid and operations team together",
  "Notifications": "Important changes, deadlines and reminders",
  "Company profile": "Your business profile, eligibility signals and document vault",
  "Subscription": "Manage your plan, billing and usage limits",
  "Settings": "Preferences, security and account controls",
};

function Icon({ children }: { children: React.ReactNode }) {
  return <span style={{ width: 17, textAlign: "center", fontSize: 17, flex: "none", opacity: 0.8 }} aria-hidden="true">{children}</span>;
}

export default function BidWellDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Tender | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  // Filters
  const [filterState, setFilterState] = useState("All States");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [sortBy, setSortBy] = useState("deadline"); // deadline, value, match

  // Profile States
  const [profile, setProfile] = useState<any>({ company_name: "", gstin: "", pan: "", msme: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    setLoading(true);
    fetch('/api/tenders?page=0')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tenders) {
          const mapped = data.tenders.map((t: any) => ({
            id: t.source_tender_id || t.id,
            title: t.title || "Untitled Tender",
            department: t.org_name || "Unknown Department",
            location: t.state || "India",
            value: t.value ? `₹${t.value}` : "Check Portal",
            deadline: t.closing_date ? new Date(t.closing_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Check Portal",
            rawDeadline: t.closing_date || "",
            match: t.match_score || 50,
            category: "General",
            status: t.closing_date && new Date(t.closing_date) < new Date() ? "Expired" : "Active",
            source: t.source || "CPPP"
          }));
          setTenders(mapped);
          setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  // Profile API
  useEffect(() => {
    if (active === "Company profile") {
      fetch('/api/company-profile').then(r => r.json()).then(d => {
        if (d.success && d.profile) setProfile(d.profile);
      });
    }
  }, [active]);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    await fetch('/api/company-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    setProfileSaving(false);
    alert("Profile Details Saved Successfully!");
  };

  // Derive Filters & Sort
  const uniqueStates = useMemo(() => ["All States", ...Array.from(new Set(tenders.map(t => t.location)))], [tenders]);
  const uniqueSources = useMemo(() => ["All Sources", ...Array.from(new Set(tenders.map(t => t.source)))], [tenders]);

  const filtered = useMemo(() => {
    let result = tenders.filter(t => {
      const matchesSearch = `${t.title} ${t.department} ${t.location} ${t.id}`.toLowerCase().includes(query.toLowerCase());
      const matchesState = filterState === "All States" || t.location === filterState;
      const matchesSource = filterSource === "All Sources" || t.source === filterSource;
      return matchesSearch && matchesState && matchesSource;
    });

    if (sortBy === "deadline") {
      result.sort((a, b) => new Date(a.rawDeadline).getTime() - new Date(b.rawDeadline).getTime());
    } else if (sortBy === "match") {
      result.sort((a, b) => b.match - a.match);
    }

    return result;
  }, [query, tenders, filterState, filterSource, sortBy]);

  const isTenderPage = active === "Live tenders";
  const heading = selected ? "Tender overview" : active;
  const subheading = selected ? selected.title : descriptions[active] || "";

  const cardStyle = { background: "#fff", borderRadius: 14, border: "1px solid #e8edf5", padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" };
  const btnStyle = { background: "#315efb", color: "#fff", padding: "10px 14px", borderRadius: 9, border: 0, fontWeight: 700, cursor: "pointer", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", fontFamily: "system-ui, sans-serif", overflowX: "hidden" }}>
      
      {mobileMenu && (<div onClick={() => setMobileMenu(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />)}

      {/* Sidebar */}
      <aside style={{ 
        width: 260, background: "linear-gradient(180deg,#101b32 0%,#142442 100%)", color: "#d5deee", padding: "24px 15px", 
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
        transform: mobileMenu ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease", overflowY: "auto", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 12px 25px", color: "#fff", fontSize: 22, fontWeight: 800 }}>
          <div style={{ height: 38, width: 38, borderRadius: 12, background: "#315efb", display: "grid", placeItems: "center" }}>B</div> BidWell
        </div>
        <div style={{ flex: 1 }}>
          {nav.map(section => <div key={section.group} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.6, color: "#7788a6", padding: "0 12px 10px" }}>{section.group}</div>
            {section.items.map(([label, icon]) => <button key={label} onClick={() => { setActive(label); setSelected(null); setMobileMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: 0, borderRadius: 9, background: active === label ? "#315efb" : "transparent", color: active === label ? "#fff" : "#aab8cf", textAlign: "left", margin: "2px 0", fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
              <Icon>{icon}</Icon><span>{label}</span>
            </button>)}
          </div>)}
        </div>
        <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 20 }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: 0, borderRadius: 9, background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", textAlign: "left", fontSize: 12, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>↪</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ width: "100%", transition: "0.3s" }}>
        <header style={{ height: 75, background: "#fff", borderBottom: "1px solid #e8edf5", display: "flex", alignItems: "center", padding: "0 20px", gap: 15 }}>
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", display: "block" }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 11, border: "1px solid #e7ebf3", background: "#fafbfe", borderRadius: 10, padding: "0 13px", height: 40, maxWidth: 610, width: "100%" }}>
            <span style={{ fontSize: 22, color: "#8794a9" }}>⌕</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tenders, departments..." style={{ border: 0, outline: 0, background: "transparent", flex: 1, fontSize: 12 }} />
          </div>
        </header>

        <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 25 }}>
            <div style={{ fontSize: 10, color: "#7b879d", fontWeight: 800, letterSpacing: 1 }}>BIDWELL WORKSPACE</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "9px 0 4px" }}>{heading}</h1>
            <p style={{ fontSize: 12, color: "#7b879a", margin: 0 }}>{subheading}</p>
          </div>

          {/* LIVE TENDERS WITH FILTERS */}
          {isTenderPage && !selected && <section style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            
            {/* Filter Bar */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #edf0f6", display: "flex", flexWrap: "wrap", gap: 12, background: "#fafbfe" }}>
              <select value={filterState} onChange={e => setFilterState(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, outline: "none", background: "#fff" }}>
                {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterSource} onChange={e => setFilterSource(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, outline: "none", background: "#fff" }}>
                {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, outline: "none", background: "#fff", marginLeft: "auto" }}>
                <option value="deadline">Sort: Deadline (Soonest)</option>
                <option value="match">Sort: Best Match</option>
              </select>
            </div>

            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f7", fontSize: 11, color: "#7c889c", display: "flex", justifyContent: "space-between" }}>
              <span>Showing <b>{filtered.length}</b> live opportunities</span>
              <span style={{ color: "#10b981" }}>● Synced at {lastUpdated || "Just now"}</span>
            </div>

            {loading ? <div style={{ padding: 20 }}>Fetching live data...</div> : 
            <div>
              {filtered.map(t => <article key={t.id} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "19px 20px", borderBottom: "1px solid #edf0f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 9, color: "#8994a7", display: "flex", gap: 6, alignItems: "center" }}>
                    <span>{t.id}</span> 
                    <span style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>{t.source}</span>
                    <span style={{ color: t.status === "Expired" ? "#ef4444" : "#178668", background: t.status === "Expired" ? "#fef2f2" : "#e7f7f0", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>● {t.status}</span>
                  </div>
                  <span style={{ background: t.match >= 80 ? "#e3f7ef" : "#fff3db", color: t.match >= 80 ? "#168363" : "#a8751b", padding: "5px 7px", borderRadius: 7, fontSize: 9, fontWeight: 800 }}>{t.match}% Match</span>
                </div>
                <div>
                  <button onClick={() => setSelected(t)} style={{ background: "none", border: 0, padding: 0, textAlign: "left", fontSize: 14, fontWeight: 800, color: "#26354e", marginBottom: 6, cursor: "pointer" }}>{t.title}</button>
                  <p style={{ margin: 0, fontSize: 11, color: "#8591a5" }}>{t.department} · {t.location}</p>
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 10, color: "#8994a6", background: "#f9fafc", padding: 10, borderRadius: 8 }}><span>◈ Value: <b>{t.value}</b></span><span>◷ Deadline: <b>{t.deadline}</b></span></div>
              </article>)}
            </div>}
          </section>}

          {/* COMPANY PROFILE */}
          {active === "Company profile" && !selected && <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Company Details (India)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>COMPANY NAME</label><input value={profile.company_name || ""} onChange={e => setProfile({...profile, company_name: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>GSTIN</label><input value={profile.gstin || ""} onChange={e => setProfile({...profile, gstin: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>PAN</label><input value={profile.pan || ""} onChange={e => setProfile({...profile, pan: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
                <div><label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>MSME / UDYAM</label><input value={profile.msme || ""} onChange={e => setProfile({...profile, msme: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0", marginTop: 4, fontSize: 12 }} /></div>
              </div>
              <button onClick={handleSaveProfile} disabled={profileSaving} style={{ ...btnStyle, marginTop: 16, width: "100%", justifyContent: "center" }}>{profileSaving ? "Saving..." : "Save Profile Details"}</button>
            </div>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Document Vault</div>
                <div style={{ fontSize: 11, color: "#10b981", background: "#ecfdf5", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>100% Safe</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["GST Certificate", "PAN Card", "MSME / Udyam", "Class-3 DSC", "ISO 9001", "PSARA License"].map(doc => (
                  <div key={doc} style={{ border: "1px dashed #cbd5e1", padding: 16, borderRadius: 10, textAlign: "center", background: "#f8fafc" }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>📄</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{doc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>}

        </div>
      </main>
    </div>
  );
}
