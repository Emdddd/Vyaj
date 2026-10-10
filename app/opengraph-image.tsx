import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "VYAJ — Plan less. Travel more.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px 100px",
          background: "linear-gradient(135deg, #07172e 0%, #0b2440 100%)",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: "rgba(38, 198, 218, 0.12)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 54 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: "#26c6da",
              color: "#07172e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 900,
            }}
          >
            V
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: 7 }}>VYAJ</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 750, lineHeight: 1.12, maxWidth: 920 }}>
          Your next trip,
          <br />
          made yours.
        </div>
        <div style={{ marginTop: 28, fontSize: 25, color: "#26c6da", letterSpacing: 4, fontWeight: 700 }}>
          PLAN LESS. TRAVEL MORE.
        </div>
        <div style={{ position: "absolute", bottom: 42, right: 72, fontSize: 20, color: "#b8c9d8" }}>
          vyaj.eu
        </div>
      </div>
    ),
    { ...size }
  );
}
