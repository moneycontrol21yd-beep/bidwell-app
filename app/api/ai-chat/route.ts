import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt, language } = await request.json();
    const VPS_AI_URL = "http://187.127.139.195:11434/api/generate"; 

    const langInstruction = language === "hi" ? "Reply strictly in Hindi (Devanagari script)." : 
                            language === "mr" ? "Reply strictly in Marathi." :
                            "Reply in English.";

    const response = await fetch(VPS_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", 
        prompt: `You are BidWell AI. ${langInstruction} Answer the query professionally. If asked for missing documents, provide official links. Query: ${prompt}`,
        stream: false
      })
    });

    if (!response.ok) throw new Error("VPS Brain offline");
    const data = await response.json();
    return NextResponse.json({ success: true, reply: data.response });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "VPS AI connection failed." });
  }
}
