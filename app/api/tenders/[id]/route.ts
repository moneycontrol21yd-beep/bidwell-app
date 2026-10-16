import { NextResponse } from "next/server";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const res = await fetch(
      `${SB_URL}/rest/v1/tenders?id=eq.${encodeURIComponent(id)}&limit=1`,
      {
        headers: {
          apikey: SB_KEY!,
          Authorization: `Bearer ${SB_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Supabase error: ${res.status}` },
        { status: res.status }
      );
    }

    const rows = await res.json();

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tender not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, tender: rows[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
