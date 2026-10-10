"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

const DOC_TYPES = [
  "GST Certificate",
  "PAN Card",
  "MSME/Udyam",
  "Company Registration",
  "EPF & ESIC",
  "ISO 9001 Certificate",
  "PSARA License",
  "Labour License",
  "Bank Certificate",
  "Experience Certificate",
  "Other",
];

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newDoc, setNewDoc] = useState({
    doc_type: DOC_TYPES[0],
    doc_number: "",
    expiry_date: "",
  });

  const loadDocs = async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleAdd = async () => {
    if (!newDoc.doc_type) return alert("Document type chuno");
    setSaving(true);

    const { error } = await supabase.from("documents").insert({
      type: newDoc.doc_type,
      file_url: newDoc.doc_number || "",
      expiry_date: newDoc.expiry_date || null,
      ai_extracted_json: null,
    });

    if (error) {
      alert("Save no hua: " + error.message);
    } else {
      setNewDoc({ doc_type: DOC_TYPES[0], doc_number: "", expiry_date: "" });
      setShowForm(false);
      loadDocs();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ye document delete karna hai?")) return;
    await supabase.from("documents").delete().eq("id", id);
    loadDocs();
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Document Vault</h1>
        <p className="text-xs text-gray-500 mt-1">{docs.length} documents saved</p>
      </div>

      <div className="p-5">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">
            Company Docs ({docs.length})
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap">
            Tender Docs
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap">
            Templates
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white p-5 rounded-2xl shadow-sm mb-4 border-2 border-blue-200">
            <h2 className="font-bold text-gray-900 mb-3 text-sm">📄 Add New Document</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600">Document Type</label>
                <select
                  value={newDoc.doc_type}
                  onChange={(e) => setNewDoc({ ...newDoc, doc_type: e.target.value })}
                  className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Document Number</label>
                <input
                  value={newDoc.doc_number}
                  onChange={(e) => setNewDoc({ ...newDoc, doc_number: e.target.value })}
                  placeholder="e.g. 27AABCS1234F1Z5"
                  className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={newDoc.expiry_date}
                  onChange={(e) => setNewDoc({ ...newDoc, expiry_date: e.target.value })}
                  className="w-full mt-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl text-sm disabled:bg-gray-400"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 text-sm py-8">Loading...</p>
        ) : docs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center">
            <p className="text-gray-500 text-sm mb-2">Abhi koi document no hai.</p>
            <p className="text-xs text-gray-400">Add company documents — they always come in handy.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map((d) => {
              const isExpiring = d.expiry_date
                ? new Date(d.expiry_date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
                : false;
              return (
                <div key={d.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center flex-1 mr-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3 text-lg">
                      📄
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{d.type}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {d.file_url || "No number"}
                        {d.expiry_date && ` · Exp: ${new Date(d.expiry_date).toLocaleDateString("en-IN")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {isExpiring ? (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                        ⚠ Expiring
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        ✓ Saved
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-xs text-red-500 mt-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-5 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg"
          >
            + Upload Document
          </button>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
