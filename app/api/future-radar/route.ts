import { NextResponse } from "next/server";

const VPS_URL = process.env.VPS_API_URL;
const VPS_TOKEN = process.env.VPS_API_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "";

  const forward = new URLSearchParams();
  if (keyword) forward.append("keyword", keyword);

  const url = `${VPS_URL}/api/future-radar?${forward.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${VPS_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("VPS error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
