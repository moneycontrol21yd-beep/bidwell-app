"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const STAGES = ["draft", "review", "approved", "submitted", "evaluation", "awarded"];

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
      else alert("🎉 Contract ban gaya! Contracts tab dekho.");
    } else {
      await supabase.from("tenders").update({ bid_stage: stage }).eq("id", tender.id);
    }
    await load();
    setUpdating(null);
  };

  const stageLabel = (s: string) => {
    const map: any = { draft: "🟡 Draft", review: "🟠 Ready for Review", approved: "🔵 Approved", submitted: "🟣 Submitted", evaluation: "🟪 Under Evaluation", awarded: "🏆 Awarded" };
    return map[s] || "🟡 Draft";
  };

  const progress = (s: string) => Math.round(((STAGES.indexOf(s || "draft") + 1) / STAGES.length) * 100);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <Link href="/tenders" className="text-blue-600 text-sm">← Tenders</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-3">Bid Workspace</h1>
        <p className="text-xs text-gray-500 mt-1">Apne bids manage karo</p>
      </div>

      <div className="p-5 space-y-4">
        {loading ? (<p className="text-center text-gray-500 text-sm py-6">Loading...</p>) :
          tenders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center">
              <p className="text-gray-500 text-sm">Koi active tender nahi hai.</p>
              <Link href="/upload"><button className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-sm">+ Upload Tender</button></Link>
            </div>
          ) : (
            tenders.map((t) => {
              const stage = t.bid_stage || "draft";
              const pct = progress(stage);
              return (
                <div key={t.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-gray-900 text-sm flex-1 pr-2 leading-tight">{t.title}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">85%</span>
                    </div>
                    <p className="text-xs text-gray-500">{t.department}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">₹{t.value_in_cr} Cr</p>
                  </div>

                  <div className="p-4 bg-gray-50">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span className="font-semibold">Bid Progress</span>
                      <span className="font-bold text-blue-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white p-2 rounded-lg text-center">
                        <p className="text-green-600 font-semibold">✅</p>
                        <p className="text-gray-500 mt-0.5">Eligibility</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg text-center">
                        <p className="text-orange-500 font-semibold">4/8</p>
                        <p className="text-gray-500 mt-0.5">Documents</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg text-center">
                        <p className="text-gray-400 font-semibold">0%</p>
                        <p className="text-gray-500 mt-0.5">Technical</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">Status: <span className="font-semibold text-gray-900">{stageLabel(stage)}</span></p>
                    <div className="flex gap-2 mb-3">
                      <Link href={`/tenders/${t.id}`} className="flex-1">
                        <button className="w-full bg-gray-100 text-gray-700 font-bold py-2 rounded-xl text-xs">View Details</button>
                      </Link>
                      <Link href={`/eligibility/${t.id}`} className="flex-1">
                        <button className="w-full bg-blue-100 text-blue-700 font-bold py-2 rounded-xl text-xs">AI Eligibility</button>
                      </Link>
                    </div>

                    <select
                      value={stage}
                      onChange={(e) => updateStage(t, e.target.value)}
                      disabled={updating === t.id}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm px-3"
                    >
                      <option value="draft">🟡 Draft</option>
                      <option value="review">🟠 Ready for Review</option>
                      <option value="approved">🔵 Approved</option>
                      <option value="submitted">🟣 Submitted</option>
                      <option value="evaluation">🟪 Under Evaluation</option>
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
