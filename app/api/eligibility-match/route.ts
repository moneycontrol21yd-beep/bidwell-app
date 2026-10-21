import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { tender_id } = await req.json();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: tender } = await supabase
      .from("tenders")
      .select("*")
      .eq("id", tender_id)
      .single();

    const { data: docs } = await supabase.from("documents").select("*");
    const { data: company } = await supabase
      .from("companies")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!tender) {
      return NextResponse.json({ error: "Tender nahi mila" }, { status: 404 });
    }

    const docsList = (docs || [])
      .map((d: any) => `- ${d.type}: ${d.file_url || "N/A"}${d.expiry_date ? ` (Exp: ${d.expiry_date})` : ""}`)
      .join("\n");

    const companyInfo = company
      ? `
Name: ${company.name || ""}
Type: ${company.business_type || ""}
Turnover: ₹${company.turnover_cr || "N/A"} Cr
Experience: ${company.experience_years || "N/A"} years
GST: ${company.gst_number || "N/A"}
PAN: ${company.pan_number || "N/A"}
MSME: ${company.msme_number || "N/A"}
`
      : "Company info not provided";

    const prompt = `You are a tender eligibility analyst. Compare the company's profile and documents with the tender requirements.

COMPANY PROFILE:
${companyInfo}

COMPANY DOCUMENTS:
${docsList}

TENDER:
Title: ${tender.title}
Department: ${tender.department}
Value: ₹${tender.value_in_cr} Cr

Analyze eligibility for this type of tender. Return ONLY valid JSON with this exact structure (no markdown):
{
  "match_score": <number 0-100>,
  "verdict": "eligible" or "partial" or "not_eligible",
  "checks": [
    { "requirement": "<name>", "status": "match" or "warning" or "missing", "note": "<short reason>" }
  ],
  "summary": "<1-2 line summary in Hindi/Hinglish>"
}

Include 5-8 checks covering: Experience, Turnover, Licenses, GST, PAN, Required Documents, Technical capability, etc.`;

    const keysString = process.env.GEMINI_API_KEYS || "";
    const apiKeys = keysString.split(",").map((k) => k.trim()).filter(Boolean);

    let finalResult: any = null;
    let lastError = "";

    for (const key of apiKeys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const responseText: string = response.text || "";
        const cleaned = responseText.replace(/```json|```/g, "").trim();
        finalResult = JSON.parse(cleaned);
        break;
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    if (!finalResult) {
      return NextResponse.json(
        { success: false, error: "AI failed: " + lastError },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result: finalResult });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
