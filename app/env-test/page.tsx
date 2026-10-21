"use client";
export default function EnvTest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    <div style={{padding: 20, fontFamily: "monospace", fontSize: 14}}>
      <h1 style={{fontWeight: "bold", marginBottom: 20}}>ENV Test</h1>
      <p style={{marginBottom: 10}}><b>URL:</b> {url || "❌ MISSING"}</p>
      <p style={{marginBottom: 10}}><b>Key length:</b> {key?.length || 0}</p>
      <p style={{marginBottom: 10}}><b>Key start:</b> {key?.substring(0, 20) || "MISSING"}</p>
      <p style={{marginBottom: 10}}><b>Key end:</b> {key?.substring((key?.length || 0) - 10) || "MISSING"}</p>
    </div>
  );
}
