"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => {
    const isChunkError = error.name === "ChunkLoadError" || 
                         error.message?.includes("Loading chunk") || 
                         error.message?.includes("Failed to fetch dynamically imported module") ||
                         error.message?.includes("ChunkLoadError");

    if (isChunkError) {
      const hasReloaded = sessionStorage.getItem("chunk_reloaded");
      if (!hasReloaded) {
        sessionStorage.setItem("chunk_reloaded", "true");
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <html>
      <body style={{ background: "#f5f7fb", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", margin: 0, padding: 20 }}>
        <div style={{ background: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: 500 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#ef4444", marginTop: 0 }}>Error Detected</h2>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>The app crashed. Details:</p>
          <div style={{ background: "#f1f5f9", padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 12, fontFamily: "monospace", wordBreak: "break-word" }}>
            <strong>Message:</strong> {error.message || "Unknown"} <br/><br/>
            <strong>Digest:</strong> {error.digest || "N/A"}
          </div>
          <button onClick={() => reset()} style={{ width: "100%", padding: "12px", background: "#315efb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Try Again</button>
        </div>
      </body>
    </html>
  );
}
