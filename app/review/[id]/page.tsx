"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BidReview() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<any>({ technical: false, financial: false, docs: false, decl: false, boq: false });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("tenders").select("*").eq("id", id).single();
      setTender(data);
      if (data?.review_checks) { try { setChecks(JSON.parse(data.review_checks)); } catch {} }
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  const toggle = async (key: string) => {
    const next = { ...checks, [key]: !checks[key] };
    setChecks(next);
    await supabase.from("tenders").update({ review_checks: JSON.stringify(next) }).eq("id", id);
  };

  const readyCount = Object.values(checks).filter(Boolean).length;
  const totalCount = Object.keys(checks).length;
  const ready = readyCount === totalCount;

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"><p className="text-center text-gray-500 text-sm py-10">Loading...</p></main>;
  if (!tender) return <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"><p className="text-center text-red-500 text-sm py-10">Tender nahi mila</p></main>;

  const items = [
    { key: "technical", label: "Technical Response", note: "Complete & verified" },
    { key: "financial", label: "Financial Bid", note: "BOQ ready" },
    { key: "docs", label: "Required Documents", note: "All attachments" },
    { key: "decl", label: "Declarations & Forms", note: "Annexures signed" },
    { key: "boq", label: "BOQ Verified", note: "Rates checked" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href={`/technical/${id}`} className="text-blue-600 text-sm">← Technical</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">Bid Review</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Final checklist before submit</p>
      </div>
      <div className="p-5 space-y-4">
        <div className={`p-5 rounded-2xl ${ready ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700" : "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800"}`}>
          <div className="flex justify-between items-center mb-2">
            <p className={`font-bold text-sm ${ready ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400"}`}>
              {ready ? "🎉 Ready for Submission" : "Bid Readiness"}
            </p>
            <span className={`text-2xl font-bold ${ready ? "text-green-600" : "text-blue-600"}`}>{readyCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-white dark:bg-gray-700 rounded-full h-2">
            <div className={`h-2 rounded-full ${ready ? "bg-green-500" : "bg-blue-600"}`} style={{ width: `${(readyCount / totalCount) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Checklist</h2>
          <div className="space-y-3">
            {items.map((it) => (
              <button key={it.key} onClick={() => toggle(it.key)} className="w-full flex items-center text-left">
                <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-xs ${checks[it.key] ? "bg-green-500 border-green-500 text-white" : "border-gray-300 dark:border-gray-500"}`}>
                  {checks[it.key] ? "✓" : ""}
                </span>
                <div className="flex-1">
                  <p className={`text-sm ${checks[it.key] ? "text-gray-400 line-through" : "text-gray-900 dark:text-white font-medium"}`}>{it.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{it.note}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Estimated Bid Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹3.95 Cr</p>
        </div>
        <button disabled={!ready} className={`w-full font-bold py-4 rounded-xl text-sm ${ready ? "bg-green-600 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
          {ready ? "🚀 Submit Bid" : `Complete all ${totalCount} items`}
        </button>
      </div>
    </main>
  );
}
