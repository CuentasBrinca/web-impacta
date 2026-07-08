import React from "react";

/**
 * Impacta IA surface Card — dark raised panel with hairline border,
 * optional hover lift and top accent bar. Base for eje / speaker /
 * format / audience cards.
 */
export function Card({
  children,
  hover = false,
  accent = null,   // null | "pink" | "teal" | "blue"
  padding = "var(--space-6)",
  style = {},
  ...props
}) {
  const accents = { pink: "var(--pink-500)", teal: "var(--teal-500)", blue: "var(--blue-400)" };
  const bar = accent ? accents[accent] : null;
  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding,
        overflow: "hidden",
        transition: "transform var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), background var(--dur) var(--ease-out)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "var(--border-strong)";
        e.currentTarget.style.background = "var(--ink-800)";
      }}
      onMouseLeave={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.background = "var(--surface-card)";
      }}
      {...props}
    >
      {bar && (
        <span
          aria-hidden="true"
          style={{ position: "absolute", inset: "0 0 auto 0", height: "3px", background: bar }}
        />
      )}
      {children}
    </div>
  );
}
