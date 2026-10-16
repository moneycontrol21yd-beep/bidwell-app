"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";

const LANGUAGES = [
  { code: "en", name: "English" }, { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" }, { code: "gu", name: "Gujarati" },
  { code: "bn", name: "Bengali" }, { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" }, { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" }, { code: "pa", name: "Punjabi" },
  { code: "or", name: "Odia" }, { code: "as", name: "Assamese" },
  { code: "ur", name: "Urdu" },
];

const C = { bg: "#060B28", card: "#0E1533", text: "#fff", muted: "#64748B" };
const LINK: React.CSSProperties = { textDecoration: "none", color: "#fff" };

interface Message { id: number; role: "user" | "ai"; text: string; time: string; }

const WELCOMES: Record<string, string> = {
  en: "Hello! I'm your BidWell AI Assistant. Ask me anything.",
  hi: "नमस्ते! मैं आपका BidWell AI असिस्टेंट हूँ। कुछ भी पूछें।",
  mr: "नमस्कार! मी तुमचा BidWell AI असिस्टंट आहे. काहीही विचारा.",
  gu: "નમસ્તે! હું તમારો BidWell AI સહાયક છું.",
  bn: "নমস্কার! আমি আপনার BidWell AI সহকারী।",
  ta: "வணக்கம்! நான் உங்கள் BidWell AI உதவியாளர்.",
  te: "నమస్కారం! నేను మీ BidWell AI సహాయకుడిని.",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ BidWell AI ಸಹಾಯಕ.",
  ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ BidWell AI അസിസ്റ്റന്റ്.",
  pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ BidWell AI ਸਹਾਇਕ ਹਾਂ।",
  or: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ BidWell AI ସହାୟକ।",
  as: "নমস্কাৰ! মই আপোনাৰ BidWell AI সহায়ক।",
  ur: "السلام علیکم! میں آپ کا BidWell AI اسسٹنٹ ہوں۔",
};

const PLACEHOLDERS: Record<string, string> = {
  en: "Ask anything about your business...",
  hi: "कुछ भी पूछें...", mr: "काहीही विचारा...", gu: "કંઈપણ પૂછો...",
  bn: "যেকোনো কিছু জিজ্ঞাসা করুন...", ta: "எதையும் கேளுங்கள்...",
  te: "ఏదైనా అడగండి...", kn: "ಏನನ್ನಾದರೂ ಕೇಳಿ...",
  ml: "എന്തും ചോദിക്കാം...", pa: "ਕੁਝ ਵੀ ਪੁੱਛੋ...",
  or: "କିଛି ପଚାରନ୍ତୁ...", as: "কিবা সোধক...", ur: "کچھ بھی پوچھیں...",
};

const QUICK_Q: Record<string, string[]> = {
  en: ["How many active tenders?", "What is my receivable?", "Do I have PSARA license?"],
  hi: ["कितने सक्रिय टेंडर हैं?", "मेरा रिसीवेबल क्या है?", "क्या मेरे पास PSARA लाइसेंस है?"],
  mr: ["किती सक्रिय टेंडर आहेत?", "माझे येणे किती आहे?", "माझ्याकडे PSARA परवाना आहे का?"],
  gu: ["કેટલા સક્રિય ટેન્ડર છે?", "મારું લેણું કેટલું છે?", "શું મારી પાસે PSARA છે?"],
  bn: ["কত সক্রিয় টেন্ডার?", "আমার প্রাপ্য কত?", "PSARA আছে কি?"],
  ta: ["எத்தனை டெண்டர்கள்?", "என் பெறத்தக்கது?", "PSARA உள்ளதா?"],
  te: ["ఎన్ని టెండర్లు?", "నా రాబడి?", "PSARA ఉందా?"],
  kn: ["ಎಷ್ಟು ಟೆಂಡರ್?", "ನನ್ನ ಸ್ವೀಕೃತಿ?", "PSARA ಇದೆಯೇ?"],
  ml: ["എത്ര ടെൻഡർ?", "എന്റെ സ്വീകാര്യത?", "PSARA ഉണ്ടോ?"],
  pa: ["ਕਿੰਨੇ ਟੈਂਡਰ?", "ਮੇਰੀ ਪ੍ਰਾਪਤੀ?", "PSARA ਹੈ?"],
  or: ["କେତେ ଟେଣ୍ଡର?", "ମୋର ପ୍ରାପ୍ୟ?", "PSARA ଅଛି?"],
  as: ["কিমান টেণ্ডাৰ?", "মোৰ লাভৰাশি?", "PSARA আছে?"],
  ur: ["کتنے ٹینڈر؟", "میری وصولی؟", "PSARA ہے؟"],
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll localStorage every 300ms — bulletproof
  useEffect(() => {
    const check = () => {
      const fresh = (typeof window !== "undefined" ? localStorage.getItem("language") : null) || "en";
      if (fresh !== lang) {
        setLang(fresh);
        setMessages([{ id: Date.now(), role: "ai", text: WELCOMES[fresh] || WELCOMES.en, time: "now" }]);
      }
    };
    check();
    const interval = setInterval(check, 300);
    return () => clearInterval(interval);
  }, [lang]);

  // First welcome
  useEffect(() => {
    if (messages.length === 0) {
      const fresh = (typeof window !== "undefined" ? localStorage.getItem("language") : null) || "en";
      setLang(fresh);
      setMessages([{ id: 1, role: "ai", text: WELCOMES[fresh] || WELCOMES.en, time: "now" }]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: q, time: "now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const fresh = (typeof window !== "undefined" ? localStorage.getItem("language") : null) || "en";

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, language: fresh }),
      });
      const data = await res.json();
      const aiText = data.response || "I can help you with tenders, contracts, payments.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "ai", text: aiText, time: "now" }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 2, role: "ai", text: "Sorry, connection issue. Please try again.", time: "now" }]);
    } finally {
      setLoading(false);
    }
  };

  const qq = QUICK_Q[lang] || QUICK_Q.en;
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(6,11,40,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid rgba(99,102,241,0.15)`, padding: "14px 18px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{ ...LINK, fontSize: 20, opacity: 0.9 }}>←</Link>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: "linear-gradient(135deg,#6366F1,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900 }}>BidWell AI</div>
            <div style={{ fontSize: 10.5, color: "#10B981", marginTop: 3, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              Online · {currentLang?.name}
            </div>
          </div>
          <Link href="/settings/language" style={LINK}>
            <div style={{ padding: "6px 10px", borderRadius: 10, background: C.card, border: `1px solid rgba(99,102,241,0.25)`, color: "#A5B4FC", fontSize: 10.5, fontWeight: 800 }}>
              🌐 {currentLang?.code.toUpperCase()}
            </div>
          </Link>
        </div>
      </div>

      <div style={{ flex: 1, padding: "18px 18px 0", overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 14 }}>
            {m.role === "ai" && (
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
            )}
            <div style={{ maxWidth: "78%", padding: "12px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? "linear-gradient(135deg,#4338CA,#6366F1)" : C.card, border: m.role === "user" ? "none" : `1px solid rgba(99,102,241,0.25)`, fontSize: 13, lineHeight: 1.5, color: "#fff" }}>
              {m.text}
              <div style={{ fontSize: 9.5, color: m.role === "user" ? "rgba(255,255,255,0.7)" : C.muted, marginTop: 6, fontWeight: 600 }}>{m.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🤖</div>
            <div style={{ padding: "12px 16px", background: C.card, borderRadius: "16px 16px 16px 4px", border: `1px solid rgba(99,102,241,0.25)`, display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", animation: `bounce 1.4s ${i * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 2 && (
        <div style={{ padding: "0 18px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>Quick Questions</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
            {qq.map((q) => (
              <button key={q} onClick={() => ask(q)} style={{ flexShrink: 0, padding: "9px 14px", borderRadius: 20, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.35)", color: "#A5B4FC", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{q}</button>
            ))}
          </div>
        </div>
      )}

      <AppNav active="home" />

      <style>{`@keyframes bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }`}</style>
    </div>
  );
}
