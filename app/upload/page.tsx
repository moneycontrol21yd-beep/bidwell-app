"use client";
import { useState } from "react";
import Link from "next/link";

export default function UploadTender() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Pehle PDF select karo!");
    setLoading(true);
    setResult(null);
    setSaved(false);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/analyze-tender", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error aa gaya: " + err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result?.analysis) return;
    setSaving(true);

    const a = result.analysis;
    try {
      const res = await fetch("/api/save-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: a.title,
          department: a.department,
          value_in_cr: a.tender_value_in_cr,
          deadline: a.last_date,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      } else {
        alert("Save nahi hua: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err);
    }
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <Link href="/dashboard" className="text-blue-600 text-sm">← Back</Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">Upload Tender</h1>
      <p className="text-gray-500 text-sm mb-6">PDF upload karo, AI analysis karega</p>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
        {file && <p className="text-xs text-gray-500 mt-2">Selected: {file.name}</p>}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-400"
        >
          {loading ? "AI Padh raha hai..." : "Analyze with AI"}
        </button>
      </div>

      {result?.analysis && (
        <div className="mt-6 bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">AI Analysis Result</h2>
          <div className="text-sm space-y-2">
            <p><b>Title:</b> {result.analysis.title || "N/A"}</p>
            <p><b>Department:</b> {result.analysis.department || "N/A"}</p>
            <p><b>Value:</b> ₹{result.analysis.tender_value_in_cr || 0} Cr</p>
            <p><b>EMD:</b> ₹{result.analysis.emd_in_lakh || 0} Lakh</p>
            <p><b>Last Date:</b> {result.analysis.last_date || "N/A"}</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`w-full mt-4 font-bold py-3 rounded-xl ${
              saved ? "bg-green-600 text-white" : "bg-blue-600 text-white disabled:bg-gray-400"
            }`}
          >
            {saved ? "✅ Saved to Database" : saving ? "Saving..." : "Save to Database"}
          </button>

          {saved && (
            <Link href="/dashboard">
              <p className="text-center text-blue-600 text-sm mt-3 font-medium">Dashboard par dekho →</p>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
