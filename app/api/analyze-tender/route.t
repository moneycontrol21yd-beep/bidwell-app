import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    if (!file) return NextResponse.json({ error: "No PDF" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // PDF text nikalo
    const pdfModule = await import("pdf-parse");
    const pdfParse = (pdfModule as any).default || pdfModule;
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text.slice(0, 20000);

    const keysString = process.env.GEMINI_API_KEYS || "";
    const apiKeys = keysString.split(",").map((k) => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: "No API keys found" }, { status: 500 });
    }

    const prompt = `
You are a tender analyst. Extract the following from this document as JSON:
- title
- department
- tender_value_in_cr (number only)
- emd_in_lakh (number only)
- last_date (YYYY-MM-DD)
- eligibility (array of strings)
- required_documents (array of strings)
- key_dates (object)
- risk_clauses (array of strings)

Return ONLY valid JSON, no markdown, no explanation.
If a field is not found, use null.

Document text:
${text}
`;

    let finalResult = null;
    let lastError = "";

    for (const key of apiKeys) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

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

