"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { SparklesIcon, FileTextIcon, CheckSquareIcon } from "@/components/icons";

function getDaysLeft(d: string | null) { if (!d) return null; return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

export default function TenderDetail() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("tenders").select("*").eq("id", id).single();
      setTender(data);
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6"><p className="text-center text-gray-500 text-sm py-10">Loading...</p></main>;
  if (!tender) return <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6"><p className="text-center text-red-500 text-sm py-10">Tender nahi mila</p></main>;

  const daysLeft = getDaysLeft(tender.deadline);
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "eligibility", label: "Eligibility" },
    { key: "documents", label: "Documents" },
    { key: "boq", label: "BOQ" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-5 pt-5 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <Link href="/tenders" className="text-blue-100/80 text-xs font-bold tracking-wide">← TENDERS</Link>
          <h1 className="text-lg font-bold mt-3 leading-tight tracking-tight">{tender.title}</h1>
          <p className="text-blue-100/70 text-xs mt-1">{tender.department || "N/A"}</p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-100/70 font-bold tracking-wider uppercase">Value</p>
              <p className="font-bold text-sm mt-1">₹{tender.value_in_cr} Cr</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-100/70 font-bold tracking-wider uppercase">Country</p>
              <p className="font-bold text-sm mt-1">{tender.country || "India"}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-100/70 font-bold tracking-wider uppercase">Days Left</p>
              <p className="font-bold text-sm mt-1">{daysLeft && daysLeft > 0 ? daysLeft : "Exp"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-20 mb-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-1.5 flex gap-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-wide transition ${tab === t.key ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400"}`}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {tab === "overview" && (
          <>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 tracking-tight flex items-center">
                <FileTextIcon size={16} className="mr-2 text-blue-600" />
                TENDER OVERVIEW
              </h2>
              <div className="space-y-2.5 text-xs">
                {[
                  ["Organization", tender.department || "N/A"],
                  ["Location", tender.location || "N/A"],
                  ["Value", `₹${tender.value_in_cr} Cr`],
                  ["EMD", `₹${((tender.value_in_cr || 0) * 0.02).toFixed(2)} Cr`],
                  ["Deadline", tender.deadline ? new Date(tender.deadline).toLocaleDateString("en-IN") : "N/A"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5 last:border-0">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{k}</span>
                    <span className="text-gray-900 dark:text-white font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "eligibility" && (
          <>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-2">AI Match Score</p>
              <div className="text-5xl font-bold text-blue-600 tracking-tight mb-3">{tender.match_score || 85}%</div>
              <Link href={`/eligibility/${tender.id}`}>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-xs tracking-wide shadow-lg shadow-blue-600/20">
                  VIEW FULL ANALYSIS →
                </button>
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 tracking-tight">Quick Check</h2>
              <div className="space-y-2">
                {[
                  { s: "match", l: "Experience", n: "Requirements met" },
                  { s: "match", l: "Service Category", n: "Matches your profile" },
                  { s: "warning", l: "Turnover", n: "Verify documents" },
                  { s: "missing", l: "Bank Certificate", n: "Upload required" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 ${c.s === "match" ? "bg-green-100 dark:bg-green-900/30" : c.s === "warning" ? "bg-orange-100 dark:bg-orange-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                      <span className="text-xs font-bold">{c.s === "match" ? "✓" : c.s === "warning" ? "!" : "×"}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{c.l}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{c.n}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "documents" && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3 tracking-tight flex items-center">
              <CheckSquareIcon size={16} className="mr-2 text-blue-600" />
              REQUIRED DOCUMENTS
            </h2>
            <div className="space-y-2">
              {["GST Certificate", "PAN Card", "PSARA License", "Labour License", "ISO 9001", "Experience Certificate", "Bank Certificate"].map((d, i) => (
                <div key={i} className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 ${i < 4 ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{i < 4 ? "✓" : "!"}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white flex-1">{d}</p>
                  <p className={`text-[10px] font-bold tracking-wide ${i < 4 ? "text-green-600" : "text-orange-600"}`}>{i < 4 ? "READY" : "PENDING"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "boq" && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center py-10">
            <FileTextIcon size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 dark:text-white">BOQ Analysis</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Coming soon — AI BOQ parsing feature</p>
          </div>
        )}

        <Link href={`/eligibility/${tender.id}`}>
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 tracking-wide text-sm flex items-center justify-center">
            <SparklesIcon size={16} className="mr-2" />
            AI ELIGIBILITY CHECK
          </button>
        </Link>
      </div>
      <BottomNav />
    </main>
  );
}
