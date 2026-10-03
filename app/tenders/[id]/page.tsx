"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

function getDaysLeft(deadline: string | null) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function TenderDetail() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("tenders").select("*").eq("id", id).single();
      setTender(data);
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-gray-50 p-6"><p className="text-center text-gray-500 text-sm py-10">Loading...</p></main>;
  }

  if (!tender) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-center text-red-500 text-sm py-10">Tender nahi mila</p>
        <Link href="/tenders"><p className="text-center text-blue-600 text-sm">← Back</p></Link>
      </main>
    );
  }

  const daysLeft = getDaysLeft(tender.deadline);

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-600 text-white p-5">
        <Link href="/tenders" className="text-blue-200 text-sm">← Tenders</Link>
        <h1 className="text-lg font-bold mt-3 leading-tight">{tender.title}</h1>
        <p className="text-xs text-blue-200 mt-1">{tender.department || "Department N/A"}</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/10 p-2 rounded-xl text-center">
            <p className="text-xs text-blue-200">Value</p>
            <p className="font-bold text-sm mt-1">₹{tender.value_in_cr} Cr</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl text-center">
            <p className="text-xs text-blue-200">Country</p>
            <p className="font-bold text-sm mt-1">{tender.country || "India"}</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl text-center">
            <p className="text-xs text-blue-200">Days Left</p>
            <p className="font-bold text-sm mt-1">{daysLeft !== null && daysLeft > 0 ? daysLeft : "Expired"}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* AI Match Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900 text-sm">🤖 AI Match Score</h2>
            <span className="text-2xl font-bold text-blue-600">85%</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-green-600">✅ Experience requirement</p>
            <p className="text-green-600">✅ Service category</p>
            <p className="text-green-600">✅ Required location</p>
            <p className="text-orange-500">⚠️ Turnover — verify</p>
            <p className="text-red-500">❌ 1 document missing</p>
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            AI analysis based on uploaded company info. Final eligibility determined by tender authority.
          </p>
        </div>

        {/* Overview */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm mb-3">📄 Tender Overview</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Organization</span>
              <span className="text-gray-900 font-medium text-right">{tender.department || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Tender No.</span>
              <span className="text-gray-900 font-medium">{tender.tender_no || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Location</span>
              <span className="text-gray-900 font-medium">{tender.location || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Estimated Value</span>
              <span className="text-gray-900 font-medium">₹{tender.value_in_cr} Cr</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">EMD</span>
              <span className="text-gray-900 font-medium">₹{(tender.value_in_cr * 0.02).toFixed(2)} Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Deadline</span>
              <span className="text-gray-900 font-medium">
                {tender.deadline ? new Date(tender.deadline).toLocaleDateString("en-IN") : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Link href={`/eligibility/${tender.id}`}>
          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">
            🤖 View AI Eligibility
          </button>
        </Link>

        <Link href="/bids">
          <button className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg">
            🏆 Start Bid
          </button>
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
