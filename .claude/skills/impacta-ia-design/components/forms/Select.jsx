import React from "react";

/**
 * Impacta IA Select — a custom, fully brand-styled dropdown.
 * Unlike a native <select> (which renders an OS-white option list that
 * breaks the dark theme), this opens a dark popover with hairline border,
 * magenta hover + selected states, and a rotating chevron.
 *
 * Keeps a hidden native <select> in sync so it still works inside a <form>.
 */
export function Select({
  label,
  required = false,
  options = [],
  placeholder = "Seleccione una opción",
  value,
  defaultValue = "",
  onChange,
  name,
  style = {},
  ...props
}) {
  const id = React.useId();
  const rootRef = React.useRef(null);
  const listRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? value : internal;

  const norm = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const selected = norm.find((o) => o.value === current);

  const commit = (val) => {
    if (!isControlled) setInternal(val);
    onChange && onChange({ target: { value: val, name } });
    setOpen(false);
    setFocused(true);
  };

  // close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const openMenu = () => {
    setActive(norm.findIndex((o) => o.value === current));
    setOpen(true);
  };

  const onKeyDown = (e) => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) e.preventDefault();
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) openMenu();
      return;
    }
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown") setActive((i) => Math.min(norm.length - 1, i + 1));
    if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    if ((e.key === "Enter" || e.key === " ") && active >= 0) commit(norm[active].value);
  };

  const ring = open || focused;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }} ref={rootRef}>
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

      {/* hidden native select keeps <form> submission working */}
      <select
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        value={current}
        required={required}
        onChange={() => {}}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      >
        <option value="" disabled>{placeholder}</option>
        {norm.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <div style={{ position: "relative" }}>
        {/* trigger */}
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            textAlign: "left",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: selected ? "var(--text-primary)" : "var(--text-muted)",
            background: "var(--w-04)",
            border: `1px solid ${ring ? "var(--accent)" : "var(--border-default)"}`,
            borderRadius: "var(--radius-sm)",
            padding: "0.8rem 1rem",
            outline: "none",
            cursor: "pointer",
            boxShadow: ring ? "0 0 0 3px var(--accent-soft)" : "none",
            transition: "border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)",
            ...style,
          }}
          {...props}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selected ? selected.label : placeholder}
          </span>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 8,
              height: 8,
              borderRight: "2px solid var(--text-tertiary)",
              borderBottom: "2px solid var(--text-tertiary)",
              transform: open ? "translateY(2px) rotate(-135deg)" : "translateY(-1px) rotate(45deg)",
              transition: "transform var(--dur) var(--ease-out)",
            }}
          />
        </button>

        {/* popover menu */}
        {open && (
          <ul
            ref={listRef}
            role="listbox"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 60,
              listStyle: "none",
              margin: 0,
              padding: "6px",
              maxHeight: "260px",
              overflowY: "auto",
              background: "var(--ink-800)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              animation: "impSelIn var(--dur) var(--ease-out)",
            }}
          >
            <style>{`@keyframes impSelIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>
            {norm.map((o, i) => {
              const isSel = o.value === current;
              const isActive = i === active;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSel}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => { e.preventDefault(); commit(o.value); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: isSel ? "var(--white)" : "var(--text-secondary)",
                    background: isActive ? "var(--accent-soft)" : "transparent",
                    borderRadius: "var(--radius-xs)",
                    padding: "0.6rem 0.7rem",
                    cursor: "pointer",
                    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.label}</span>
                  {isSel && (
                    <span aria-hidden="true" style={{ flexShrink: 0, color: "var(--accent)", fontSize: "0.9rem", lineHeight: 1 }}>✓</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
