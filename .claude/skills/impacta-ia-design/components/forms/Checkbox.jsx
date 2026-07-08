import React from "react";

/**
 * Checkbox with rich label — used for the privacy-consent line and
 * the "quiero participar como" style toggles.
 */
export function Checkbox({ checked, defaultChecked, onChange, children, style = {}, ...props }) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.7rem",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        lineHeight: "var(--leading-normal)",
        color: "var(--text-secondary)",
        ...style,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          flexShrink: 0,
          width: "1.15rem",
          height: "1.15rem",
          marginTop: "0.1rem",
          borderRadius: "5px",
          border: "1px solid var(--border-strong)",
          background: "var(--w-04)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
        }}
        onInput={(e) => {
          const on = e.currentTarget.checked;
          e.currentTarget.style.background = on ? "var(--accent)" : "var(--w-04)";
          e.currentTarget.style.borderColor = on ? "var(--accent)" : "var(--border-strong)";
          e.currentTarget.style.backgroundImage = on
            ? "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>\")"
            : "none";
          e.currentTarget.style.backgroundSize = "0.8rem";
          e.currentTarget.style.backgroundPosition = "center";
          e.currentTarget.style.backgroundRepeat = "no-repeat";
        }}
        {...props}
      />
      <span>{children}</span>
    </label>
  );
}
