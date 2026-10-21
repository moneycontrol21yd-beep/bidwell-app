import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // VPS Brain (Ollama) ko request bhej rahe hain
    // Note: VPS 11434 port par exposed hai jaisa humne docker ps me dekha tha
    const response = await fetch("http://187.127.139.195:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", // Agar VPS me llama3 nahi hai, toh model name yahan change karna
        prompt: `You are BidWell AI, a professional Indian Tender Consultant. Answer the user's query clearly and professionally in the context of government tenders. Query: ${prompt}`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("VPS Brain connection failed");
    }

    const data = await response.json();
    return NextResponse.json({ success: true, reply: data.response });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
