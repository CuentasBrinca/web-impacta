import React from "react";

/**
 * Big-number statistic block, as seen in the context ("37%", "1 de 5")
 * and organizer ("+15 años") sections.
 */
export function Stat({ value, label, accent = "pink", style = {}, ...props }) {
  const accents = {
    pink: "var(--pink-500)",
    teal: "var(--teal-500)",
    blue: "var(--blue-400)",
    white: "var(--white)",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", ...style }} {...props}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--fw-medium)",
          fontSize: "clamp(2.75rem, 6vw, 4rem)",
          lineHeight: 0.95,
          letterSpacing: "var(--tracking-tight)",
          color: accents[accent] || accents.pink,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-normal)",
          color: "var(--text-secondary)",
          maxWidth: "22ch",
        }}
      >
        {label}
      </span>
    </div>
  );
}
