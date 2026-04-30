import { ImageResponse } from "next/og";

export const alt = "Impacta IA · La conferencia de IA para quienes toman decisiones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Renders dynamically (Edge runtime) but is cached aggressively by social platforms.
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0E0E10",
          color: "#fff",
        }}
      >
        {/* Soft blue radial */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 720,
            height: 720,
            background:
              "radial-gradient(circle, rgba(0,0,255,0.35) 0%, rgba(0,0,255,0) 60%)",
          }}
        />

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#1DD2B3",
              boxShadow: "0 0 0 6px rgba(29,210,179,0.20)",
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.20em",
              color: "rgba(255,255,255,0.75)",
              textTransform: "uppercase",
            }}
          >
            Impacta IA · Primera edición · 2026
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            fontSize: 96,
            lineHeight: 1.0,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            color: "#fff",
            maxWidth: 980,
          }}
        >
          <span>La conferencia de IA</span>
          <span>para quienes</span>
          <span
            style={{
              backgroundImage: "linear-gradient(120deg, #1DD2B3 0%, #6666FF 50%, #ED1E79 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            toman decisiones.
          </span>
        </div>

        {/* Footer meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            position: "relative",
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          <span style={{ color: "#fff" }}>Santiago · Septiembre 2026</span>
          <span style={{ color: "rgba(255,255,255,0.65)" }}>400 cupos · C-level</span>
        </div>
      </div>
    ),
    size
  );
}
