import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const { error } = await supabase.from("tenders").insert({
      title: body.title || "Untitled",
      department: body.department || "Unknown",
      value_in_cr: body.value_in_cr || 0,
      deadline: body.deadline ? new Date(body.deadline).toISOString() : null,
      status: "active",
      country: "India",
      ai_summary: body.ai_summary || null,
      ai_key_points: body.key_points || null,
      risk_level: body.risk_level || null,
    });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
