import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const limit = 50;
  const offset = page * limit;
  const today = new Date().toISOString();

  let userState = "All India";
  let userSector = "";
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: company } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
      if (company) {
        userSector = (company.business_type || "").toLowerCase();
        if (company.address) {
          const parts = company.address.split(",");
          userState = parts[parts.length - 1].trim();
        }
      }
    }
  } catch (e) {}

  let dbQuery = supabase
    .from('master_tenders')
    .select('id, title, org_name, state, estimated_cost, closing_date, portal_source, original_url, publishing_date', { count: 'exact' })
    .gte('closing_date', today);

  if (searchQuery) {
    dbQuery = dbQuery.or(`title.ilike.%${searchQuery}%,org_name.ilike.%${searchQuery}%`);
  }

  dbQuery = dbQuery.order('publishing_date', { ascending: false }).range(offset, offset + limit - 1);
  const { data, error, count } = await dbQuery;

  if (error) return NextResponse.json({ success: false, error: error.message, tenders: [] });

  const tenders = (data || []).map((t: any) => {
    let displayState = t.state || t.portal_source;
    let displaySource = t.portal_source || "CPPP";
    
    // Source Badge Fix
    if (displaySource.toUpperCase().includes("PRADESH") || displaySource.toUpperCase().includes("DELHI")) {
        displaySource = "Central Portal";
    }

    const textToSearch = `${(t.title || "").toLowerCase()} ${(t.org_name || "").toLowerCase()}`;

    // Force State Detect
    if (textToSearch.includes("delhi")) displayState = "Delhi";
    else if (textToSearch.includes("mumbai") || textToSearch.includes("pune") || textToSearch.includes("nagpur")) displayState = "Maharashtra";
    else if (textToSearch.includes("bhopal") || textToSearch.includes("indore")) displayState = "Madhya Pradesh";
    else if (textToSearch.includes("chennai")) displayState = "Tamil Nadu";
    else if (textToSearch.includes("kolkata")) displayState = "West Bengal";
    else if (textToSearch.includes("bangalore") || textToSearch.includes("bengaluru")) displayState = "Karnataka";
    else if (textToSearch.includes("hyderabad")) displayState = "Telangana";
    else if (textToSearch.includes("jaipur")) displayState = "Rajasthan";
    else if (textToSearch.includes("shillong") || textToSearch.includes("meghalaya")) displayState = "Meghalaya";
    else if (textToSearch.includes("lucknow") || textToSearch.includes("uttar pradesh")) displayState = "Uttar Pradesh";
    else if (!displayState || displayState === "India" || displayState.trim() === "" || displayState.toUpperCase() === "MADHYA-PRADESH") {
        if (textToSearch.includes("bsf") || textToSearch.includes("army") || textToSearch.includes("railway") || textToSearch.includes("fci") || textToSearch.includes("cpwd") || textToSearch.includes("drdo")) {
             displayState = "Central Govt";
        } else {
             displayState = "Pan India";
        }
    }

    let score = 40; 
    if (searchQuery && textToSearch.includes(searchQuery.toLowerCase())) score += 40;
    if (userSector && textToSearch.includes(userSector)) score += 30;
    if (userState !== "All India" && displayState.toLowerCase() === userState.toLowerCase()) score += 20;
    else if (displayState === "Central Govt" || displayState === "Pan India") score += 10; 

    if (score === 40 || score === 50 || score === 60) {
        const hash = (t.id || "0").toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        score = 45 + (hash % 25); 
    }
    if (score > 99) score = 99; 

    return { ...t, state: displayState, source: displaySource, match_score: score, value: t.estimated_cost, source_url: t.original_url };
  });

  return NextResponse.json({ success: true, totalCount: count || 0, tenders });
}
