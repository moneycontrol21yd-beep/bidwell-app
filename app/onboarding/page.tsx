"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const slides = [
  {
    icon: "🔍",
    title: "Discover Relevant Tenders",
    desc: "From multiple trusted sources — find tenders matching your business profile.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Analysis",
    desc: "Know eligibility & risks with AI insights before you bid.",
  },
  {
    icon: "🏢",
    title: "End-to-End Management",
    desc: "From bid to payment — manage everything in one place.",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else router.push("/login");
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="bg-blue-900 p-2 rounded-xl mr-2">
            <span className="text-xl font-bold text-white">B</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">BidWell</p>
            <p className="text-xs text-gray-500">From Tender to Payment</p>
          </div>
        </div>
        <button onClick={() => router.push("/login")} className="text-blue-600 text-sm font-semibold">
          Skip
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
        Your AI Partner for<br />Contracts & Business Growth
      </h1>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-3 mb-10">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`flex items-start p-4 rounded-2xl transition-all ${
                i === index ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50 border-2 border-transparent"
              }`}
            >
              <div className="text-3xl mr-3">{s.icon}</div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${i === index ? "text-blue-900" : "text-gray-700"}`}>
                  {s.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "bg-blue-600 w-8" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={next}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg"
        >
          {index === slides.length - 1 ? "Get Started →" : "Next →"}
        </button>
        <Link href="/login">
          <p className="text-center text-gray-500 text-sm">
            Already have an account? <span className="text-blue-600 font-bold">Login</span>
          </p>
        </Link>
      </div>
    </main>
  );
}
