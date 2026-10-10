"use client";
import { useState } from "react";
import Link from "next/link";

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does AI Eligibility Match work?",
      a: "AI compares your Company Profile and uploaded Documents against tender requirements to give a match score — showing what matches and what is missing.",
    },
    {
      q: "How many documents can I upload?",
      a: "Free plan: 10 documents. Paid plans: unlimited. GST, PAN, Licenses, Experience Certificates — upload all, AI uses them automatically.",
    },
    {
      q: "Does BidWell auto-submit tenders?",
      a: "No. BidWell helps you prepare your bid, but final submission is done by you on the portal. AI is not authorized to make legal decisions.",
    },
    {
      q: "How accurate is the tender data?",
      a: "Data is fetched from official government portals (CPPP, GeM, State portals) multiple times daily. Always verify critical details on the original source.",
    },
    {
      q: "Can I use BidWell for multiple companies?",
      a: "Yes. Business plan supports multiple companies with separate profiles, documents, and team members.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. We use bank-grade encryption, multi-tenant isolation, and Row Level Security. Your data is never shared with other users.",
    },
    {
      q: "How do I cancel my subscription?",
      a: "Go to Settings → Subscription → Cancel. Your access continues until the end of the billing cycle.",
    },
    {
      q: "What payment methods are accepted?",
      a: "UPI, Credit/Debit Cards, Net Banking. Powered by Razorpay.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 pt-5 pb-6">
        <Link href="/profile" className="text-blue-100/80 text-xs font-bold tracking-wide">← BACK</Link>
        <h1 className="text-2xl font-bold mt-2">Help & Support</h1>
        <p className="text-blue-100/70 text-xs mt-1">Answers to common questions</p>
      </div>

      <div className="px-5 mt-5">
        <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">Frequently Asked Questions</p>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left p-4 flex items-start justify-between gap-3"
              >
                <span className="font-bold text-sm text-gray-900 dark:text-white flex-1">
                  {faq.q}
                </span>
                <span className="text-blue-600 text-xl leading-none">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6">
        <p className="text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-3">Still Need Help?</p>

        <a
          href="mailto:support@bidwell.in"
          className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Email Support</p>
              <p className="text-xs text-gray-500">support@bidwell.in</p>
            </div>
          </div>
        </a>

        <a
          href="https://wa.me/917770873817"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mt-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">WhatsApp Support</p>
              <p className="text-xs text-gray-500">+91 77708 73817</p>
            </div>
          </div>
        </a>
      </div>

      <div className="px-5 mt-6 text-center">
        <p className="text-[10px] text-gray-400 tracking-wider uppercase">
          BidWell v1.0 · Made in India 🇮🇳
        </p>
      </div>
    </main>
  );
}
