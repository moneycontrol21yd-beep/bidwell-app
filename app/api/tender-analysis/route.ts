import { NextResponse } from "next/server";
const VPS_URL = process.env.VPS_API_URL;
const VPS_TOKEN = process.env.VPS_API_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get("id");
  if (!tenderId) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const res = await fetch(`${VPS_URL}/api/tender-analysis?tender_id=${encodeURIComponent(tenderId)}`, {
      headers: { Authorization: `Bearer ${VPS_TOKEN}`, 'bypass-tunnel-reminder': 'true' }, cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
