import React from "react";

/**
 * Text input with floating label styling used in the pre-registration form.
 * Dark field, hairline border, magenta focus ring.
 */
export function Input({ label, required = false, hint, type = "text", style = {}, ...props }) {
  const id = React.useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--fw-medium)",
            color: "var(--text-secondary)",
          }}
        >
          {label}
          {required && <span style={{ color: "var(--accent)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          color: "var(--text-primary)",
          background: "var(--w-04)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-sm)",
          padding: "0.8rem 1rem",
          outline: "none",
          transition: "border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-soft)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border-default)";
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props}
      />
      {hint && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}
