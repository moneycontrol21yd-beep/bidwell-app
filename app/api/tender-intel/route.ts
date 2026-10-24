import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get("id");

  if (!tenderId) return NextResponse.json({ success: false, error: "No ID" });

  // 1. Current Tender (Master se)
  let { data: currentTender } = await supabase.from('master_tenders').select('*').or(`id.eq.${tenderId},source_tender_id.eq.${tenderId}`).maybeSingle();
  
  if (!currentTender) return NextResponse.json({ success: false, error: "Tender not found" });

  // 2. Past Tenders (Same department ke, Master se hi)
  let { data: pastTenders } = await supabase.from('master_tenders')
    .select('*')
    .ilike('org_name', `%${currentTender.org_name}%`)
    .neq('id', currentTender.id)
    .limit(10);

  return NextResponse.json({
    success: true,
    currentTender: currentTender,
    pastTenders: pastTenders || [],
    riskLevel: "Medium",
    competition: "Healthy competition: multiple vendors."
  });
}
