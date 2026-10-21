import { NextResponse } from "next/server";

const VPS_URL = process.env.VPS_API_URL;
const VPS_TOKEN = process.env.VPS_API_TOKEN;

export async function GET(request: Request) {
  if (!VPS_URL || !VPS_TOKEN) {
    return NextResponse.json({ error: "VPS not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ error: "invalid path" }, { status: 400 });
  }

  const forward = new URLSearchParams();
  searchParams.forEach((v, k) => { if (k !== "path") forward.append(k, v); });

  const url = `${VPS_URL}${path}${forward.toString() ? "?" + forward.toString() : ""}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${VPS_TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
