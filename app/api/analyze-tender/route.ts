import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function geminiKeys(): string[] {
  const keys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  return keys.split(",").map((k) => k.trim()).filter(Boolean);
}

async function tryGroq(prompt: string): Promise<any | null> {
  const key = process.env.GROQ_API_KEY || "";
  if (!key) return null;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "You are a tender analysis expert for Indian government contracts. Always respond in valid JSON only. No markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2500,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    return JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
  } catch {
    return null;
  }
}

async function tryGemini(prompt: string): Promise<any | null> {
  const keys = geminiKeys();
  if (keys.length === 0) return null;
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  for (const model of models) {
    for (const key of keys) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 2500, responseMimeType: "application/json" },
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
      } catch { continue; }
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { tenderId, title, department, value } = await req.json();
    if (!tenderId) return NextResponse.json({ error: "tenderId required" }, { status: 400 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Fetch company + brain
    const { data: company } = await supabase.from("companies").select("*").limit(1).maybeSingle();
    const { data: brain } = company
      ? await supabase.from("company_brain").select("*").eq("company_id", company.id).maybeSingle()
      : { data: null };

    const brainContext = brain
      ? `
COMPANY BRAIN:
- Summary: ${brain.summary || "N/A"}
- Strengths: ${JSON.stringify(brain.strengths || [])}
- Weaknesses: ${JSON.stringify(brain.weaknesses || [])}
- Capacity: ${JSON.stringify(brain.capacity || {})}
- Sectors: ${JSON.stringify(brain.sectors || [])}
- Regions: ${JSON.stringify(brain.regions || [])}
- Certifications: ${JSON.stringify(brain.certifications || {})}
`
      : "No company brain available.";

    const prompt = `Analyze this tender for the contractor:

TENDER:
Title: ${title || "N/A"}
Department: ${department || "N/A"}
Value: ₹${value || 0} Cr

${brainContext}

Return JSON:
{
  "eligibility": "percentage like 85% based on company strengths vs tender",
  "emd": "EMD estimate like ₹5 Lakh",
  "payment_risk": "Low | Medium | High",
  "decision": "GO | NO-GO | MAYBE",
  "summary": "2-3 sentence analysis explaining the decision",
  "key_points": ["point 1", "point 2", "point 3"]
}`;

    let result = await tryGroq(prompt);
    if (!result) result = await tryGemini(prompt);

    if (!result) {
      return NextResponse.json({ error: "AI analysis failed. Try again." }, { status: 503 });
    }

    // Save to tender
    try {
      await supabase.from("tenders").update({
        ai_summary: result.summary || "",
        ai_key_points: result.key_points || [],
        match_score: parseInt(String(result.eligibility).replace(/[^0-9]/g, "")) || 85,
        risk_level: result.payment_risk || "Medium",
      }).eq("id", tenderId);
    } catch { /* ignore */ }

    return NextResponse.json({
      success: true,
      eligibility: result.eligibility,
      emd: result.emd,
      payment_risk: result.payment_risk,
      decision: result.decision,
      summary: result.summary,
      key_points: result.key_points || [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
