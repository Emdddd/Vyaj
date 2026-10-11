"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("VYAJ page error:", error);
  }, [error]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 20px", background: "#f8faf9", color: "#172321", fontFamily: "Arial, sans-serif" }}>
      <section style={{ width: "100%", maxWidth: "480px", textAlign: "center" }}>
        <p style={{ letterSpacing: "0.18em", fontSize: "12px", fontWeight: 700 }}>VYAJ / TRIP PLANNER</p>
        <h1 style={{ fontSize: "30px", lineHeight: 1.15 }}>Let’s get you back on track.</h1>
        <p style={{ lineHeight: 1.7, color: "#52615d" }}>Something went wrong while loading this page. Your trip request may not have been completed. Please try again.</p>
        <button onClick={() => reset()} style={{ marginTop: "12px", border: 0, borderRadius: "999px", background: "#182c29", color: "white", padding: "14px 22px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>Try again</button>
        <button onClick={() => window.location.assign("/")} style={{ marginTop: "12px", marginLeft: "8px", border: "1px solid #cbd5d1", borderRadius: "999px", background: "transparent", color: "#182c29", padding: "14px 22px", fontSize: "15px", cursor: "pointer" }}>Reload VYAJ</button>
      </section>
    </main>
  );
}
