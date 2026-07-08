import React from "react";

/**
 * Eyebrow / section label — the small line that sits above section titles
 * ("El contexto", "Para quién", "Tres ejes · un objetivo").
 */
export function Eyebrow({ children, accent = true, style = {}, ...props }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        fontFamily: "var(--font-lecturis-rounded)",
        fontWeight: "var(--fw-bold)",
        fontSize: "var(--text-xs)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-label)",
        color: accent ? "var(--accent)" : "var(--text-tertiary)",
        ...style,
      }}
      {...props}
    >
      {accent && (
        <span
          aria-hidden="true"
          style={{ width: "1.75rem", height: "1px", background: "currentColor", opacity: 0.7 }}
        />
      )}
      {children}
    </span>
  );
}
