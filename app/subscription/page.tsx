"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const PLANS = [
  {
    id: "free", name: "Free", price: 0, period: "forever", popular: false,
    description: "Perfect for getting started",
    features: ["3 Tender Analyses / month", "10 Saved Tenders", "Basic Eligibility Check", "1 Company Profile", "Email Notifications"],
    color: "gray",
  },
  {
    id: "starter", name: "Starter", price: 499, period: "month", popular: false,
    description: "For small contractors",
    features: ["30 Tender Analyses / month", "100 Saved Tenders", "AI Eligibility Check", "Document Vault", "Deadline Alerts", "Company Profile"],
    color: "blue",
  },
  {
    id: "professional", name: "Professional", price: 1499, period: "month", popular: true,
    description: "For growing businesses",
    features: ["100 Tender Analyses / month", "Unlimited Saved Tenders", "Advanced AI Eligibility", "Bid Workspace", "Contract Tracking", "Invoice Tracking", "Payment Follow-up", "Corrigendum Alerts", "3 Team Members"],
    color: "purple",
  },
  {
    id: "business", name: "Business", price: 4999, period: "month", popular: false,
    description: "For large teams",
    features: ["500 AI Analyses / month", "Multiple Companies", "10 Team Members", "Advanced Contract Management", "Priority Support", "Custom Integrations"],
    color: "orange",
  },
];

export default function Subscription() {
  const [showContact, setShowContact] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-white dark:bg-gray-900 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/profile" className="text-blue-600 text-xs font-bold tracking-wide">← PROFILE</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">💳 Subscription</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose the plan that fits your business</p>
      </div>

      <div className="p-5">
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 p-4 rounded-2xl mb-5">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⭐</span>
            <div className="flex-1">
              <p className="text-xs font-bold tracking-wide uppercase">Current Plan</p>
              <p className="text-sm font-bold mt-0.5">Free Forever</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {PLANS.map((p) => (
            <div key={p.id} className={`bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm relative ${p.popular ? "border-2 border-purple-500" : "border border-gray-100 dark:border-gray-800"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider uppercase">MOST POPULAR</span>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{p.price.toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">/{p.period}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-start text-xs text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 font-bold mr-2">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {p.id === "free" ? (
                <button disabled className="w-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold py-3.5 rounded-xl text-sm tracking-wide cursor-not-allowed">
                  CURRENT PLAN
                </button>
              ) : (
                <button
                  onClick={() => setShowContact(true)}
                  className={`w-full font-bold py-3.5 rounded-xl text-sm tracking-wide text-white ${p.popular ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/20" : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20"}`}
                >
                  UPGRADE TO {p.name.toUpperCase()}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-4 rounded-2xl">
          <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold mb-2">💡 Annual Plans</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Save up to 20% with annual billing. Contact us for details.</p>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowContact(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Payment Coming Soon</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                BidWell Payments integration is being finalized. Our team will contact you shortly to activate your plan.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-2">Contact Us</p>
                <a href="mailto:billing@bidwell.app" className="text-xs text-blue-600 dark:text-blue-400 font-bold">billing@bidwell.app</a>
              </div>

              <button onClick={() => setShowContact(false)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">
                OK, GOT IT
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
