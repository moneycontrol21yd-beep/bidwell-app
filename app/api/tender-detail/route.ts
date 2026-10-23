import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ success: false, error: "No ID provided" });

  const cleanId = id.trim();

  // 1. Pehle View (all_live_tenders) me dhoondho (ID ya Source ID dono se)
  let { data: viewData } = await supabase
    .from('all_live_tenders')
    .select('*')
    .or(`id.eq.${cleanId},source_tender_id.eq.${cleanId}`)
    .maybeSingle();
    
  if (viewData) return NextResponse.json({ success: true, tender: viewData });

  // 2. Agar View me nahi mila, toh master_tenders me dhoondho
  let { data: masterData } = await supabase
    .from('master_tenders')
    .select('*')
    .or(`id.eq.${cleanId},source_tender_id.eq.${cleanId}`)
    .maybeSingle();
    
  if (masterData) {
     const mapped = { 
       ...masterData, 
       value: masterData.estimated_cost, 
       source: masterData.portal_source, 
       source_url: masterData.original_url, 
       department: masterData.department || masterData.org_name, 
       tender_no: masterData.source_tender_id 
     };
     return NextResponse.json({ success: true, tender: mapped });
  }

  // 3. Agar wahan bhi nahi mila, toh live_tenders me dhoondho
  let { data: liveData } = await supabase
    .from('live_tenders')
    .select('*')
    .or(`id.eq.${cleanId},source_tender_id.eq.${cleanId}`)
    .maybeSingle();
    
  if (liveData) return NextResponse.json({ success: true, tender: liveData });

  // 4. Agar purane tenders table me ho toh
  let { data: oldData } = await supabase
    .from('tenders')
    .select('*')
    .or(`id.eq.${cleanId},source_url.eq.${cleanId}`)
    .maybeSingle();
    
  if (oldData) return NextResponse.json({ success: true, tender: oldData });

  return NextResponse.json({ success: false, error: "Tender not found in any table" });
}
