import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const LANG_NAMES: any = {
  en: "English", hi: "Hindi", mr: "Marathi", ta: "Tamil", te: "Telugu",
  kn: "Kannada", ml: "Malayalam", bn: "Bengali", gu: "Gujarati",
  pa: "Punjabi", or: "Odia", ur: "Urdu", as: "Assamese",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    const userLang = (formData.get("lang") as string) || "en";
    if (!file) return NextResponse.json({ error: "No PDF" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const keysString = process.env.GEMINI_API_KEYS || "";
    const apiKeys = keysString.split(",").map((k) => k.trim()).filter(Boolean);
    if (apiKeys.length === 0) return NextResponse.json({ error: "No API keys" }, { status: 500 });

    const targetLang = LANG_NAMES[userLang] || "English";

    const prompt = `You are BidWell, an AI tender analyst for Indian contractors.

STEP 1: Detect the ORIGINAL language of the attached tender PDF. It could be English, Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Malayalam, Odia, Punjabi, Urdu, or Assamese.

STEP 2: Analyze the tender and return output in **${targetLang}** language ONLY (translate everything).

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "detected_language": "<English name of tender's original language>",
  "title": "<title translated to ${targetLang}>",
  "department": "<department translated to ${targetLang}>",
  "tender_value_in_cr": <number>,
  "emd_in_lakh": <number>,
  "last_date": "YYYY-MM-DD",
  "eligibility": ["<eligibility points in ${targetLang}>"],
  "required_documents": ["<docs in ${targetLang}>"],
  "risk_clauses": ["<risks in ${targetLang}>"],
  "ai_summary": "<2-3 line summary in ${targetLang}>",
  "key_points": [
    { "label": "<label in ${targetLang}>", "value": "<value in ${targetLang}>", "status": "match"|"warning"|"missing" }
  ]
}

Include key_points for: Technical, Financial, Risk Level, Competition, Experience.`;

    let result: any = null;
    let lastError = "";
    for (const key of apiKeys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { data: base64Data, mimeType: "application/pdf" } }] }],
        });
        const text: string = response.text || "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        result = JSON.parse(cleaned);
        break;
      } catch (err: any) { lastError = err.message; continue; }
    }

    if (!result) return NextResponse.json({ success: false, error: lastError }, { status: 500 });
    return NextResponse.json({ success: true, analysis: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
