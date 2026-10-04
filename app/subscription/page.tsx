"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const PLANS = [
  { id: "free", name: "Free", price: 0, period: "forever", color: "gray", features: ["3 Tender Analysis/month", "10 Saved Tenders", "Basic Eligibility", "1 Company"], popular: false },
  { id: "starter", name: "Starter", price: 499, period: "month", color: "blue", features: ["30 Tender Analyses", "100 Saved Tenders", "AI Eligibility", "Document Vault", "Deadline Alerts"], popular: false },
  { id: "professional", name: "Professional", price: 1499, period: "month", color: "purple", features: ["100 Tender Analyses", "Unlimited Saved Tenders", "Advanced Eligibility", "Bid Workspace", "Contract Tracking", "Invoice Tracking", "Payment Follow-up", "Corrigendum Alerts", "3 Team Members"], popular: true },
  { id: "business", name: "Business", price: 4999, period: "month", color: "orange", features: ["500 AI analyses", "Multiple companies", "10 team members", "Advanced contract mgmt", "Priority support"], popular: false },
];

export default function Subscription() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/profile" className="text-blue-600 text-sm">← Profile</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">💳 Subscription</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Apna plan chuno</p>
      </div>

      <div className="p-5">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-2xl mb-5">
          <p className="text-xs text-yellow-900 dark:text-yellow-400 font-semibold">⭐ Current Plan: Free</p>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Upgrade karke saare features unlock karo</p>
        </div>

        <div className="space-y-4">
          {PLANS.map((p) => (
            <div key={p.id} className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm relative ${p.popular ? "border-2 border-purple-500" : "border border-gray-200 dark:border-gray-700"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-bold">MOST POPULAR</span>
              )}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Perfect for {p.id === "free" ? "beginners" : p.id === "starter" ? "small contractors" : p.id === "professional" ? "growing businesses" : "large teams"}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{p.price.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/{p.period}</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                {p.features.map((f, i) => (
                  <p key={i} className="text-xs text-gray-700 dark:text-gray-300">✅ {f}</p>
                ))}
              </div>
              <button
                disabled={p.id === "free"}
                className={`w-full font-bold py-3 rounded-xl text-sm ${p.id === "free" ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400" : p.popular ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}`}
              >
                {p.id === "free" ? "Current Plan" : `Upgrade to ${p.name}`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl">
          <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold mb-2">🎁 Annual Plan</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Yearly payment par 15-20% discount milta hai. Beta phase ke baad available hoga.</p>
        </div>

        <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
          <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold mb-2">🔐 Payment Options</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">UPI · Cards · Net Banking (India) | Cards (International)</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">Payment gateway integration coming soon — Razorpay for India, Stripe for International.</p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
