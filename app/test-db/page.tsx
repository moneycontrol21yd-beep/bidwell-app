"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDB() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("tenders").select("id, title, status").limit(5).then((r: any) => {
      if (r.error) setErr(r.error);
      else setData(r.data);
      setLoading(false);
    });
  }, []);

  return (
    <main style={{padding: "20px", fontFamily: "monospace"}}>
      <h1 style={{fontWeight: "bold", fontSize: "18px", marginBottom: "15px"}}>DB Test Page</h1>
      {loading && <p>Loading...</p>}
      {err && <pre style={{background: "#fee", padding: "10px", fontSize: "12px"}}>{JSON.stringify(err, null, 2)}</pre>}
      {data && (
        <div>
          <p style={{color: "green", fontWeight: "bold", marginBottom: "10px"}}>✅ Found {data.length} tenders</p>
          {data.map((t: any) => (
            <div key={t.id} style={{border: "1px solid #ccc", padding: "8px", marginBottom: "8px", fontSize: "12px"}}>
              <p><b>{t.title}</b></p>
              <p style={{color: "#666"}}>Status: {t.status}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
