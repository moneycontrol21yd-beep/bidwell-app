import { NextResponse } from "next/server";

const VPS_URL = process.env.VPS_API_URL;
const VPS_TOKEN = process.env.VPS_API_TOKEN;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const res = await fetch(`${VPS_URL}/tenders/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${VPS_TOKEN}` },
      cache: "no-store",
    });
    
    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ error: "Tender not found" }, { status: 404 });
      throw new Error("VPS API error");
    }
    
    const data = await res.json();
    return NextResponse.json({ success: true, tender: data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
