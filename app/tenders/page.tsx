"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

function getDaysLeft(d: string | null) { if (!d) return null; return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

const CATEGORIES = ["All", "Security", "Housekeeping", "Manpower", "Facility", "Construction", "IT"];

export default function Tenders() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("tenders").select("*").order("created_at", { ascending: false });
      setTenders(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const allActive = tenders.filter((t: any) => {
    const d = getDaysLeft(t.deadline);
    return t.status === "active" && (d === null || d > 0);
  });
  const allExpired = tenders.filter((t: any) => {
    const d = getDaysLeft(t.deadline);
    return t.status === "active" && d !== null && d <= 0;
  });

  const applyFilters = (list: any[]) => list.filter((t) => {
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase()) && !t.department?.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && !t.title?.toLowerCase().includes(category.toLowerCase())) return false;
    if (minValue && (t.value_in_cr || 0) < parseFloat(minValue)) return false;
    if (maxValue && (t.value_in_cr || 0) > parseFloat(maxValue)) return false;
    return true;
  });

  const active = applyFilters(allActive);
  const expired = applyFilters(allExpired);

  const Card = ({ t }: { t: any }) => {
    const dl = getDaysLeft(t.deadline);
    const match = t.match_score || null;
    return (
      <Link href={`/tenders/${t.id}`}>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 pr-2">
              <p className="font-bold text-gray-900 text-sm leading-tight">{t.title}</p>
              <p className="text-xs text-gray-500 mt-1">{t.department || "N/A"}</p>
            </div>
            {match !== null ? (
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${match >= 75 ? "bg-green-100 text-green-700" : match >= 50 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>{match}%</span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">AI?</span>
            )}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">🏛️ {t.country || "India"}</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold">₹{t.value_in_cr || 0} Cr</span>
            </div>
            {dl !== null && (<span className={`text-xs font-semibold ${dl <= 3 ? "text-red-600" : dl <= 7 ? "text-orange-600" : "text-gray-500"}`}>{dl > 0 ? `${dl}d left` : "Expired"}</span>)}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-gray-900">Tender Discovery</h1>
          <button onClick={() => setShowFilters(!showFilters)} className="text-blue-600 text-sm font-semibold">⚙️ Filter</button>
        </div>
        <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center">
          <span className="text-gray-400 mr-2">🔍</span>
          <input type="text" placeholder="Search tenders..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent w-full outline-none text-sm" />
        </div>

        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${category === c ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Min Value (₹ Cr)</p>
                <input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Max Value (₹ Cr)</p>
                <input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs" />
              </div>
            </div>
            <button onClick={() => { setCategory("All"); setMinValue(""); setMaxValue(""); setSearch(""); }} className="text-xs text-red-600 font-semibold">Clear All Filters</button>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold">Recommended ({active.length})</button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200">Latest</button>
        </div>
        <h2 className="font-bold text-gray-900 text-sm mb-3">Active</h2>
        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) : active.length > 0 ? active.map((t: any) => <Card key={t.id} t={t} />) : (<div className="bg-white p-6 rounded-2xl text-center mb-4"><p className="text-gray-500 text-sm">Koi active tender nahi hai</p></div>)}
        {expired.length > 0 && (<><h2 className="font-bold text-gray-400 text-sm mb-3 mt-6">Expired ({expired.length})</h2>{expired.map((t: any) => <Card key={t.id} t={t} />)}</>)}
        <Link href="/upload"><button className="w-full mt-5 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">+ Upload New Tender</button></Link>
      </div>
      <BottomNav />
    </main>
  );
}
