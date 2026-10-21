import { verifyAuth } from "@/lib/auth-guard";
import { NextResponse } from "next/server";

const VPS_URL = process.env.VPS_API_URL;
const VPS_TOKEN = process.env.VPS_API_TOKEN;

export async function GET(request: Request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const org = searchParams.get("org") || "";

  if (!org) {
    return NextResponse.json({ error: "Organisation name required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${VPS_URL}/brain/competitor-intel?org_pattern=${encodeURIComponent(org)}`, {
      headers: { Authorization: `Bearer ${VPS_TOKEN}`, 'bypass-tunnel-reminder': 'true' },
      cache: "no-store",
    });
    
    if (!res.ok) throw new Error("VPS error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
