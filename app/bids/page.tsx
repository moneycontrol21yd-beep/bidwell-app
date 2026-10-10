"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SparklesIcon, FileTextIcon } from "@/components/icons";

const STAGES = ["draft", "review", "approved", "submitted", "evaluation", "awarded"];
const READINESS = ["Eligibility Check", "Documents", "Technical Response", "BOQ / Pricing", "Final Review", "Submission"];

export default function Bids() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("tenders").select("*").eq("status", "active").order("created_at", { ascending: false });
    setTenders(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStage = async (tender: any, stage: string) => {
    setUpdating(tender.id);
    if (stage === "awarded") {
      const res = await fetch("/api/create-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tender_id: tender.id }),
      });
      const data = await res.json();
      if (!data.success) alert("Error: " + data.error);
      else alert("🎉 Contract ban gaya!");
    } else {
      await supabase.from("tenders").update({ bid_stage: stage }).eq("id", tender.id);
    }
    await load();
    setUpdating(null);
  };

  const stageLabel = (s: string) => {
    const map: any = { draft: "Draft", review: "Ready for Review", approved: "Approved", submitted: "Submitted", evaluation: "Under Evaluation", awarded: "Awarded" };
    return map[s] || "Draft";
  };
  const stageColor = (s: string) => {
    const map: any = { draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", review: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", approved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", submitted: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", evaluation: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", awarded: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    return map[s] || map.draft;
  };

  const totalReadiness = (stage: string) => Math.round(((STAGES.indexOf(stage || "draft") + 1) / STAGES.length) * 100);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/tenders" className="text-blue-600 text-xs font-bold tracking-wide">← TENDERS</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">Bid Workspace</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage your bids</p>
      </div>

      <div className="p-5 space-y-4">
        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          tenders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileTextIcon size={28} className="text-blue-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Koi active tender no hai.</p>
              <Link href="/upload"><button className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-sm">+ Upload Tender</button></Link>
            </div>
          ) : (
            tenders.map((t) => {
              const stage = t.bid_stage || "draft";
              const total = totalReadiness(stage);
              const idx = STAGES.indexOf(stage);
              return (
                <div key={t.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <p className="font-bold text-gray-900 dark:text-white text-sm flex-1 tracking-tight leading-tight">{t.title}</p>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold tracking-wide ${(t.match_score || 85) >= 75 ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"}`}>{t.match_score || 85}%</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.department}</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">₹{t.value_in_cr} Cr</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Bid Readiness</span>
                      <span className="font-bold text-blue-600 text-sm">{total}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all" style={{ width: `${total}%` }}></div>
                    </div>
                    <div className="space-y-2">
                      {READINESS.map((label, i) => {
                        const done = i < idx + 1;
                        const inProgress = i === idx;
                        return (
                          <div key={i} className="flex items-center text-xs">
                            <div className={`w-4 h-4 rounded-md flex items-center justify-center mr-2 ${done && !inProgress ? "bg-green-500" : inProgress ? "bg-orange-400" : "bg-gray-300 dark:bg-gray-600"}`}>
                              {done && !inProgress && <span className="text-white text-[10px] font-bold">✓</span>}
                            </div>
                            <span className={`flex-1 ${done && !inProgress ? "text-gray-500 line-through" : "text-gray-700 dark:text-gray-300 font-medium"}`}>{label}</span>
                            <span className={`font-bold text-[10px] tracking-wide ${done && !inProgress ? "text-green-600" : inProgress ? "text-orange-600" : "text-gray-400"}`}>
                              {done && !inProgress ? "DONE" : inProgress ? "60%" : "PENDING"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Status</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${stageColor(stage)}`}>{stageLabel(stage).toUpperCase()}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <Link href={`/tenders/${t.id}`}>
                        <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-xl text-xs tracking-wide">View</button>
                      </Link>
                      <Link href={`/technical/${t.id}`}>
                        <button className="w-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold py-2.5 rounded-xl text-xs tracking-wide">Tech</button>
                      </Link>
                      <Link href={`/review/${t.id}`}>
                        <button className="w-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold py-2.5 rounded-xl text-xs tracking-wide">Review</button>
                      </Link>
                    </div>

                    <select value={stage} onChange={(e) => updateStage(t, e.target.value)} disabled={updating === t.id} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm px-3 tracking-wide">
                      <option value="draft">Draft</option>
                      <option value="review">Ready for Review</option>
                      <option value="approved">Approved</option>
                      <option value="submitted">Submitted</option>
                      <option value="evaluation">Under Evaluation</option>
                      <option value="awarded">🏆 Awarded → Create Contract</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
      </div>
      <BottomNav />
    </main>
  );
}
