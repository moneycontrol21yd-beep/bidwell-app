"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { SearchIcon, FilterIcon, EyeIcon, SparklesIcon, AlertIcon } from "@/components/icons";

function getDaysLeft(d: string | null) { if (!d) return null; return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

const CATEGORIES = ["All", "Security", "Housekeeping", "Construction", "Electrical", "IT", "Catering", "Transport"];
const VIEW_TABS = [
  { key: "mine", label: "🎯 For Me" },
  { key: "all", label: "🌐 All" },
  { key: "saved", label: "⭐ Saved" },
  { key: "watching", label: "👁️ Watching" },
];

const BIZ_KEYWORDS: any = {
  "Security & Manpower": ["security", "guard", "manpower", "watchman", "housekeeping"],
  "Housekeeping & Facility": ["housekeeping", "cleaning", "facility", "maintenance", "sanitation"],
  "Construction & Civil": ["construction", "civil", "road", "building", "lane", "highway", "bridge"],
  "IT & Software": ["software", "it services", "computer", "network", "digital"],
  "Electrical & Plumbing": ["electrical", "plumbing", "wiring", "boiler", "power"],
  "Catering & Food": ["catering", "food", "kitchen", "canteen", "meal"],
  "Transport & Logistics": ["transport", "logistics", "vehicle", "fleet", "courier"],
};

export default function LiveTenders() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [view, setView] = useState("mine");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("All");

  const load = async () => {
    const { data: t } = await supabase.from("tenders").select("*").order("created_at", { ascending: false });
    const { data: c } = await supabase.from("companies").select("*").limit(1).maybeSingle();
    setTenders(t || []);
    setCompany(c);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleWatch = async (e: any, id: string, current: boolean) => {
    e.preventDefault(); e.stopPropagation();
    await supabase.from("tenders").update({ is_watched: !current }).eq("id", id);
    load();
  };

  const fetchLive = async () => {
    setFetching(true);
    setMessage("BidWell live tenders la raha hai...");
    const keyword = BIZ_KEYWORDS[company?.business_type]?.[0] || "services";
    try {
      const res = await fetch("/api/fetch-tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ ${data.inserted} naye tenders mile`);
        load();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    }
    setFetching(false);
    setTimeout(() => setMessage(""), 5000);
  };

  const matchesProfile = (t: any) => {
    if (!company?.business_type) return true;
    const keywords = BIZ_KEYWORDS[company.business_type] || [];
    if (keywords.length === 0) return true;
    const title = (t.title || "").toLowerCase();
    const dept = (t.department || "").toLowerCase();
    return keywords.some((k: string) => title.includes(k) || dept.includes(k));
  };

  const allActive = tenders.filter((t) => { const d = getDaysLeft(t.deadline); return t.status === "active" && (d === null || d > 0); });
  const allExpired = tenders.filter((t) => { const d = getDaysLeft(t.deadline); return t.status === "active" && d !== null && d <= 0; });

  const applyFilters = (list: any[]) => list.filter((t) => {
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase()) && !t.department?.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && !t.title?.toLowerCase().includes(category.toLowerCase())) return false;
    if (location !== "All" && !(t.location || "").toLowerCase().includes(location.toLowerCase())) return false;
    if (minValue && (t.value_in_cr || 0) < parseFloat(minValue)) return false;
    if (maxValue && (t.value_in_cr || 0) > parseFloat(maxValue)) return false;
    if (deadlineFilter !== "All") {
      const dl = getDaysLeft(t.deadline);
      if (dl === null) return false;
      if (deadlineFilter === "7d" && dl > 7) return false;
      if (deadlineFilter === "30d" && dl > 30) return false;
    }
    return true;
  });

  let filteredActive: any[] = [];
  let filteredExpired: any[] = [];

  if (view === "mine") {
    filteredActive = applyFilters(allActive).filter(matchesProfile);
    filteredExpired = applyFilters(allExpired).filter(matchesProfile);
  } else if (view === "all") {
    filteredActive = applyFilters(allActive);
    filteredExpired = applyFilters(allExpired);
  } else if (view === "saved") {
    filteredActive = applyFilters(allActive).filter((t) => t.is_saved);
  } else if (view === "watching") {
    filteredActive = applyFilters(allActive).filter((t) => t.is_watched);
  }

  const activeFiltersCount = [category !== "All", location !== "All", minValue !== "", maxValue !== "", deadlineFilter !== "All"].filter(Boolean).length;

  const Card = ({ t }: { t: any }) => {
    const dl = getDaysLeft(t.deadline);
    const match = t.match_score || 85;
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-3">
        <Link href={`/tenders/${t.id}`}>
          <div className="p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{t.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{t.department || "N/A"}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap ${match >= 75 ? "bg-green-100 text-green-700" : match >= 50 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>{match}%</span>
                <button onClick={(e) => toggleWatch(e, t.id, t.is_watched)} className={`w-7 h-7 rounded-lg flex items-center justify-center ${t.is_watched ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                  <EyeIcon size={14} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex gap-2">
                <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded font-semibold">{t.location || "India"}</span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded font-bold">₹{t.value_in_cr || 0} Cr</span>
              </div>
              {dl !== null && (
                <span className={`text-xs font-bold ${dl <= 3 ? "text-red-600" : dl <= 7 ? "text-orange-600" : "text-gray-500"}`}>
                  {dl > 0 ? `${dl}d left` : "Expired"}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 text-white px-5 pt-6 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <Link href="/dashboard" className="text-white/80 text-xs font-bold tracking-wide">← DASHBOARD</Link>
          <div className="flex items-center mt-3">
            <span className="text-3xl mr-3">🔴</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Live Tenders</h1>
              <p className="text-white/80 text-xs mt-0.5">
                {company?.business_type ? `${company.business_type} matching` : "Real government tenders"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-20 space-y-4">
        <button
          onClick={fetchLive}
          disabled={fetching}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 text-sm tracking-wide flex items-center justify-center disabled:opacity-60"
        >
          <SparklesIcon size={18} className="mr-2" />
          {fetching ? "FETCHING..." : "FETCH NEW LIVE TENDERS"}
        </button>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-medium text-center ${message.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : message.startsWith("❌") ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
            {message}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-5 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-1.5 flex gap-1">
          {VIEW_TABS.map((t) => (
            <button key={t.key} onClick={() => setView(t.key)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-wide transition ${view === t.key ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-5 mt-3 flex gap-2">
        <div className="bg-white dark:bg-gray-900 rounded-xl px-3.5 py-2.5 flex items-center flex-1 border border-gray-200 dark:border-gray-800">
          <SearchIcon size={16} className="text-gray-400 mr-2.5" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent w-full outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`w-11 h-11 rounded-xl flex items-center justify-center relative ${showFilters || activeFiltersCount > 0 ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800"}`}>
          <FilterIcon size={16} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="px-5 mt-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 space-y-3">
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-2">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${category === c ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-2">Location</p>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Delhi", "Maharashtra", "UP", "Karnataka", "Tamil Nadu", "Punjab"].map((l) => (
                  <button key={l} onClick={() => setLocation(l)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${location === l ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Min (₹ Cr)</p>
                <input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-900 dark:text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5">Max (₹ Cr)</p>
                <input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-900 dark:text-white" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-2">Deadline</p>
              <div className="flex gap-1.5">
                {[{ k: "All", l: "All" }, { k: "7d", l: "7 days" }, { k: "30d", l: "30 days" }].map((d) => (
                  <button key={d.k} onClick={() => setDeadlineFilter(d.k)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${deadlineFilter === d.k ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>{d.l}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { setCategory("All"); setLocation("All"); setMinValue(""); setMaxValue(""); setDeadlineFilter("All"); setSearch(""); }} className="text-xs text-red-600 font-bold">Clear All Filters</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="px-5 mt-4">
        {loading ? (
          <p className="text-center text-gray-500 text-sm py-6">Loading...</p>
        ) : (
          <>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-2">
              {view === "mine" ? "Matched for You" : view === "all" ? "All Active" : view === "saved" ? "Saved" : "Watching"} ({filteredActive.length})
            </p>

            {filteredActive.length > 0 ? (
              filteredActive.map((t) => <Card key={t.id} t={t} />)
            ) : (
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
                <AlertIcon size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {view === "mine" ? "Aapke profile se match nahi hua" : "Koi tender nahi"}
                </p>
                {view === "mine" && (
                  <button onClick={() => setView("all")} className="mt-3 text-blue-600 font-bold text-sm">🌐 All Tenders dekho</button>
                )}
              </div>
            )}

            {filteredExpired.length > 0 && (
              <>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2 mt-6">Expired ({filteredExpired.length})</p>
                {filteredExpired.map((t) => <Card key={t.id} t={t} />)}
              </>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
