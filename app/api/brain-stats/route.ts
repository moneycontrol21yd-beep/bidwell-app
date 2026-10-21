import { NextResponse } from "next/server";
const VPS_URL = process.env.VPS_API_URL;
const VPS_TOKEN = process.env.VPS_API_TOKEN;

export async function GET() {
  try {
    const res = await fetch(`${VPS_URL}/api/brain-stats`, {
      headers: { Authorization: `Bearer ${VPS_TOKEN}`, 'bypass-tunnel-reminder': 'true' },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
