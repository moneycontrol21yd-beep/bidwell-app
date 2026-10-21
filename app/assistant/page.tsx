"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", sub: "#94A3B8", muted: "#64748B", purple: "#6366F1" };

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "ai", content: "Namaste! Main BidWell AI hoon. Aap mujhse kisi bhi tender, department ya contractor ke baare me pooch sakte hain. Jaise: 'UP me road ke tenders batao' ya 'PWD me kaun jeeta hai?'" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Sorry, main abhi connect nahi ho pa raha. Please try again." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Network error occurred." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: C.text, fontFamily: "system-ui, sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ padding: "20px 18px", background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/dashboard" style={{ color: "#C7D2FE", textDecoration: "none", fontSize: 18 }}>←</Link>
        <div style={{ fontSize: 18, fontWeight: 900 }}>BidWell AI Assistant</div>
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, padding: "20px 18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ 
              maxWidth: "85%", 
              padding: "12px 16px", 
              borderRadius: msg.role === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
              background: msg.role === "user" ? "linear-gradient(135deg,#6366F1,#A855F7)" : C.card,
              border: msg.role === "ai" ? "1px solid rgba(99,102,241,0.2)" : "none",
              fontSize: 14, lineHeight: 1.5
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 0", background: C.card, color: C.muted, fontSize: 13, border: "1px solid rgba(99,102,241,0.2)" }}>
              AI is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div style={{ padding: "16px 18px", background: "#0A0E27", borderTop: "1px solid rgba(99,102,241,0.2)" }}>
        <div style={{ display: "flex", gap: 10, background: C.card, padding: 8, borderRadius: 16, border: "1px solid rgba(99,102,241,0.3)" }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything about tenders..."
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", outline: "none", padding: "8px 10px", fontSize: 14 }}
          />
          <button 
            onClick={sendMessage}
            disabled={loading}
            style={{ background: "linear-gradient(135deg,#6366F1,#A855F7)", border: "none", borderRadius: 10, padding: "10px 16px", color: "#fff", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}
