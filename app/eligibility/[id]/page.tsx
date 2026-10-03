"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Eligibility() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        const res = await fetch("/api/eligibility-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tender_id: id }),
        });
        const json = await res.json();
        if (json.success) {
          setData(json.result);
          fetch("/api/calculate-match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tender_id: id }),
          });
        } else setError(json.error || "Analysis failed");
      } catch (e: any) { setError(e.message); }
      setLoading(false);
    };
    run();
  }, [id]);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <Link href="/tenders" className="text-blue-600 text-sm">← Tenders</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-3">AI Eligibility Check</h1>
        <p className="text-xs text-gray-500 mt-1">Tender vs Tumhari Company</p>
      </div>

      {loading && (<div className="p-8 text-center"><div className="text-6xl mb-4">🤖</div><p className="text-gray-700 font-semibold text-sm">AI analysis kar raha hai...</p><p className="text-xs text-gray-400 mt-2">15-20 seconds</p></div>)}

      {error && (<div className="p-5"><div className="bg-red-50 border border-red-200 p-4 rounded-2xl"><p className="text-red-700 text-sm">{error}</p></div></div>)}

      {data && (
        <div className="p-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{data.match_score}%</div>
            <p className="text-sm text-gray-500 mb-3">Overall Match</p>
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${data.verdict === "eligible" ? "bg-green-100 text-green-700" : data.verdict === "partial" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
              {data.verdict === "eligible" ? "🟢 Eligible" : data.verdict === "partial" ? "🟡 Partial Match" : "🔴 Not Eligible"}
            </span>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl"><p className="text-sm text-gray-800">{data.summary}</p></div>
          <div>
            <h2 className="font-bold text-gray-900 mb-3">Why this matches</h2>
            <div className="space-y-2">
              {(data.checks || []).map((c: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-start">
                  <span className="text-2xl mr-3">{c.status === "match" ? "✅" : c.status === "warning" ? "⚠️" : "❌"}</span>
                  <div className="flex-1"><p className="font-semibold text-gray-900 text-sm">{c.requirement}</p>{c.note && <p className="text-xs text-gray-500 mt-1">{c.note}</p>}</div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/bids"><button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">Bid Workspace me jaao →</button></Link>
        </div>
      )}
      <BottomNav />
    </main>
  );
}
