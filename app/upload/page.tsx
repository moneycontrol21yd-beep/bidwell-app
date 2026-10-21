"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SparklesIcon, FileTextIcon } from "@/components/icons";
import { useLang } from "@/lib/language";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export default function UploadTender() {
  const router = useRouter();
  const { lang, t, currentLanguage } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (f: File | null) => {
    setError("");
    if (!f) return setFile(null);
    if (f.type !== "application/pdf") {
      setError("Sirf PDF file allowed hai");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError(`PDF 50MB se choti honi chahiye. Aapki file ${(f.size / 1024 / 1024).toFixed(1)}MB hai.`);
      return;
    }
    if (f.size < 1024) {
      setError("File bahut choti hai");
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setResult(null); setError("");
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("lang", lang);
    try {
      const res = await fetch("/api/analyze-tender", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setResult(data.analysis);
      else setError("AI error: " + (data.error || "Unknown"));
    } catch (e: any) { setError("Error: " + e.message); }
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
        value_in_cr: typeof result.tender_value_in_cr === "number" ? result.tender_value_in_cr : 0,
        deadline: result.last_date !== "not_found" ? result.last_date : null,
        ai_summary: result.ai_summary,
        ai_key_points: result.key_points,
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{currentLanguage?.name} me analysis milega</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <FileTextIcon size={28} className="text-white" />
          </div>
          <label className="block text-center cursor-pointer">
            <input type="file" accept="application/pdf" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} className="hidden" />
            <span className="block bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-6 px-4 text-sm text-gray-600 dark:text-gray-400 font-medium break-all">
              {file ? `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : "Tap to select PDF (max 50MB)"}
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-2xl">
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {file && !result && !loading && (
          <button onClick={handleUpload} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 text-sm tracking-wide flex items-center justify-center">
            <SparklesIcon size={16} className="mr-2" />
            {t("analyzeBtn")}
          </button>
        )}

        {loading && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon size={28} className="text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{t("analyzing")}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10-20 seconds</p>
          </div>
        )}

        {result && (
          <>
            {result.detected_language && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl">
                <p className="text-[10px] text-blue-900 dark:text-blue-300 font-bold tracking-wider uppercase mb-1">Tender Language Detected</p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{result.detected_language} → {currentLanguage?.name}</p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-3">Analysis Complete</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{result.title || "Untitled"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.department || "N/A"}</p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase">Value</p>
                  <p className="font-bold text-blue-600 text-sm mt-1">
                    {typeof result.tender_value_in_cr === "number" ? `₹${result.tender_value_in_cr} Cr` : "Not found"}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase">EMD</p>
                  <p className="font-bold text-orange-600 text-sm mt-1">
                    {typeof result.emd_in_lakh === "number" ? `₹${result.emd_in_lakh} L` : "Not found"}
                  </p>
                </div>
              </div>

              {result.ai_summary && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-xs text-gray-700 dark:text-gray-300">{result.ai_summary}</p>
                </div>
              )}

              {result.key_points && result.key_points.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Points</p>
                  <div className="space-y-2">
                    {result.key_points.slice(0, 5).map((kp: any, i: number) => (
                      <div key={i} className="flex items-center bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg">
                        <span className="text-xs mr-2">{kp.status === "match" ? "✅" : kp.status === "warning" ? "⚠️" : "❌"}</span>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white flex-1">{kp.label}</p>
                        {kp.page && <span className="text-[10px] text-blue-600 font-bold">Page {kp.page}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-4 rounded-2xl">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                ⚠️ Verify AI analysis with original tender. Final decision rests with tender authority.
              </p>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-green-600 to-emyld-600 text-white font-bold py-4 rounded-2xl shadow-lg text-sm tracking-wide">
              {saving ? "SAVING..." : "✓ SAVE TO MY TENDERS"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
