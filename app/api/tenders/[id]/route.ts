import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const id = params.id;

  let { data: masterData } = await supabase.from('master_tenders').select('*').or(`id.eq.${id},source_tender_id.eq.${id}`).maybeSingle();
    
  if (masterData) {
     const mapped = { ...masterData, value: masterData.estimated_cost, source: masterData.portal_source, source_url: masterData.original_url, department: masterData.department || masterData.org_name, tender_no: masterData.source_tender_id };
     return NextResponse.json({ success: true, tender: mapped });
  }
  return NextResponse.json({ success: false, error: "Tender not found" });
}
