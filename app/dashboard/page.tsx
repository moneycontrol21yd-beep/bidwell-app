"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [company, setCompany] = useState<any>(null);
  const [tendersCount, setTendersCount] = useState(0);
  const [contractsCount, setContractsCount] = useState(0);
  const [receivable, setReceivable] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, t, ct] = await Promise.all([
          supabase.from("companies").select("*").limit(1).single(),
          supabase
            .from("tenders")
            .select("*", { count: "exact", head: true })
            .eq("status", "active"),
          supabase.from("contracts").select("value_in_cr"),
        ]);
        setCompany(c.data);
        setTendersCount(t.count || 0);
        const contractList = ct.data || [];
        setContractsCount(contractList.length);
        const total = contractList.reduce(
          (s: number, x: any) => s + (Number(x.value_in_cr) || 0),
          0
        );
        setReceivable(total);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  const userName = company?.contact_name || "Harsh Rai";
  const companyName = company?.name || "Shivam Security Services Pvt. Ltd.";

  const quickActions = [
    { href: "/live-tenders", icon: "📋", label: "Tenders", bg: "from-blue-500 to-indigo-600" },
    { href: "/bids", icon: "📝", label: "Bids", bg: "from-purple-500 to-fuchsia-600" },
    { href: "/contracts", icon: "📄", label: "Contracts", bg: "from-emerald-500 to-teal-600" },
    { href: "/contracts", icon: "👥", label: "Workforce", bg: "from-cyan-500 to-sky-600" },
    { href: "/payments", icon: "💰", label: "Payments", bg: "from-orange-500 to-amber-600" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* ========== HEADER ========== */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 pt-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-wider uppercase text-blue-100/70">
              Welcome Back
            </p>
            <h1 className="text-2xl font-bold mt-1">{userName}</h1>
            <p className="text-blue-100/70 text-xs mt-1">{companyName}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/notifications"
              className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20"
            >
              🔔
            </Link>
            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20"
            >
              👤
            </Link>
          </div>
        </div>

        <Link href="/search" className="block mt-5">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/20">
            <span className="text-white/80 text-lg">🔍</span>
            <span className="text-white/70 text-sm flex-1">
              Search anything...
            </span>
            <span className="text-white/80 text-lg">🎤</span>
          </div>
        </Link>
      </div>

      {/* ========== LIVE GOVERNMENT TENDERS ========== */}
      <div className="px-5 -mt-4">
        <Link href="/live-tenders">
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 rounded-2xl p-5 shadow-lg active:scale-[0.98] transition">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                📡
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base">
                  Live Government Tenders
                </p>
                <p className="text-white/80 text-xs mt-1">
                  NHAI, BHEL, CPPP — matched to your profile
                </p>
              </div>
              <span className="text-white text-xl">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ========== TENDER ANALYSIS ========== */}
      <div className="px-5 mt-4">
        <Link href="/upload">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-3 active:scale-[0.98] transition">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl">
              ✨
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white">
                BidWell Tender Analysis
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload PDF — AI analyzes in 15 seconds
              </p>
            </div>
            <span className="text-gray-400 text-lg">→</span>
          </div>
        </Link>
      </div>

      {/* ========== YOUR BUSINESS TODAY ========== */}
      <div className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">
          📈 Your Business Today
        </p>

        <div className="space-y-2">
          <Link href="/live-tenders">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-4 border border-green-100 dark:border-green-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg">
                ✨
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  New Matches
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {loading ? "Loading..." : `${tendersCount} active tenders`}
                </p>
              </div>
              <span className="text-green-600 text-lg">→</span>
            </div>
          </Link>

          <Link href="/documents">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-4 border border-blue-100 dark:border-blue-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg">
                ⚠️
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  Document Alert
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  1 document expiring soon
                </p>
              </div>
              <span className="text-blue-600 text-lg">→</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ========== STATS ========== */}
      <div className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-2xl font-bold text-blue-600">
              {loading ? "—" : tendersCount}
            </p>
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mt-1">
              Active
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-2xl font-bold text-green-600">
              {loading ? "—" : contractsCount}
            </p>
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mt-1">
              Contracts
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-2xl font-bold text-orange-600">
              ₹{loading ? "—" : receivable.toFixed(1)}Cr
            </p>
            <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mt-1">
              Receivable
            </p>
          </div>
        </div>
      </div>

      {/* ========== QUICK ACTIONS — 5 IN A ROW ========== */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
            ⚡ Quick Actions
          </p>
          <span className="text-[10px] text-gray-400 font-medium">
            Tender → Payment
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((a, i) => (
            <Link key={i} href={a.href}>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-2 border border-gray-100 dark:border-gray-800 shadow-sm active:scale-95 transition text-center">
                <div
                  className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${a.bg} flex items-center justify-center text-white text-lg mb-2`}
                >
                  {a.icon}
                </div>
                <p className="text-[9px] font-bold text-gray-900 dark:text-white leading-tight">
                  {a.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
