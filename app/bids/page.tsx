"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Bids() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("tenders")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      setTenders(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleWin = async (tenderId: string) => {
    setCreating(tenderId);
    try {
      const res = await fetch("/api/create-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tender_id: tenderId }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(tenderId);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err);
    }
    setCreating(null);
  };

  const steps = [
    { name: "Eligibility Check", status: "Completed", done: true },
    { name: "Document Preparation", status: "In Progress", done: false },
    { name: "Technical Response", status: "Pending", done: false },
    { name: "BOQ & Price Analysis", status: "Pending", done: false },
    { name: "Declarations & Forms", status: "Pending", done: false },
    { name: "Final Review", status: "Pending", done: false },
    { name: "Submit on Portal", status: "Pending", done: false },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-5 border-b border-gray-200">
        <Link href="/tenders" className="text-blue-600 text-sm">← Tenders</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-3">Bid Workspace</h1>
        <p className="text-xs text-gray-500 mt-1">Apne bids manage karo</p>
      </div>

      <div className="p-5 space-y-5">
        {loading ? (
          <p className="text-center text-gray-500 text-sm py-6">Loading...</p>
        ) : tenders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center">
            <p className="text-gray-500 text-sm">Koi active tender nahi hai.</p>
            <Link href="/upload">
              <button className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-sm">
                + Upload Tender
              </button>
            </Link>
          </div>
        ) : (
          tenders.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="font-bold text-gray-900 text-sm">{t.title}</p>
                <p className="text-xs text-gray-500 mt-1">{t.department}</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">₹{t.value_in_cr} Cr</p>
              </div>

              <div className="p-4 bg-blue-50">
                <p className="text-xs font-semibold text-blue-900 mb-2">Bid Progress: 14%</p>
                <div className="w-full bg-blue-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "14%" }}></div>
                </div>
              </div>

              <div className="p-4">
                {done === t.id ? (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-xl text-center">
                    <p className="text-green-700 font-semibold text-sm">✅ Contract ban gaya!</p>
                    <Link href="/contracts">
                      <p className="text-blue-600 text-xs mt-1 font-medium">Contracts dekho →</p>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => handleWin(t.id)}
                    disabled={creating === t.id}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-400"
                  >
                    {creating === t.id ? "Creating..." : "🏆 Mark as Won → Create Contract"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </main>
  );
}
