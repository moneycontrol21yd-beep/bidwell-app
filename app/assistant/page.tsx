"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function Assistant() {
  const [messages, setMessages] = useState<any[]>([
    { role: "ai", text: "Hello! I'm your BidWell AI Assistant. Ask me anything about tenders, contracts, or payments." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((m) => [...m, { role: "ai", text: data.reply }]);
      } else {
        setMessages((m) => [...m, { role: "ai", text: "Sorry, something went wrong. Please try again." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Network issue. Please check your connection." }]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 flex flex-col">
      <div className="bg-white dark:bg-gray-900 px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl mr-3 shadow-lg shadow-blue-500/30">
          🤖
        </div>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">BidWell AI Assistant</h1>
          <p className="text-xs text-green-600 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span> Online
          </p>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20" : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce mr-1"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce mr-1" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="pt-4">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-2">Quick Questions</p>
            <div className="flex flex-wrap gap-2">
              {["How many active tenders?", "What is my receivable?", "Do I have PSARA license?"].map((q) => (
                <button key={q} onClick={() => setInput(q)} className="px-3 py-2 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="bg-transparent w-full outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button onClick={send} disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center ml-2 disabled:opacity-40">
            ↑
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
