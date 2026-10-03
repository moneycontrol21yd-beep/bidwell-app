"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function Assistant() {
  const [messages, setMessages] = useState<any[]>([
    { role: "ai", text: "Namaste! 🙏 Main aapka BidWell AI assistant hoon. Tender, contract, ya payment ke baare mein kuch bhi puchho." },
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
        setMessages((m) => [...m, { role: "ai", text: "Sorry, kuch gadbad ho gayi. Fir try karo." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Network issue hai. Check karo." }]);
    }
    setLoading(false);
  };

  const quickAsk = (q: string) => {
    setInput(q);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="bg-white p-5 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mr-3">🤖</div>
        <div>
          <h1 className="font-bold text-gray-900">BidWell AI Assistant</h1>
          <p className="text-xs text-green-600 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online</p>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-100"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-500">AI soch raha hai...</p>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="pt-4">
            <p className="text-xs text-gray-500 mb-2">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {["Kitne active tenders hain?", "Mera receivable kitna hai?", "PSARA license hai kya?"].map((q) => (
                <button key={q} onClick={() => quickAsk(q)} className="px-3 py-2 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-medium">{q}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="bg-gray-100 rounded-full px-4 py-3 flex items-center">
          <input type="text" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="bg-transparent w-full outline-none text-sm" />
          <button onClick={send} disabled={loading} className="bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center ml-2 disabled:bg-gray-400">↑</button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
