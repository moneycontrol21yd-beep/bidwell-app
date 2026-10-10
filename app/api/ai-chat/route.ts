import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: tenders } = await supabase.from("tenders").select("title, value_in_cr, status");
    const { data: contracts } = await supabase.from("contracts").select("title, value_in_cr");
    const { data: docs } = await supabase.from("documents").select("type");
    const { data: company } = await supabase.from("companies").select("*").limit(1).maybeSingle();

    const context = `Company: ${company?.name || "N/A"} (${company?.business_type || "N/A"})
Tenders: ${(tenders || []).map((t: any) => t.title).join("; ")}
Contracts: ${(contracts || []).map((c: any) => c.title).join("; ")}
Documents: ${(docs || []).map((d: any) => d.type).join(", ")}`;

    const prompt = `You are BidWell AI, a professional assistant for Indian contractors.

RULES:
- Reply in clear, professional ENGLISH only.
- Be concise (2-4 lines maximum).
- Use emojis sparingly.
- If you don't know something, say "I don't have that information."
- Never invent facts.

COMPANY DATA:
${context}

USER QUESTION: ${message}`;

    const keysString = process.env.GEMINI_API_KEYS || "";
    const apiKeys = keysString.split(",").map((k) => k.trim()).filter(Boolean);

    let reply = "";
    let lastError = "";

    for (const key of apiKeys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        reply = response.text || "";
        break;
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    if (!reply) return NextResponse.json({ success: false, error: lastError }, { status: 500 });
    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
