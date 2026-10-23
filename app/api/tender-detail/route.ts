import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ success: false, error: "No ID provided" });

  // View me dhoondho (Isme master aur live dono ka data hai)
  let { data: viewData } = await supabase.from('all_live_tenders').select('*').eq('id', id).single();
  if (viewData) return NextResponse.json({ success: true, tender: viewData });

  // Backup: Direct master_tenders me dhoondho
  let { data: masterData } = await supabase.from('master_tenders').select('*').or(`id.eq.${id},source_tender_id.eq.${id}`).single();
  if (masterData) {
     const mapped = { ...masterData, value: masterData.estimated_cost, source: masterData.portal_source, source_url: masterData.original_url, department: masterData.department || masterData.org_name, tender_no: masterData.source_tender_id };
     return NextResponse.json({ success: true, tender: mapped });
  }

  // Backup: Direct live_tenders me dhoondho
  let { data: liveData } = await supabase.from('live_tenders').select('*').or(`id.eq.${id},source_tender_id.eq.${id}`).single();
  if (liveData) return NextResponse.json({ success: true, tender: liveData });

  return NextResponse.json({ success: false, error: "Tender not found" });
}
