import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { searchParams } = new URL(request.url);
  
  const orgName = searchParams.get("org") || "";
  const tenderId = searchParams.get("id") || "";

  if (!orgName) return NextResponse.json({ success: false, error: "Department name required" });

  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Fetch Current Tender
    const { data: currentTender } = await supabase.from('live_tenders').select('*').eq('id', tenderId).single();

    // 2. Fetch Real Live Count
    const { count: totalLive } = await supabase
      .from('live_tenders')
      .select('*', { count: 'exact', head: true })
      .ilike('org_name', `%${orgName}%`)
      .gte('closing_date', today);

    // 3. Fetch Real Kundli Summary
    const { data: kundliData } = await supabase.from('department_kundli').select('*').ilike('org_name', `%${orgName}%`).limit(1).single();

    // 4. Risk Analysis
    let riskReasons = [];
    let verdict = "PROCEED WITH CAUTION";
    let verdictColor = "#F59E0B";

    if (currentTender) {
      if (!currentTender.emd || currentTender.emd === "0") riskReasons.push("EMD details missing. Verify on the official portal.");
      if (!currentTender.value || currentTender.value === "0") riskReasons.push("Tender value not specified.");
      
      const closingDate = new Date(currentTender.closing_date);
      const daysLeft = Math.ceil((closingDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (daysLeft < 3 && daysLeft > 0) {
        riskReasons.push(`Urgent: Only ${daysLeft} days left to apply.`);
        verdict = "HIGH RISK - URGENT";
        verdictColor = "#EF4444";
      }
    }

    let competitors = [];
    if (kundliData) {
      competitors = kundliData.top_winners || [];
      const totalTenders = kundliData.total_tenders || 0;
      if (competitors.length > 0 && competitors[0].wins > (totalTenders * 0.6)) {
        riskReasons.push(`Monopoly Alert: Top vendor has won ${competitors[0].wins} out of ${totalTenders} past tenders.`);
        verdict = "HIGH COMPETITION";
        verdictColor = "#EF4444";
      } else {
        riskReasons.push(`Healthy competition: ${totalTenders} past tenders distributed among multiple vendors.`);
        if (verdict !== "HIGH RISK - URGENT") { verdict = "GOOD OPPORTUNITY"; verdictColor = "#10B981"; }
      }
    } else {
      riskReasons.push("Insufficient historical award data for this department.");
    }

    if (riskReasons.length === 0) riskReasons.push("Standard bidding recommended.");

    const nextActions = [
      "Download official tender documents from source.",
      "Verify EMD amount and submission mode.",
      currentTender?.closing_date ? `Submit bid before ${currentTender.closing_date}.` : "Confirm closing date.",
      "Check for recent corrigendums."
    ];

    return NextResponse.json({ 
      success: true, 
      intel: {
        totalLive: totalLive || 0,
        totalPast: kundliData?.total_tenders || 0,
        dataCoverage: "VPS Brain (29L+ Awards) synced to Supabase",
        analysis: {
          verdict,
          verdictColor,
          eligibilityStatus: "Check Official Documents",
          riskReasons,
          competitors,
          paymentRating: orgName.toLowerCase().includes("central") || orgName.toLowerCase().includes("railway") ? "Est: Fast (Central)" : "Est: Standard (State)",
          forecast: "Based on current trends, similar tenders may appear in the next 3-6 months. (Forecast only)",
          source: currentTender?.source || "BidWell DB",
          analyzedAt: new Date().toISOString().split('T')[0],
          nextActions
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
