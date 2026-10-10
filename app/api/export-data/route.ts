import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const [company, tenders, contracts, invoices, documents] = await Promise.all([
      supabase.from("companies").select("*"),
      supabase.from("tenders").select("*"),
      supabase.from("contracts").select("*"),
      supabase.from("invoices").select("*"),
      supabase.from("documents").select("*"),
    ]);

    // Build CSV for tenders
    const tendersCsv = ["Title,Department,Value(Cr),Deadline,Status"]
      .concat((tenders.data || []).map((t: any) => 
        `"${(t.title || "").replace(/"/g, '""')}","${t.department || ""}",${t.value_in_cr || 0},${t.deadline || ""},${t.status || ""}`
      )).join("\n");

    // Build CSV for contracts
    const contractsCsv = ["Title,Value(Cr),Receivable(L),Start,End,Status"]
      .concat((contracts.data || []).map((c: any) => 
        `"${(c.title || "").replace(/"/g, '""')}",${c.value_in_cr || 0},${c.receivable_in_lakh || 0},${c.start_date || ""},${c.end_date || ""},${c.status || ""}`
      )).join("\n");

    // Build CSV for invoices
    const invoicesCsv = ["Invoice No,Amount,Status,Submitted,Paid"]
      .concat((invoices.data || []).map((i: any) => 
        `"${i.invoice_no || ""}",${i.amount || 0},${i.status || ""},${i.submitted_at || ""},${i.paid_at || ""}`
      )).join("\n");

    const fullCsv = [
      "===== TENDERS =====",
      tendersCsv,
      "",
      "===== CONTRACTS =====",
      contractsCsv,
      "",
      "===== INVOICES =====",
      invoicesCsv,
    ].join("\n");

    return new NextResponse(fullCsv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bidwell-export-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
