"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MatchAnalysisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenderId = searchParams.get("tenderId");

  const [tender, setTender] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, c] = await Promise.all([
          tenderId
            ? supabase.from("tenders").select("*").eq("id", tenderId).single()
            : Promise.resolve({ data: null }),
          supabase.from("companies").select("*").limit(1).single(),
        ]);
        setTender(t.data);
        setCompany(c.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [tenderId]);

  const runAIMatch = async () => {
    if (!tender) return;
    setRunning(true);
    try {
      const res = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender.id,
          title: tender.title,
          department: tender.department,
          value: tender.value_in_cr,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTender({
          ...tender,
          match_score: parseInt(String(data.eligibility).replace(/[^0-9]/g, "")) || tender.match_score,
          ai_summary: data.summary,
        });
      }
    } catch (e) {
      console.error(e);
    }
    setRunning(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <p className="text-center text-gray-500 text-sm pt-10">Loading match analysis...</p>
      </main>
    );
  }

  if (!tender) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <Link href="/live-tenders" className="text-blue-600 text-xs font-bold">← BACK</Link>
        <p className="text-center text-gray-500 text-sm pt-10">Select a tender to view match analysis</p>
      </main>
    );
  }

  const overall = tender.match_score || 50;
  const exp = Math.min(100, Math.max(30, (company?.experience_years || 0) * 14));
  const turnover = Math.min(100, Math.max(30, ((company?.turnover_cr || 0) / Math.max(tender.value_in_cr || 1, 1)) * 80));
  const location = (company?.address || "").toLowerCase().includes("maharashtra") ? 95 : 60;
  const manpower = Math.min(100, Math.max(40, ((company?.employees_count || 200) / 200) * 100));
  const similarWork = tender.ai_summary ? 90 : 60;
  const md = Math.min(100, Math.max(50, overall + 5));
  const certificate = 85;

  const breakdown = [
    { label: "Experience", value: Math.round(exp) },
    { label: "Turnover", value: Math.round(turnover) },
    { label: "Location", value: location },
    { label: "Manpower", value: Math.round(manpower) },
    { label: "Similar Work", value: similarWork },
    { label: "MD Profile", value: md },
    { label: "Certificates", value: certificate },
  ];

  const decision = overall >= 80 ? "GO" : overall >= 60 ? "MAYBE" : "NO-GO";
  const decisionColor =
    decision === "GO" ? "from-green-600 to-emerald-600"
    : decision === "MAYBE" ? "from-orange-500 to-amber-600"
    : "from-red-500 to-rose-600";

  const circleColor =
    overall >= 80 ? "#16a34a" : overall >= 60 ? "#f97316" : "#dc2626";

  // SVG circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overall / 100) * circumference;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 text-white px-5 pt-5 pb-8 rounded-b-[2rem]">
        <Link href={`/tenders/${tender.id}`} className="text-purple-100/80 text-xs font-bold tracking-wide">
          ← BACK
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
            🎯
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">Match Analysis</h1>
            <p className="text-purple-100/70 text-[11px] mt-0.5 line-clamp-1">{tender.title}</p>
          </div>
        </div>
      </div>

      {/* Overall Score Circle */}
      <div className="px-5 -mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-4">
            Overall Match Score
          </p>

          <div className="relative" style={{ width: 170, height: 170 }}>
            <svg width="170" height="170" className="transform -rotate-90">
              <circle cx="85" cy="85" r={radius} stroke="#e5e7eb" strokeWidth="14" fill="none" />
              <circle
                cx="85"
                cy="85"
                r={radius}
                stroke={circleColor}
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold" style={{ color: circleColor }}>
                {overall}%
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                {overall >= 80 ? "Excellent Match" : overall >= 60 ? "Good Match" : "Low Match"}
              </p>
            </div>
          </div>

          <button
            onClick={runAIMatch}
            disabled={running}
            className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60"
          >
            {running ? "Analyzing..." : "🤖 Run AI Match Analysis"}
          </button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="px-5 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-4">
            📊 Score Breakdown
          </p>
          <div className="space-y-3">
            {breakdown.map((b, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{b.label}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{b.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      b.value >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : b.value >= 60 ? "bg-gradient-to-r from-orange-400 to-amber-500"
                      : "bg-gradient-to-r from-red-400 to-rose-500"
                    }`}
                    style={{ width: `${b.value}%`, transition: "width 1s ease" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bid Recommendation */}
      <div className="px-5 mt-4">
        <div className={`bg-gradient-to-r ${decisionColor} rounded-2xl p-5 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              {decision === "GO" ? "✅" : decision === "MAYBE" ? "⚠️" : "❌"}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-wider uppercase text-white/80">
                Bid Recommendation
              </p>
              <p className="text-white font-bold text-xl mt-0.5">{decision}</p>
              <p className="text-white/80 text-[11px] mt-0.5">
                {decision === "GO"
                  ? "High probability of success"
                  : decision === "MAYBE"
                  ? "Consider carefully before bidding"
                  : "Not recommended — low match"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {tender.ai_summary && (
        <div className="px-5 mt-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
              🤖 AI Analysis Summary
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {tender.ai_summary}
            </p>
          </div>
        </div>
      )}

      {/* Prepare Bid Button */}
      <div className="px-5 mt-5">
        <button
          onClick={async () => {
            await supabase.from("tenders").update({ bid_stage: "draft" }).eq("id", tender.id);
            router.push("/bids");
          }}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl text-sm shadow-lg active:scale-[0.98] transition"
        >
          🎯 Prepare Bid
        </button>
      </div>
    </main>
  );
}
