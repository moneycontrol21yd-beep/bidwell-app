import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    if (!file) return NextResponse.json({ error: "No PDF" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const keysString = process.env.GEMINI_API_KEYS || "";
    const apiKeys = keysString.split(",").map((k) => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
cd ~/bidwell
nano app/api/analyze-tender/route.ts      return NextResponse.json({ error: "No API keys found" }, { status: 500 });
    }

    const prompt = `You are a tender analyst. Read the attached PDF document and extract the following information as a valid JSON object. 
    Fields to extract:
    - title (string)
    - department (string)
    - tender_value_in_cr (number)
    - emd_in_lakh (number)
    - last_date (YYYY-MM-DD)
    - eligibility (array of strings)
    - required_documents (array of strings)
    - key_dates (object)
    - risk_clauses (array of strings)
    Return ONLY valid JSON, no markdown, no explanation. If a field is not found, use null.`;

    let finalResult: any = null;
    let lastError = "";

    for (const key of apiKeys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        
        // Naya SDK aur naya model use kar rahe hain
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inlineData: { data: base64Data, mimeType: "application/pdf" } }
              ]
            }
          ]
        });

        const responseText = response.text;
        const cleaned = responseText.replace(/```json|```/g, "").trim();
        finalResult = JSON.parse(cleaned);
        break; 
      } catch (err: any) {
        console.log("Key failed, trying next...", err.message);
        lastError = err.message;
        continue;
      }
    }

    if (!finalResult) {
      return NextResponse.json(
        { success: false, error: "Saari keys fail: " + lastError },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, analysis: finalResult });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
