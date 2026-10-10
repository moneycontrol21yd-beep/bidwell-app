"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BrainPage() {
  const [brain, setBrain] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data: c } = await supabase.from("companies").select("*").limit(1).maybeSingle();
      setCompany(c);
      if (c) {
        const { data: b } = await supabase.from("company_brain").select("*").eq("company_id", c.id).maybeSingle();
        setBrain(b);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const generateBrain = async () => {
    if (!company) {
      setError("Company profile not found");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate-brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: company.id }),
      });
      const data = await res.json();
      if (data.success) {
        setBrain(data.brain);
        await load();
      } else {
        setError(data.error || "Failed to generate");
      }
    } catch (e: any) {
      setError(e.message || "Network error");
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <p className="text-center text-gray-500 text-sm pt-10">Loading...</p>
      </main>
    );
  }

  const certs = brain?.certifications ? Object.entries(brain.certifications) : [];
  const capacity = brain?.capacity || {};

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white px-5 pt-5 pb-8 rounded-b-[2rem]">
        <Link href="/profile" className="text-blue-100/80 text-xs font-bold tracking-wide">← PROFILE</Link>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
            🧠
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Company Brain</h1>
            <p className="text-blue-100/70 text-xs mt-0.5">AI-powered business intelligence</p>
          </div>
        </div>
        {brain?.updated_at && (
          <p className="text-blue-100/60 text-[10px] mt-4">
            Last updated: {new Date(brain.updated_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* Regenerate Button */}
      <div className="px-5 -mt-3">
        <button
          onClick={generateBrain}
          disabled={generating}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg active:scale-95 transition disabled:opacity-60"
        >
          {generating ? "🧠 Analyzing your company..." : "🧠 Regenerate Brain"}
        </button>
      </div>

      {error && (
        <div className="px-5 mt-3">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-2xl p-3">
            <p className="text-red-600 dark:text-red-400 text-xs">⚠️ {error}</p>
          </div>
        </div>
      )}

      {!brain && !generating && (
        <div className="px-5 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-5xl mb-3">🧠</p>
            <p className="font-bold text-gray-900 dark:text-white mb-1">No Brain Yet</p>
            <p className="text-sm text-gray-500">
              Tap "Regenerate Brain" above to analyze your company
            </p>
          </div>
        </div>
      )}

      {brain && (
        <>
          {/* Summary */}
          {brain.summary && (
            <div className="px-5 mt-4">
              <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
                📝 Company Summary
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {brain.summary}
                </p>
              </div>
            </div>
          )}

          {/* Strengths */}
          {brain.strengths?.length > 0 && (
            <div className="px-5 mt-5">
              <p className="text-[10px] font-bold tracking-wider uppercase text-green-600 mb-2">
                ✅ Strengths
              </p>
              <div className="space-y-2">
                {brain.strengths.map((s: string, i: number) => (
                  <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-3 border border-green-100 dark:border-green-900 flex items-start gap-2">
                    <span className="text-green-600 text-sm mt-0.5">✓</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {brain.weaknesses?.length > 0 && (
            <div className="px-5 mt-5">
              <p className="text-[10px] font-bold tracking-wider uppercase text-orange-600 mb-2">
                ⚠️ Areas to Improve
              </p>
              <div className="space-y-2">
                {brain.weaknesses.map((w: string, i: number) => (
                  <div key={i} className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-xl p-3 border border-orange-100 dark:border-orange-900 flex items-start gap-2">
                    <span className="text-orange-600 text-sm mt-0.5">!</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capacity */}
          {capacity && Object.keys(capacity).length > 0 && (
            <div className="px-5 mt-5">
              <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
                📊 Capacity
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Max Bid</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {capacity.max_bid_value || "—"}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Avg Project</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">
                    {capacity.avg_project || "—"}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Turnover</p>
                  <p className="text-lg font-bold text-orange-600 mt-1">
                    {capacity.turnover || "—"}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Regions</p>
                  <p className="text-xs font-bold text-purple-600 mt-2 leading-tight">
                    {(capacity.regions_active || []).join(", ") || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Certifications */}
          {certs.length > 0 && (
            <div className="px-5 mt-5">
              <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
                📜 Certifications
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                {certs.map(([name, val]: any, i) => (
                  <div key={i} className={`flex justify-between text-sm py-2 ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}>
                    <span className="text-gray-500">{name}</span>
                    <span className="font-bold text-gray-900 dark:text-white text-right ml-2">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sectors */}
          {brain.sectors?.length > 0 && (
            <div className="px-5 mt-5">
              <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
                🎯 Active Sectors
              </p>
              <div className="flex flex-wrap gap-2">
                {brain.sectors.map((s: string, i: number) => (
                  <span key={i} className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
