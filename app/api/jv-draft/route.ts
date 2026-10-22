import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { senderName, senderGst, partnerName, partnerGst } = await request.json();
    
    const VPS_AI_URL = "http://187.127.139.195:11434/api/generate";
    const prompt = `Draft a professional Joint Venture (JV) Memorandum of Understanding (MoU) between two Indian companies. 
    Company 1: ${senderName} (GST: ${senderGst}). 
    Company 2: ${partnerName} (GST: ${partnerGst}).
    Include standard clauses for: 
    1. Purpose of JV (Government Tender Bidding).
    2. Scope of Work and Responsibilities.
    3. Financial Arrangements and Profit Sharing.
    4. Confidentiality (NDA).
    5. Dispute Resolution.
    Keep it formal, concise, and ready for print.`;

    const response = await fetch(VPS_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3", prompt, stream: false })
    });

    if (!response.ok) throw new Error("AI Brain offline");
    const data = await response.json();
    return NextResponse.json({ success: true, draft: data.response });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
