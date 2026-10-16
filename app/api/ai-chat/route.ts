import { NextResponse } from "next/server";

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", mr: "Marathi", gu: "Gujarati", bn: "Bengali",
  ta: "Tamil", te: "Telugu", kn: "Kannada", ml: "Malayalam", pa: "Punjabi",
  or: "Odia", as: "Assamese", ur: "Urdu",
};

export async function POST(request: Request) {
  try {
    const { message, language = "en" } = await request.json();
    if (!message) return NextResponse.json({ success: false }, { status: 400 });

    const langName = LANG_NAMES[language] || "English";
    const GROQ_KEY = process.env.GROQ_API_KEY;

    const systemPrompt = `You are BidWell AI Assistant for Indian government contractors.
Context:
- 5,038 active tenders (248 closing soon)
- Receivable: ₹1,92,50,000 (Overdue: ₹35,10,000)
- PSARA License valid till 31 Mar 2027
- ISO 9001:2015 valid till 30 Jun 2027
- Top competitors: EESSI, Ashim Ghosh, Sadhu Construction

CRITICAL: You MUST respond ONLY in ${langName}. Do NOT use English unless ${langName} is English.
Keep answers short (2-3 sentences). Use Indian number format (₹1,92,50,000).`;

    if (GROQ_KEY) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.3,
            max_tokens: 300,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content || "";
          if (text.trim()) return NextResponse.json({ success: true, response: text.trim() });
        }
      } catch (e) { console.error("Groq error:", e); }
    }

    return NextResponse.json({ success: true, response: null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
