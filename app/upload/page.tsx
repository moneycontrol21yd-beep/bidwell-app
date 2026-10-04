"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SparklesIcon, FileTextIcon } from "@/components/icons";
import { useLang } from "@/lib/language";

export default function UploadTender() {
  const router = useRouter();
  const { lang, t, currentLanguage } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("PDF select karo");
    setLoading(true); setResult(null);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("lang", lang);
    try {
      const res = await fetch("/api/analyze-tender", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setResult(data.analysis);
      else alert("Error: " + data.error);
    } catch (e: any) { alert("Error: " + e.message); }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    const res = await fetch("/api/save-tender", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: result.title, department: result.department,
        value_in_cr: result.tender_value_in_cr, deadline: result.last_date,
        ai_summary: result.ai_summary, ai_key_points: result.key_points,
      }),
    });
    const data = await res.json();
    if (data.success) router.push("/tenders");
    else alert("Save fail: " + data.error);
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="text-blue-600 text-xs font-bold tracking-wide">← {t("dashboard").toUpperCase()}</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">{t("uploadTender")}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Analysis language: {currentLanguage?.name}</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <FileTextIcon size={28} className="text-white" />
          </div>
          <label className="block text-center cursor-pointer">
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            <span className="block bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-6 px-4 text-sm text-gray-600 dark:text-gray-400 font-medium break-all">
              {file ? `✓ ${file.name}` : t("selectPdf")}
            </span>
          </label>
        </div>

        {file && !result && !loading && (
          <button onClick={handleUpload} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 text-sm tracking-wide flex items-center justify-center">
            <SparklesIcon size={16} className="mr-2" />
            {t("analyzeBtn")}
          </button>
        )}

        {loading && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <SparklesIcon size={28} className="text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{t("analyzing")}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("pleaseWait")}</p>
          </div>
        )}

        {result && (
          <>
            {result.detected_language && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 rounded-2xl">
                <p className="text-[10px] text-blue-900 dark:text-blue-300 font-bold tracking-wider uppercase mb-1">{t("detectedLang")}</p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{result.detected_language} → {currentLanguage?.name}</p>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-3">{t("analysisComplete")}</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{result.title || "Untitled"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.department || "N/A"}</p>
              {result.ai_summary && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-xs text-gray-700 dark:text-gray-300">{result.ai_summary}</p>
                </div>
              )}
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/20 text-sm tracking-wide">
              {saving ? t("saving") : t("saveTenders")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
