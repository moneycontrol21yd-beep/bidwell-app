import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  const { data, error } = await supabase
    .from("live_tenders")
    .select("*")
    .eq("source_tender_id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, tender: data });
}
