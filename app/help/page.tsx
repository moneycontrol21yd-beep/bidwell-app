"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const FAQS = [
  { q: "BidWell kya hai?", a: "BidWell ek AI-powered Contract Operating System hai jo contractors ko Tender dhundhne se lekar Payment milne tak madad karta hai. Find → Analyze → Bid → Contract → Invoice → Payment — sab ek jagah." },
  { q: "AI Eligibility Match kaise kaam karta hai?", a: "Aapke Company Profile aur uploaded Documents ko Tender requirements se compare karke AI match score deta hai — kaunsi requirement match ho rahi hai, kaunsi missing hai, sab clear dikhata hai." },
  { q: "Kitne documents upload kar sakte hain?", a: "Free plan me 10 documents, paid plans me unlimited. GST, PAN, Licenses, Experience Certificates — sab upload karo, AI automatically use karega." },
  { q: "Kya mera data safe hai?", a: "Haan, 100% safe. Aapka data sirf aapki company ko dikhta hai. Row-level security, encrypted storage, aur private documents ka full protection hai." },
  { q: "Tender automatically submit hota hai kya?", a: "Nahi. BidWell aapko bid prepare karne me madad karta hai, par final submission aap khud portal par karte hain. AI ko legal decision lene ka adhikar nahi." },
  { q: "Payment kitne din me milta hai?", a: "BidWell payment nahi deta — ye sirf aapke invoices track karta hai, reminders bhejta hai, aur overdue payments alert karta hai." },
  { q: "Kaunsa plan best hai?", a: "Chhote contractors ke liye Starter (₹499/month), growing businesses ke liye Professional (₹1,499/month) — ye sabse zyada use kiya jata hai." },
  { q: "Tender PDF kahan se milte hain?", a: "Government portals (GeM, eProcure), private tender sites, ya company emails se. Aapka har PDF BidWell AI analyze kar sakta hai." },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/profile" className="text-blue-600 text-sm">← Profile</Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">❓ Help & Support</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">FAQs aur contact options</p>
      </div>

      <div className="p-5 space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-4 flex items-center justify-between text-left">
              <p className="font-semibold text-gray-900 dark:text-white text-sm flex-1 pr-3">{f.q}</p>
              <span className="text-gray-400 text-lg">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{f.a}</p>
              </div>
            )}
          </div>
        ))}

        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl mt-4">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3">📞 Contact Support</h2>
          <div className="space-y-2">
            <a href="mailto:support@bidwell.app" className="block text-xs text-blue-600 font-semibold">📧 support@bidwell.app</a>
            <p className="text-xs text-gray-600 dark:text-gray-400">🕐 Response time: 24 hours</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">🇮🇳 Available in English & Hindi</p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl">
          <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold mb-1">💡 Tip</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Pehle Company Profile complete karo — AI zyada accurate results dega.</p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
