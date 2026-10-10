"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function getDaysLeft(deadline: string | null) {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data } = await supabase.from("tenders").select("*").eq("id", id).single();
      setTender(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const runAI = async () => {
    if (!tender) return;
    setAiLoading(true);
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
      setAiResult(data);
    } catch (e) {
      setAiResult({ error: "AI analysis failed" });
    }
    setAiLoading(false);
  };

  const startBid = async () => {
    if (!tender) return;
    try {
      await supabase.from("tenders").update({ bid_stage: "draft" }).eq("id", tender.id);
      router.push("/bids");
    } catch (e) {
      alert("Could not start bid. Try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <p className="text-center text-gray-500 text-sm pt-10">Loading...</p>
      </main>
    );
  }

  if (!tender) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <p className="text-center text-red-500 text-sm pt-10">Tender not found</p>
      </main>
    );
  }

  const daysLeft = getDaysLeft(tender.deadline);
  const eligibility = aiResult?.eligibility || "85%";
  const emd = tender.emd_amount || "As per tender";
  const risk = tender.risk_level || "Medium";
  const goNoGo = aiResult?.decision || "GO";

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "eligibility", label: "Eligibility" },
    { key: "documents", label: "Documents" },
    { key: "source", label: "Source" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-5 pt-5 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <Link href="/tenders" className="text-blue-100/80 text-xs font-bold tracking-wide">
            ← TENDERS
          </Link>
          <h1 className="text-lg font-bold mt-3 leading-tight">{tender.title}</h1>
          <p className="text-blue-100/70 text-xs mt-2">{tender.department || "N/A"}</p>
          <p className="text-blue-100/70 text-xs mt-1">Tender No: {tender.tender_no || "N/A"}</p>

          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 text-center">
              <p className="text-[9px] text-blue-100/70 font-bold tracking-wider uppercase">Value</p>
              <p className="font-bold text-xs mt-1">₹{tender.value_in_cr || 0} Cr</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 text-center">
              <p className="text-[9px] text-blue-100/70 font-bold tracking-wider uppercase">EMD</p>
              <p className="font-bold text-xs mt-1">{typeof emd === "number" ? `₹${emd}L` : "See docs"}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 text-center">
              <p className="text-[9px] text-blue-100/70 font-bold tracking-wider uppercase">Deadline</p>
              <p className="font-bold text-xs mt-1">{daysLeft && daysLeft > 0 ? `${daysLeft}d` : "Exp"}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 text-center">
              <p className="text-[9px] text-blue-100/70 font-bold tracking-wider uppercase">State</p>
              <p className="font-bold text-xs mt-1">{tender.state || "India"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-3">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-bold text-sm">🤖 BidWell AI Analysis</p>
            <button
              onClick={runAI}
              disabled={aiLoading}
              className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full"
            >
              {aiLoading ? "Analyzing..." : "Run AI"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Eligibility</p>
              <p className="text-white font-bold text-sm mt-0.5">✅ {eligibility}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Payment Risk</p>
              <p className="text-white font-bold text-sm mt-0.5">⚠️ {risk}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">EMD</p>
              <p className="text-white font-bold text-sm mt-0.5">💰 See docs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Decision</p>
              <p className="text-white font-bold text-sm mt-0.5">🎯 {goNoGo}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition ${
                tab === t.key
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">
                📄 Full Tender Description
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {tender.full_description || tender.title}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">
                🏢 Department Analysis
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Department</span>
                  <span className="font-bold text-gray-900 dark:text-white text-right ml-2">
                    {tender.department || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Organisation</span>
                  <span className="font-bold text-gray-900 dark:text-white text-right ml-2">
                    {tender.organisation || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="font-bold text-gray-900 dark:text-white text-right ml-2">
                    {tender.location || tender.city || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Terms</span>
                  <span className="font-bold text-gray-900 dark:text-white text-right ml-2">
                    {tender.payment_terms || "As per contract"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "eligibility" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">
              ✅ Eligibility Criteria
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {tender.eligibility_criteria ||
                "Eligibility details are in the tender document. Run AI analysis for details."}
            </p>
            <button
              onClick={runAI}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm"
            >
              {aiLoading ? "Analyzing..." : "🤖 Run AI Eligibility Check"}
            </button>
          </div>
        )}

        {tab === "documents" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">
              📎 Documents Required
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {tender.documents_required || "Document list is in the tender document."}
            </p>
          </div>
        )}

        {tab === "source" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">
              🔗 Original Tender Source
            </p>
            {tender.source_url ? (
              <a
                href={tender.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-sm p-3 rounded-xl text-center"
              >
                Open Original Tender →
              </a>
            ) : (
              <p className="text-sm text-gray-500">Source URL not available.</p>
            )}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Source</span>
                <span className="font-bold">{tender.source || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tender No</span>
                <span className="font-bold text-right ml-2">{tender.tender_no || "N/A"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 mt-4">
        <button
          type="button"
          onClick={startBid}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-2xl text-sm shadow-lg active:scale-95 transition"
        >
          🎯 Start Bid Preparation
        </button>
      </div>
    </main>
  );
}
