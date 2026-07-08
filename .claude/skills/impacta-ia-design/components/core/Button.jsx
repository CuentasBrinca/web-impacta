import React from "react";

/**
 * Impacta IA Button.
 * Variants: primary (magenta), secondary (outline on dark), ghost, whatsapp.
 * Uses the FH Lecturis Rounded label font, generous pill radius.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  disabled = false,
  as = "button",
  style = {},
  ...props
}) {
  const sizes = {
    sm: { padding: "0.5rem 1rem", fontSize: "0.8125rem", gap: "0.4rem" },
    md: { padding: "0.85rem 1.5rem", fontSize: "0.95rem", gap: "0.5rem" },
    lg: { padding: "1.05rem 2rem", fontSize: "1.05rem", gap: "0.6rem" },
  };

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--text-on-accent)",
      border: "1px solid var(--accent)",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid transparent",
    },
    whatsapp: {
      background: "var(--whatsapp)",
      color: "#04160c",
      border: "1px solid var(--whatsapp)",
    },
  };

  const Tag = as;
  return (
    <Tag
      disabled={as === "button" ? disabled : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizes[size].gap,
        fontFamily: "var(--font-lecturis-rounded)",
        fontWeight: "var(--fw-bold)",
        letterSpacing: "0.01em",
        lineHeight: 1,
        textDecoration: "none",
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "transform var(--dur-fast) var(--ease-out), background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)",
        whiteSpace: "nowrap",
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        if (variant === "primary" && !disabled) e.currentTarget.style.background = "var(--accent)";
        if (variant === "secondary" && !disabled) e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "primary") e.currentTarget.style.background = "var(--accent-hover)";
        if (variant === "secondary") e.currentTarget.style.borderColor = "var(--white)";
      }}
      {...props}
    >
      {children}
      {arrow && <span aria-hidden="true" style={{ fontSize: "1.1em", lineHeight: 1 }}>→</span>}
    </Tag>
  );
}
