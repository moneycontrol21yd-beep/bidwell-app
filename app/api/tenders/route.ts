import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const source = searchParams.get("source") || "all";
  const tab = searchParams.get("tab") || "all";

  try {
    let url = `${SUPABASE_URL}/rest/v1/tenders?select=*&status=eq.active`;
    
    if (source !== "all") {
      url += `&source=eq.${encodeURIComponent(source)}`;
    }
    if (query) {
      url += `&title=ilike.*${encodeURIComponent(query)}*`;
    }

    // Tab-specific sorting/filtering
    if (tab === "fresh") {
      url += `&order=created_at.desc`;
    } else if (tab === "closing") {
      url += `&order=deadline.asc`;
    } else if (tab === "high_value") {
      url += `&order=value_in_cr.desc.nullslast`;
    } else {
      url += `&order=match_score.desc.nullslast`;
    }

    url += `&limit=100`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY!,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const tenders = await res.json();

    // Total count
    const countUrl = `${SUPABASE_URL}/rest/v1/tenders?select=id&status=eq.active`;
    const countRes = await fetch(countUrl, {
      headers: {
        apikey: SUPABASE_KEY!,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
    });
    const countHeader = countRes.headers.get("content-range") || "0-0/0";
    const totalCount = parseInt(countHeader.split("/")[1] || "0", 10);

    return NextResponse.json({
      success: true,
      totalCount,
      tenders: tenders.map((t: any) => ({
        id: t.id,
        title: t.title,
        department: t.department || "Unknown",
        value: t.value_in_cr ? `₹${t.value_in_cr} Cr` : "₹0 Cr",
        deadline: t.deadline || "No deadline",
        source: t.source || "Unknown",
        location: t.state || "India",
        category: t.department || "",
        match_score: t.match_score ?? 0,
        source_url: t.source_url,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, tenders: [], totalCount: 0 },
      { status: 500 }
    );
  }
}
