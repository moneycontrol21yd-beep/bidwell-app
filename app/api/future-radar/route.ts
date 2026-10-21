import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  // Fetch tenders closing in future to show as "Future Opportunities"
  const { data, error } = await supabase
    .from("live_tenders")
    .select("*")
    .gt("closing_date", new Date().toISOString())
    .order("closing_date", { ascending: true })
    .limit(10);

  if (error || !data) return NextResponse.json({ success: true, radar_data: [] });

  const radar_data = data.map((t: any) => ({
    department: t.org_name || "Unknown Dept",
    title: t.title,
    expected_month: new Date(t.closing_date).toLocaleString('default', { month: 'short' }),
    confidence: "High",
    evidence: `Live Tender closing on ${new Date(t.closing_date).toLocaleDateString()}`
  }));

  return NextResponse.json({ success: true, radar_data });
}
