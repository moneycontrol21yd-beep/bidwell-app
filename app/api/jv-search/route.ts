import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    let userSector = "General";

    if (user) {
      // FIX: 'companies' ki jagah 'company_profiles' se data uthao
      const { data: profile } = await supabase
        .from('company_profiles')
        .select('business_type')
        .eq('user_id', user.id)
        .single();

      if (profile && profile.business_type) {
        userSector = profile.business_type.toLowerCase();
      }
    }

    // JV Partners fetch karo
    const { data: allPartners, error } = await supabase
      .from('jv_partners')
      .select('*')
      .limit(50);

    if (error) throw error;
    if (!allPartners || allPartners.length === 0) {
      return NextResponse.json({ success: true, userSector, partners: [] });
    }

    // Smart Match Logic
    let matchedPartners = allPartners.map((p: any) => {
      let score = 60;
      let matchReasons = ["Diverse Sector"]; 
      
      const vendorSector = (p.sector || "").toLowerCase();
      
      if (userSector && userSector !== "general" && vendorSector.includes(userSector)) {
        score += 30;
        matchReasons = ["Exact Sector Match"];
      }

      if (p.total_wins > 5) {
        score += 10;
        matchReasons.push("High Experience");
      }

      return {
        ...p,
        match: Math.min(score, 99),
        matchReasons
      };
    });

    // Top 10 partners return karo
    matchedPartners = matchedPartners
      .sort((a: any, b: any) => b.match - a.match)
      .slice(0, 10);

    return NextResponse.json({ success: true, userSector, partners: matchedPartners });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
