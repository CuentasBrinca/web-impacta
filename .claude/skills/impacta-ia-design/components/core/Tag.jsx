import React from "react";

/**
 * Impacta IA Tag / Pill.
 * Used for country flags, track labels, small metadata chips.
 * tone maps to the three eje accents plus neutral.
 */
export function Tag({ children, tone = "neutral", solid = false, style = {}, ...props }) {
  const tones = {
    neutral: { fg: "var(--text-secondary)", bd: "var(--border-default)", bg: "var(--w-06)" },
    pink: { fg: "var(--pink-300)", bd: "#ed1e7959", bg: "var(--accent-soft)" },
    teal: { fg: "var(--teal-300)", bd: "#1dd2b359", bg: "#1dd2b31a" },
    blue: { fg: "var(--blue-400)", bd: "#6666ff59", bg: "#6666ff1a" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        fontFamily: "var(--font-body)",
        fontWeight: "var(--fw-medium)",
        fontSize: "var(--text-xs)",
        letterSpacing: "0.01em",
        lineHeight: 1,
        padding: "0.4rem 0.7rem",
        borderRadius: "var(--radius-pill)",
        color: solid ? "var(--white)" : t.fg,
        background: solid ? t.fg : t.bg,
        border: `1px solid ${solid ? "transparent" : t.bd}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
