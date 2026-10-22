import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt, language } = await request.json();
    const VPS_AI_URL = "http://187.127.139.195:11434/api/generate"; 

    let langInstruction = language === "hi" 
      ? "CRITICAL: Reply ONLY in Hindi (Devanagari)." 
      : "CRITICAL: Reply ONLY in English.";

    const response = await fetch(VPS_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", 
        system: `You are BidWell AI, a highly professional Indian Tender Consultant. ${langInstruction} 
        Format your answer beautifully using Markdown. Use **bold**, bullet points, and official links.`,
        prompt: prompt,
        stream: true, // <--- Streaming Enabled
        options: { temperature: 0.4 }
      })
    });

    if (!response.ok) throw new Error("VPS Brain offline");

    return new Response(response.body, {
      headers: { 'Content-Type': 'text/event-stream' }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "AI is currently unreachable." }, { status: 500 });
  }
}
