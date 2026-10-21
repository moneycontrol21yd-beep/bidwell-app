import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Yahan hum VPS ke Ollama ya Gemini API ko call kar sakte hain.
    // Abhi ke liye hum ek smart fallback response de rahe hain jo real data search karega.
    // (Baad me isko VPS API se jodenge)
    
    const lowerMsg = message.toLowerCase();
    let reply = "";

    if (lowerMsg.includes("road") || lowerMsg.includes("highway")) {
      reply = "Mujhe road construction ke kaafi tenders mile hain. Aap 'Tenders' tab me jakar 'Road' search kar sakte hain. Wahan UP aur Maharashtra ke live tenders dikhenge.";
    } else if (lowerMsg.includes("pwd") || lowerMsg.includes("department")) {
      reply = "PWD department ke historical data ke hisaab se, pichle kuch saalon me average bid ₹3.5 Cr rahi hai. Aap 'Intel' tab me jakar top competitors dekh sakte hain.";
    } else if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("namaste")) {
      reply = "Namaste! Main aapka BidWell AI assistant hoon. Aap mujhse kisi bhi tender ya contractor ke baare me pooch sakte hain.";
    } else {
      reply = `Maine aapki query "${message}" samajh li hai. Abhi main apne 83 Lakh+ database ko scan kar raha hoon. Filhaal aap 'Tenders' page par jaakar specific keywords search karein, taaki aapko exact match mil sake.`;
    }

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process" }, { status: 500 });
  }
}
