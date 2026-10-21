import { NextResponse } from "next/server";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "competitors";
  const limit = searchParams.get("limit") || "20";

  let table = "brain_competitors";
  let order = "total_wins.desc";

  if (type === "departments") {
    table = "brain_departments";
    order = "total_tenders.desc";
  } else if (type === "prices") {
    table = "brain_price_stats";
    order = "total_tenders.desc";
  }

  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/${table}?select=*&order=${order}&limit=${limit}`,
      {
        headers: {
          apikey: SB_KEY!,
          Authorization: `Bearer ${SB_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, data: [] },
      { status: 500 }
    );
  }
}
