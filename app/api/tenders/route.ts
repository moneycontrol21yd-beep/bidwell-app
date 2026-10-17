import { NextResponse } from "next/server";

const VPS_URL = process.env.VPS_API_URL;
const VPS_TOKEN = process.env.VPS_API_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  
  const forward = new URLSearchParams();
  // User ko sirf 5 sabse relevant tenders dikhenge
  forward.append("limit", "5"); 
  if (query) forward.append("search", query);
  
  const url = `${VPS_URL}/tenders?${forward.toString()}`;
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${VPS_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("VPS API Error");
    const data = await res.json();
    
    const tenders = data.tenders.map((t: any) => ({
      id: t.id,
      title: t.title,
      department: t.department || "Unknown",
      value: "Not disclosed",
      deadline: t.deadline || "No deadline",
      source: t.source || "CPPP",
      location: "India",
      category: t.department || "General",
      match_score: 88,
      source_url: t.source_url
    }));
    
    return NextResponse.json({ success: true, totalCount: data.total, tenders });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, tenders: [], totalCount: 0 });
  }
}
