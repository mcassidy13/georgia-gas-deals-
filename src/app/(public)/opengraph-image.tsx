import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Georgia Gas Deals — Compare Natural Gas Rates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d1b2a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          gap: "24px",
        }}
      >
        {/* Site name */}
        <div
          style={{
            color: "#e8a020",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Georgia Gas Deals
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#faf7f2",
            fontSize: 64,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          Stop overpaying for{" "}
          <span style={{ color: "#e05c2a" }}>natural gas</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#faf7f2",
            opacity: 0.55,
            fontSize: 26,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Sorted by what you actually pay — not who pays us the most
        </div>
      </div>
    ),
    { ...size }
  );
}
