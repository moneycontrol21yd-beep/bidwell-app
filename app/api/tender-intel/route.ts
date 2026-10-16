import { NextResponse } from "next/server";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "";

  if (!title) {
    return NextResponse.json({ success: false, error: "No title" }, { status: 400 });
  }

  try {
    const words = title.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w: string) => w.length > 3);
    const k1 = words[0] || "security";
    const k2 = words[1] || k1;

    const res = await fetch(
      `${SB_URL}/rest/v1/brain_awards?select=winner_name,contract_value,bid_count&or=(title.ilike.*${k1}*,title.ilike.*${k2}*)&limit=50`,
      {
        headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}` },
        cache: "no-store",
      }
    );

    const awards = res.ok ? await res.json() : [];

    const compMap: Record<string, any> = {};
    let totalValue = 0, totalBids = 0, count = 0;

    for (const a of awards) {
      if (!a.winner_name) continue;
      if (!compMap[a.winner_name]) compMap[a.winner_name] = { wins: 0, total: 0 };
      compMap[a.winner_name].wins++;
      compMap[a.winner_name].total += parseFloat(a.contract_value) || 0;
      totalValue += parseFloat(a.contract_value) || 0;
      totalBids += a.bid_count || 0;
      count++;
    }

    const topCompetitors = Object.entries(compMap)
      .map(([name, d]: any) => ({ name, wins: d.wins, avg_value: d.total / d.wins }))
      .sort((a: any, b: any) => b.wins - a.wins)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      totalSimilar: count,
      avgWinningValue: count ? totalValue / count : 0,
      avgBidders: count ? totalBids / count : 0,
      topCompetitors,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
