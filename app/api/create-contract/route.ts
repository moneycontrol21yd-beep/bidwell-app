import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { tender_id } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Tender ki details laao
    const { data: tender, error: tErr } = await supabase
      .from("tenders")
      .select("*")
      .eq("id", tender_id)
      .single();

    if (tErr || !tender) {
      return NextResponse.json({ success: false, error: "Tender nahi mila" }, { status: 404 });
    }

    // Contract banao
    const { error: cErr } = await supabase.from("contracts").insert({
      title: tender.title,
      value_in_cr: tender.value_in_cr || 0,
      receivable_in_lakh: (tender.value_in_cr || 0) * 100,
      start_date: new Date().toISOString().split("T")[0],
      end_date: tender.deadline
        ? new Date(new Date(tender.deadline).getTime() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        : null,
      status: "active",
    });

    if (cErr) {
      return NextResponse.json({ success: false, error: cErr.message }, { status: 500 });
    }

    // Tender ka status update karo
    await supabase.from("tenders").update({ status: "won" }).eq("id", tender_id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
