import { ImageResponse } from "next/og";
import { AI_MODEL_DISPLAY_NAME } from "@/lib/constants";

export const alt = "Klyro — From prompt to product";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#14161f",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)",
          backgroundSize: "40px 40px",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#f2f0e8",
          border: "12px solid #1c1f2b",
        }}
      >
        {/* Top bar: Brand & Model Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "6px",
                backgroundColor: "#f2a93b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#14161f",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              K
            </div>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                letterSpacing: "-0.02em",
                color: "#f2f0e8",
              }}
            >
              Klyro
            </span>
          </div>

          {/* Model Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #2b2f3c",
              backgroundColor: "#1a1d27",
              fontSize: "16px",
              color: "#9aa0ae",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#f2a93b",
              }}
            />
            <span>{AI_MODEL_DISPLAY_NAME}</span>
          </div>
        </div>

        {/* Center: Main Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#f2f0e8",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>From prompt to </span>
            <span style={{ color: "#f2a93b", marginLeft: "16px" }}>product.</span>
          </div>
          <p
            style={{
              fontSize: "26px",
              color: "#9aa0ae",
              maxWidth: "880px",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Turn natural-language descriptions into clean, editable Next.js and Tailwind web applications.
          </p>
        </div>

        {/* Bottom: URL and Stack summary */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #2b2f3c",
            paddingTop: "28px",
            fontSize: "18px",
            fontFamily: "monospace",
            color: "#6b7280",
          }}
        >
          <span>Next.js 16 · Tailwind CSS · TypeScript</span>
          <span style={{ color: "#f2a93b" }}>klyro-gamma.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
