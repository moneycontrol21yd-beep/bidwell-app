"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TechnicalResponse() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<any>({ company: "", experience: "", resources: "" });
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("tenders").select("*").eq("id", id).single();
      setTender(data);
      if (data?.technical_response) {
        try { setSections(JSON.parse(data.technical_response)); } catch {}
      }
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  const generateAI = async () => {
    setGenerating(true);
    try {
      const { data: company } = await supabase.from("companies").select("*").limit(1).maybeSingle();
      const { data: docs } = await supabase.from("documents").select("*");
      const res = await fetch("/api/generate-technical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tender, company, docs }),
      });
      const data = await res.json();
      if (data.success) setSections(data.sections);
      else alert("AI error: " + data.error);
    } catch (e: any) { alert("Error: " + e.message); }
    setGenerating(false);
  };

  const save = async () => {
    await supabase.from("tenders").update({ technical_response: JSON.stringify(sections) }).eq("id", id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"><p className="text-center text-gray-500 text-sm py-10">Loading...</p></main>;
  if (!tender) return <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"><p className="text-center text-red-500 text-sm py-10">Tender no mila</p></main>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/bids" className="text-blue-600 text-sm">← Bids</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">Technical Response</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tender.title}</p>
      </div>
      <div className="p-5 space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl">
          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-2">🤖 AI Draft Assistant</p>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">BidWell will draft a technical response from your company profile.</p>
          <button onClick={generateAI} disabled={generating} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm disabled:bg-gray-400">
            {generating ? "AI is writing..." : "✨ Generate with AI"}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3">1. Company Profile</h2>
          <textarea value={sections.company} onChange={(e) => setSections({ ...sections, company: e.target.value })} rows={5} placeholder="Aapki company ka introduction..." className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3">2. Experience Details</h2>
          <textarea value={sections.experience} onChange={(e) => setSections({ ...sections, experience: e.target.value })} rows={5} placeholder="Similar projects..." className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3">3. Team & Resources</h2>
          <textarea value={sections.resources} onChange={(e) => setSections({ ...sections, resources: e.target.value })} rows={5} placeholder="Team, equipment..." className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className={`flex-1 font-bold py-4 rounded-xl text-sm ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}>
            {saved ? "✅ Saved" : "Save Draft"}
          </button>
          <Link href={`/review/${id}`} className="flex-1">
            <button className="w-full bg-gray-800 dark:bg-gray-700 text-white font-bold py-4 rounded-xl text-sm">Next →</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
