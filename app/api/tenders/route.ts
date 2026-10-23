import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "0");

  const limit = 50;
  const offset = page * limit;
  const today = new Date().toISOString().split('T')[0];

  // 1. User Profile nikalne ki koshish karo (Smart matching ke liye)
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

  // 2. MASTER_TENDERS SE DATA QUERY (Naya Table)
  let dbQuery = supabase
    .from('master_tenders')
    .select('*', { count: 'exact' })
    .gte('closing_date', today);

  if (searchQuery) {
    dbQuery = dbQuery.or(`title.ilike.%${searchQuery}%,org_name.ilike.%${searchQuery}%`);
  }

  // Master tenders me publishing_date hoti hai, published_date nahi
  dbQuery = dbQuery
    .order('publishing_date', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await dbQuery;

  if (error) {
    return NextResponse.json({ success: false, error: error.message, tenders: [] });
  }

  // 3. Smart Match Score & State Formatting (UI ko purana format dena)
  const tenders = (data || []).map((t: any) => {
    let displayState = t.state || t.portal_source;
    const titleLower = (t.title || "").toLowerCase();
    const orgLower = (t.org_name || "").toLowerCase();
    const textToSearch = `${titleLower} ${orgLower}`;

    if (!displayState || displayState === "India" || displayState.trim() === "") {
      if (textToSearch.includes("delhi")) displayState = "Delhi";
      else if (textToSearch.includes("mumbai")) displayState = "Maharashtra";
      else if (textToSearch.includes("bhopal")) displayState = "Madhya Pradesh";
      else if (textToSearch.includes("chennai")) displayState = "Tamil Nadu";
      else if (textToSearch.includes("kolkata")) displayState = "West Bengal";
      else if (textToSearch.includes("bangalore") || textToSearch.includes("bengaluru")) displayState = "Karnataka";
      else if (textToSearch.includes("hyderabad")) displayState = "Telangana";
      else if (textToSearch.includes("bsf") || textToSearch.includes("army") || textToSearch.includes("railway") || textToSearch.includes("fci") || textToSearch.includes("cpwd")) displayState = "Central Govt";
      else displayState = t.portal_source || "Pan India";
    }

    let score = 40; // Base Score

    if (searchQuery && textToSearch.includes(searchQuery.toLowerCase())) score += 40;
    if (userSector && textToSearch.includes(userSector)) score += 30;
    if (userState !== "All India" && displayState.toLowerCase() === userState.toLowerCase()) score += 20;
    else if (displayState === "Central Govt" || displayState === "Pan India") score += 10; 

    if (score === 40 || score === 50 || score === 60) {
        const hash = (t.id || t.source_tender_id || "0").toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        score = 45 + (hash % 25); 
    }
    if (score > 99) score = 99; 

    // 🔥 YAHAN DATA MAPPING HO RAHI HAI 🔥
    // Naye table (master_tenders) ke columns ko purane UI format me map kar rahe hain
    return { 
      ...t, 
      state: displayState, 
      match_score: score,
      value: t.estimated_cost,       // estimated_cost -> value
      source: t.portal_source,       // portal_source -> source
      source_url: t.original_url     // original_url -> source_url
    };
  });

  return NextResponse.json({ success: true, totalCount: count || 0, tenders });
}
