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
          { role: "system", content: "You are a business analyst. Always respond in valid JSON only. No markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
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
            generationConfig: { temperature: 0.3, maxOutputTokens: 2000, responseMimeType: "application/json" },
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return JSON.parse(cleaned);
      } catch {
        continue;
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { companyId } = await req.json();
    if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: company } = await supabase.from("companies").select("*").eq("id", companyId).maybeSingle();
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const { data: docs } = await supabase.from("documents").select("*").eq("company_id", companyId);
    const { data: contracts } = await supabase.from("contracts").select("*").eq("company_id", companyId);

    const companyInfo = `
NAME: ${company.name || "N/A"}
BUSINESS TYPE: ${company.business_type || "N/A"}
TURNOVER: ${company.turnover_cr || 0} Cr
EXPERIENCE: ${company.experience_years || 0} years
EMPLOYEES: ${company.employees_count || 0}
CERTIFICATIONS: ${JSON.stringify(company.certifications || [])}
SERVICES: ${JSON.stringify(company.services || [])}
ADDRESS: ${company.address || "N/A"}
GST: ${company.gst_number || "N/A"}
MSME: ${company.msme_number || "N/A"}
`;
    const docsInfo = (docs || []).map((d: any) => `- ${d.doc_type || d.type || "Doc"}: ${d.doc_number || "N/A"}`).join("\n");
    const contractsInfo = (contracts || []).map((c: any) => `- ${c.title || "Contract"}: ₹${c.value_in_cr || 0}Cr`).join("\n");

    const prompt = `Analyze this company and return JSON only:

${companyInfo}

DOCS:
${docsInfo || "None"}

CONTRACTS:
${contractsInfo || "None"}

Return JSON:
{
  "summary": "2-3 sentence summary",
  "strengths": ["s1","s2","s3","s4","s5"],
  "weaknesses": ["w1","w2","w3"],
  "past_wins": [{"tender":"name","value":"₹X Cr","year":2024}],
  "certifications": {"ISO 9001":"valid"},
  "capacity": {"max_bid_value":"₹X Cr","avg_project":"₹X-Y Cr","turnover":"₹X Cr","regions_active":["state"]},
  "sectors": ["Security"],
  "regions": ["Maharashtra"]
}`;

    let brain = await tryGroq(prompt);
    if (!brain) brain = await tryGemini(prompt);

    if (!brain) {
      return NextResponse.json({ error: "All AI providers failed. Try again in a few minutes." }, { status: 503 });
    }

    const { data: existing } = await supabase.from("company_brain").select("id").eq("company_id", companyId).maybeSingle();
    const payload = {
      company_id: companyId,
      summary: brain.summary || "",
      strengths: brain.strengths || [],
      weaknesses: brain.weaknesses || [],
      past_wins: brain.past_wins || [],
      certifications: brain.certifications || {},
      capacity: brain.capacity || {},
      sectors: brain.sectors || [],
      regions: brain.regions || [],
      updated_at: new Date().toISOString(),
    };
    if (existing?.id) await supabase.from("company_brain").update(payload).eq("id", existing.id);
    else await supabase.from("company_brain").insert(payload);

    return NextResponse.json({ success: true, brain });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
