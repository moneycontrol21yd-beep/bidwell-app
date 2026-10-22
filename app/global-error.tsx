"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Chunk load error check karo aur ek baar auto-reload karo
    const isChunkError = error.name === "ChunkLoadError" || 
                         error.message.includes("Loading chunk") || 
                         error.message.includes("Failed to fetch dynamically imported module");
    
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
      <body style={{ background: "#f5f7fb", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Something went wrong!</h2>
          <p style={{ fontSize: 14, color: "#64748b" }}>Please try refreshing the page.</p>
          <button 
            onClick={() => reset()} 
            style={{ marginTop: 16, padding: "10px 20px", background: "#315efb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
