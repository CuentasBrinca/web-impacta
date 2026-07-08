/* @ds-bundle: {"format":4,"namespace":"ImpactaIADesignSystem_4dab94","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"}],"sourceHashes":{"components/core/Button.jsx":"73e4f6eee66a","components/core/Card.jsx":"a6942fba43ba","components/core/Eyebrow.jsx":"09d03b9c1a58","components/core/Stat.jsx":"f3ef3dfd838c","components/core/Tag.jsx":"1c12e5f97e90","components/forms/Checkbox.jsx":"eee98edc3f87","components/forms/Input.jsx":"c65b14f66cf4","components/forms/Select.jsx":"72249e94c5db","ui_kits/landing/sections-bottom.jsx":"faca761ecd91","ui_kits/landing/sections-top.jsx":"0dc8049e70c5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ImpactaIADesignSystem_4dab94 = window.ImpactaIADesignSystem_4dab94 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Impacta IA Button.
 * Variants: primary (magenta), secondary (outline on dark), ghost, whatsapp.
 * Uses the FH Lecturis Rounded label font, generous pill radius.
 */
function Button({
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
    sm: {
      padding: "0.5rem 1rem",
      fontSize: "0.8125rem",
      gap: "0.4rem"
    },
    md: {
      padding: "0.85rem 1.5rem",
      fontSize: "0.95rem",
      gap: "0.5rem"
    },
    lg: {
      padding: "1.05rem 2rem",
      fontSize: "1.05rem",
      gap: "0.6rem"
    }
  };
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--text-on-accent)",
      border: "1px solid var(--accent)"
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid transparent"
    },
    whatsapp: {
      background: "var(--whatsapp)",
      color: "#04160c",
      border: "1px solid var(--whatsapp)"
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: as === "button" ? disabled : undefined,
    style: {
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
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
      if (variant === "primary" && !disabled) e.currentTarget.style.background = "var(--accent)";
      if (variant === "secondary" && !disabled) e.currentTarget.style.borderColor = "var(--border-strong)";
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === "primary") e.currentTarget.style.background = "var(--accent-hover)";
      if (variant === "secondary") e.currentTarget.style.borderColor = "var(--white)";
    }
  }, props), children, arrow && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: "1.1em",
      lineHeight: 1
    }
  }, "\u2192"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Impacta IA surface Card — dark raised panel with hairline border,
 * optional hover lift and top accent bar. Base for eje / speaker /
 * format / audience cards.
 */
function Card({
  children,
  hover = false,
  accent = null,
  // null | "pink" | "teal" | "blue"
  padding = "var(--space-6)",
  style = {},
  ...props
}) {
  const accents = {
    pink: "var(--pink-500)",
    teal: "var(--teal-500)",
    blue: "var(--blue-400)"
  };
  const bar = accent ? accents[accent] : null;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding,
      overflow: "hidden",
      transition: "transform var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), background var(--dur) var(--ease-out)",
      ...style
    },
    onMouseEnter: e => {
      if (!hover) return;
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.borderColor = "var(--border-strong)";
      e.currentTarget.style.background = "var(--ink-800)";
    },
    onMouseLeave: e => {
      if (!hover) return;
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "var(--border-subtle)";
      e.currentTarget.style.background = "var(--surface-card)";
    }
  }, props), bar && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: "0 0 auto 0",
      height: "3px",
      background: bar
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Eyebrow / section label — the small line that sits above section titles
 * ("El contexto", "Para quién", "Tres ejes · un objetivo").
 */
function Eyebrow({
  children,
  accent = true,
  style = {},
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.6rem",
      fontFamily: "var(--font-lecturis-rounded)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: accent ? "var(--accent)" : "var(--text-tertiary)",
      ...style
    }
  }, props), accent && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: "1.75rem",
      height: "1px",
      background: "currentColor",
      opacity: 0.7
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Big-number statistic block, as seen in the context ("37%", "1 de 5")
 * and organizer ("+15 años") sections.
 */
function Stat({
  value,
  label,
  accent = "pink",
  style = {},
  ...props
}) {
  const accents = {
    pink: "var(--pink-500)",
    teal: "var(--teal-500)",
    blue: "var(--blue-400)",
    white: "var(--white)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
      ...style
    }
  }, props), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--fw-medium)",
      fontSize: "clamp(2.75rem, 6vw, 4rem)",
      lineHeight: 0.95,
      letterSpacing: "var(--tracking-tight)",
      color: accents[accent] || accents.pink
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      lineHeight: "var(--leading-normal)",
      color: "var(--text-secondary)",
      maxWidth: "22ch"
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Impacta IA Tag / Pill.
 * Used for country flags, track labels, small metadata chips.
 * tone maps to the three eje accents plus neutral.
 */
function Tag({
  children,
  tone = "neutral",
  solid = false,
  style = {},
  ...props
}) {
  const tones = {
    neutral: {
      fg: "var(--text-secondary)",
      bd: "var(--border-default)",
      bg: "var(--w-06)"
    },
    pink: {
      fg: "var(--pink-300)",
      bd: "#ed1e7959",
      bg: "var(--accent-soft)"
    },
    teal: {
      fg: "var(--teal-300)",
      bd: "#1dd2b359",
      bg: "#1dd2b31a"
    },
    blue: {
      fg: "var(--blue-400)",
      bd: "#6666ff59",
      bg: "#6666ff1a"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, props), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Checkbox with rich label — used for the privacy-consent line and
 * the "quiero participar como" style toggles.
 */
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  children,
  style = {},
  ...props
}) {
  const id = React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.7rem",
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      lineHeight: "var(--leading-normal)",
      color: "var(--text-secondary)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    style: {
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
      transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
    },
    onInput: e => {
      const on = e.currentTarget.checked;
      e.currentTarget.style.background = on ? "var(--accent)" : "var(--w-04)";
      e.currentTarget.style.borderColor = on ? "var(--accent)" : "var(--border-strong)";
      e.currentTarget.style.backgroundImage = on ? "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>\")" : "none";
      e.currentTarget.style.backgroundSize = "0.8rem";
      e.currentTarget.style.backgroundPosition = "center";
      e.currentTarget.style.backgroundRepeat = "no-repeat";
    }
  }, props)), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input with floating label styling used in the pre-registration form.
 * Dark field, hairline border, magenta focus ring.
 */
function Input({
  label,
  required = false,
  hint,
  type = "text",
  style = {},
  ...props
}) {
  const id = React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.45rem"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-secondary)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      marginLeft: 3
    }
  }, "*")), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-base)",
      color: "var(--text-primary)",
      background: "var(--w-04)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-sm)",
      padding: "0.8rem 1rem",
      outline: "none",
      transition: "border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)",
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = "var(--accent)";
      e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-soft)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = "var(--border-default)";
      e.currentTarget.style.boxShadow = "none";
    }
  }, props)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Impacta IA Select — a custom, fully brand-styled dropdown.
 * Unlike a native <select> (which renders an OS-white option list that
 * breaks the dark theme), this opens a dark popover with hairline border,
 * magenta hover + selected states, and a rotating chevron.
 *
 * Keeps a hidden native <select> in sync so it still works inside a <form>.
 */
function Select({
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
  const norm = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  const selected = norm.find(o => o.value === current);
  const commit = val => {
    if (!isControlled) setInternal(val);
    onChange && onChange({
      target: {
        value: val,
        name
      }
    });
    setOpen(false);
    setFocused(true);
  };

  // close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDoc = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const openMenu = () => {
    setActive(norm.findIndex(o => o.value === current));
    setOpen(true);
  };
  const onKeyDown = e => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) e.preventDefault();
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) openMenu();
      return;
    }
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown") setActive(i => Math.min(norm.length - 1, i + 1));
    if (e.key === "ArrowUp") setActive(i => Math.max(0, i - 1));
    if ((e.key === "Enter" || e.key === " ") && active >= 0) commit(norm[active].value);
  };
  const ring = open || focused;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.45rem"
    },
    ref: rootRef
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-secondary)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      marginLeft: 3
    }
  }, "*")), /*#__PURE__*/React.createElement("select", {
    "aria-hidden": "true",
    tabIndex: -1,
    name: name,
    value: current,
    required: required,
    onChange: () => {},
    style: {
      position: "absolute",
      width: 1,
      height: 1,
      opacity: 0,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), norm.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    id: id,
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    onClick: () => open ? setOpen(false) : openMenu(),
    onKeyDown: onKeyDown,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
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
      ...style
    }
  }, props), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, selected ? selected.label : placeholder), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      width: 8,
      height: 8,
      borderRight: "2px solid var(--text-tertiary)",
      borderBottom: "2px solid var(--text-tertiary)",
      transform: open ? "translateY(2px) rotate(-135deg)" : "translateY(-1px) rotate(45deg)",
      transition: "transform var(--dur) var(--ease-out)"
    }
  })), open && /*#__PURE__*/React.createElement("ul", {
    ref: listRef,
    role: "listbox",
    style: {
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
      animation: "impSelIn var(--dur) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes impSelIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`), norm.map((o, i) => {
    const isSel = o.value === current;
    const isActive = i === active;
    return /*#__PURE__*/React.createElement("li", {
      key: o.value,
      role: "option",
      "aria-selected": isSel,
      onMouseEnter: () => setActive(i),
      onMouseDown: e => {
        e.preventDefault();
        commit(o.value);
      },
      style: {
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
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, o.label), isSel && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flexShrink: 0,
        color: "var(--accent)",
        fontSize: "0.9rem",
        lineHeight: 1
      }
    }, "\u2713"));
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/sections-bottom.jsx
try { (() => {
/* Impacta IA — bottom sections. Depends on sections-top.jsx globals. */
const DSb = window.ImpactaIADesignSystem_4dab94;
const {
  Button: Btn,
  Card: Cd,
  Tag: Tg,
  Eyebrow: Eb,
  Input: In,
  Select: Sel,
  Checkbox: Cb
} = DSb;
const Ct = window.Container,
  STitle = window.SectionTitle,
  IStyles = window.impactaStyles;
const AA = "../../assets";

/* ---------------- Audience ---------------- */
function Audience() {
  const roles = [{
    n: "01",
    role: "CEO / Gerente General",
    tag: "Estrategia",
    body: "Cuándo, cuánto y cómo invertir en IA. Casos de empresas chilenas que ya miden retorno."
  }, {
    n: "02",
    role: "CTO / CIO / CDO",
    tag: "Implementación",
    body: "Arquitecturas, equipos y operación. Del piloto a producción sin morir en el intento."
  }, {
    n: "03",
    role: "Founder / Emprendedor",
    tag: "Construir con IA",
    body: "Vibe-coding, MVPs en semanas y la mecánica de escalar startups nativas IA en 2026."
  }, {
    n: "04",
    role: "Gerente de Personas",
    tag: "Cultura y adopción",
    body: "Reskilling, change management y el rol de RRHH como motor de la transformación."
  }, {
    n: "05",
    role: "Director de Innovación",
    tag: "Adopción a escala",
    body: "Gobernanza, portafolio y la conversación honesta con áreas de negocio."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: IStyles.section,
    id: "para-quien"
  }, /*#__PURE__*/React.createElement(Ct, null, /*#__PURE__*/React.createElement(Eb, null, "Para qui\xE9n"), /*#__PURE__*/React.createElement(STitle, null, "Dise\xF1ado para quienes lideran la transformaci\xF3n."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "1.125rem",
      maxWidth: "48ch",
      marginTop: 18
    }
  }, "400 cupos curados \u2014 un piso de seniority y una mezcla intencional de industrias. Networking entre pares reales."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, roles.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.n,
    style: {
      display: "grid",
      gridTemplateColumns: "56px 1.2fr 1fr",
      gap: 24,
      alignItems: "start",
      padding: "26px 0",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.5rem",
      color: "var(--text-muted)"
    }
  }, r.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.375rem",
      color: "var(--white)"
    }
  }, r.role), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Tg, {
    tone: "pink"
  }, r.tag))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.95rem",
      lineHeight: 1.55,
      margin: 0
    }
  }, r.body))))));
}

/* ---------------- Speakers ---------------- */
function Speakers() {
  const [day, setDay] = React.useState(1);
  const speakers = [{
    img: "speaker-1.webp",
    name: "Stefano Puntoni",
    bio: "Codirector del programa de IA humana de Wharton.",
    flag: "it",
    country: "Italia",
    track: "Innovación",
    tone: "pink"
  }, {
    img: "speaker-2.webp",
    name: "Daniel Strode",
    bio: "Autor de “La ventaja del innovador”. Experto en el futuro del trabajo.",
    flag: "gb",
    country: "Reino Unido",
    track: "Innovación",
    tone: "pink"
  }, {
    img: "speaker-3.webp",
    name: "Jeannette Escudero",
    bio: "Directora Ejecutiva de Talento Digital para Chile.",
    flag: "cl",
    country: "Chile",
    track: "Escalamiento",
    tone: "teal"
  }, {
    img: "speaker-4.webp",
    name: "Nicolás Rivas",
    bio: "Gerente de Soluciones IA en Brinca.",
    flag: "cl",
    country: "Chile",
    track: "Adopción",
    tone: "blue"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...IStyles.section,
      background: "var(--ink-850)",
      borderTop: "1px solid var(--border-subtle)"
    },
    id: "speakers"
  }, /*#__PURE__*/React.createElement(Ct, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eb, null, "Conversaciones reales"), /*#__PURE__*/React.createElement(STitle, null, "Speakers.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      background: "var(--w-06)",
      padding: 5,
      borderRadius: "var(--radius-pill)",
      border: "1px solid var(--border-subtle)"
    }
  }, [1, 2].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDay(d),
    style: {
      fontFamily: "var(--font-lecturis-rounded)",
      fontWeight: 700,
      fontSize: 13,
      padding: "8px 18px",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      border: "none",
      transition: "all .2s",
      background: day === d ? "var(--accent)" : "transparent",
      color: day === d ? "#fff" : "var(--text-secondary)"
    }
  }, "D\xEDa ", d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
      gap: 20,
      marginTop: 44
    }
  }, speakers.map(s => /*#__PURE__*/React.createElement(Cd, {
    key: s.name,
    hover: true,
    padding: "0",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "1/1",
      overflow: "hidden",
      background: "var(--ink-800)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${AA}/speakers/${s.img}`,
    alt: s.name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.25rem",
      color: "var(--white)"
    }
  }, s.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.85rem",
      lineHeight: 1.5,
      margin: "8px 0 14px"
    }
  }, s.bio), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${AA}/flags/${s.flag}.svg`,
    alt: "",
    style: {
      width: 20,
      height: 14,
      borderRadius: 2,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.8rem",
      color: "var(--text-tertiary)"
    }
  }, s.country), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(Tg, {
    tone: s.tone
  }, s.track)))))))));
}

/* ---------------- Format ---------------- */
function Format() {
  const items = [{
    img: "format-1.webp",
    title: "Keynotes con voces internacionales",
    body: "Speakers de referencia mundial en IA aplicada."
  }, {
    img: "format-2.webp",
    title: "Paneles por función ejecutiva",
    body: "Mesas paralelas para CEO, CTO, CFO y Dir. de Innovación."
  }, {
    img: "format-3.webp",
    title: "Challenge Briefs en equipo",
    body: "Grupos curados resuelven un brief real de una empresa chilena."
  }, {
    img: "format-4.webp",
    title: "Talleres de IA",
    body: "Implementaciones que ya funcionan — código y métricas a la vista."
  }, {
    img: "format-5.webp",
    title: "Matchmaking y networking",
    body: "Rondas de conexión dirigida entre empresas, proveedores y startups."
  }, {
    img: "format-6.webp",
    title: "Afterparty: cierre exclusivo",
    body: "Espacio íntimo para cerrar negocios y construir alianzas."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: IStyles.section,
    id: "formato"
  }, /*#__PURE__*/React.createElement(Ct, null, /*#__PURE__*/React.createElement(Eb, null, "El formato"), /*#__PURE__*/React.createElement(STitle, null, "Dos d\xEDas de inmersi\xF3n en IA aplicada."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
      gap: 20,
      marginTop: 48
    }
  }, items.map(it => /*#__PURE__*/React.createElement(Cd, {
    key: it.title,
    hover: true,
    padding: "0",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "16/9",
      overflow: "hidden",
      background: "var(--ink-800)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${AA}/${it.img}`,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.25rem",
      color: "var(--white)",
      lineHeight: 1.15
    }
  }, it.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.9rem",
      lineHeight: 1.5,
      marginTop: 10
    }
  }, it.body)))))));
}

/* ---------------- Organizer ---------------- */
function Organizer() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...IStyles.section,
      background: "var(--ink-850)",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Ct, {
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eb, null, "El organizador"), /*#__PURE__*/React.createElement(STitle, {
    style: {
      maxWidth: "20ch"
    }
  }, "Detr\xE1s de Impacta IA est\xE1 Brinca."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "1.05rem",
      lineHeight: 1.6,
      marginTop: 20,
      maxWidth: "50ch"
    }
  }, "Impacta IA nace en Brinca, la consultora chilena de innovaci\xF3n, estrategia, gesti\xF3n del cambio e inteligencia artificial. Desde 2010 acompa\xF1amos a grandes organizaciones a transformarse con IA aplicada \u2014 combinando creatividad, m\xE9todo y excelencia."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Tg, {
    tone: "pink"
  }, "Creatividad"), /*#__PURE__*/React.createElement(Tg, {
    tone: "blue"
  }, "M\xE9todo"), /*#__PURE__*/React.createElement(Tg, {
    tone: "teal"
  }, "Excelencia")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    as: "a",
    href: "https://www.brinca.com",
    variant: "secondary",
    arrow: true
  }, "Conoce Brinca"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 16
    }
  }, [["+15", "años transformando grandes organizaciones"], ["+50", "empresas acompañadas en su transformación"], ["3", "frentes: estrategia, I+D e inteligencia artificial"]].map(([v, l]) => /*#__PURE__*/React.createElement(Cd, {
    key: v,
    padding: "24px",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "2.5rem",
      color: "var(--pink-500)",
      minWidth: 90
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.95rem"
    }
  }, l))))));
}

/* ---------------- Form ---------------- */
function RegForm() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...IStyles.section,
      position: "relative",
      overflow: "hidden"
    },
    id: "form"
  }, /*#__PURE__*/React.createElement("img", {
    src: `${AA}/bg-photo-5.webp`,
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.18
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,#0e0e10 0%,#0e0e10cc 100%)"
    }
  }), /*#__PURE__*/React.createElement(Ct, {
    style: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "0.9fr 1.1fr",
      gap: 56,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eb, null, "Pre-inscripci\xF3n evento"), /*#__PURE__*/React.createElement(STitle, {
    style: {
      maxWidth: "14ch"
    }
  }, "S\xE9 parte de Impacta IA."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "1.05rem",
      lineHeight: 1.6,
      marginTop: 18,
      maxWidth: "44ch"
    }
  }, "Los cupos son limitados y cuidadosamente seleccionados. Deja tus datos y ser\xE1s el primero en conocer el programa, los speakers y c\xF3mo asegurar tu invitaci\xF3n."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "24px 0 0",
      display: "grid",
      gap: 12
    }
  }, ["Prioridad en la primera ola de invitaciones", "Programa completo y line-up en mayo", "Newsletter mensual con casos chilenos de IA"].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: "flex",
      gap: 12,
      color: "var(--text-secondary)",
      fontSize: "0.95rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--pink-500)"
    }
  }, "\u2192"), t)))), /*#__PURE__*/React.createElement(Cd, {
    padding: "32px"
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "2rem",
      color: "var(--teal-500)"
    }
  }, "\xA1Gracias!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      marginTop: 12
    }
  }, "Recibir\xE1s el programa y los speakers en cuanto se anuncien.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: "grid",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(In, {
    label: "Nombre",
    required: true,
    placeholder: "Nombre y apellido"
  }), /*#__PURE__*/React.createElement(In, {
    label: "Email corporativo",
    type: "email",
    required: true,
    placeholder: "tu@empresa.cl"
  })), /*#__PURE__*/React.createElement(In, {
    label: "Organizaci\xF3n",
    required: true,
    placeholder: "Empresa"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Sel, {
    label: "Nivel de responsabilidad",
    required: true,
    options: ["Gerente General / CEO", "Director(a)", "Gerente", "Jefatura / Líder", "Profesional / Especialista"]
  }), /*#__PURE__*/React.createElement(Sel, {
    label: "\xC1rea",
    required: true,
    options: ["Innovación", "Tecnología (TI)", "Recursos Humanos", "Finanzas", "Operaciones", "Comercial / Ventas"]
  })), /*#__PURE__*/React.createElement(Cb, {
    defaultChecked: true
  }, "Acepto que Brinca trate mis datos conforme a la ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--pink-300)"
    }
  }, "pol\xEDtica de privacidad"), " (Ley 21.719)."), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    size: "lg",
    arrow: true
  }, "Quiero participar")))));
}

/* ---------------- Footer ---------------- */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--ink-900)",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Ct, {
    style: {
      padding: "var(--space-8) var(--gutter) var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "clamp(1.75rem,3.5vw,2.75rem)",
      color: "var(--white)",
      letterSpacing: "var(--tracking-tight)"
    }
  }, "Santiago. 2 y 3 de septiembre 2026."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 30,
      marginTop: 48,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${AA}/logo-horizontal-white.png`,
    alt: "Impacta IA",
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-tertiary)",
      fontSize: "0.85rem",
      lineHeight: 1.55,
      marginTop: 16
    }
  }, "La conferencia de IA para quienes toman decisiones. Un evento de Brinca, con el respaldo de CORFO.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 56,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: ".14em",
      color: "var(--text-muted)",
      fontFamily: "var(--font-lecturis-rounded)",
      fontWeight: 700
    }
  }, "Contacto"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "grid",
      gap: 8,
      color: "var(--text-secondary)",
      fontSize: "0.85rem"
    }
  }, /*#__PURE__*/React.createElement("span", null, "hola@impactaia.cl"), /*#__PURE__*/React.createElement("span", null, "sponsors@impactaia.cl"), /*#__PURE__*/React.createElement("span", null, "prensa@impactaia.cl"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: ".14em",
      color: "var(--text-muted)",
      fontFamily: "var(--font-lecturis-rounded)",
      fontWeight: 700
    }
  }, "S\xEDguenos"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "grid",
      gap: 8,
      color: "var(--text-secondary)",
      fontSize: "0.85rem"
    }
  }, /*#__PURE__*/React.createElement("span", null, "LinkedIn"), /*#__PURE__*/React.createElement("span", null, "Instagram"), /*#__PURE__*/React.createElement("span", null, "Facebook"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      paddingTop: 22,
      borderTop: "1px solid var(--border-subtle)",
      color: "var(--text-muted)",
      fontSize: "0.8rem"
    }
  }, "\xA9 2026 Impacta IA \xB7 Un evento de Brinca")));
}
Object.assign(window, {
  Audience,
  Speakers,
  Format,
  Organizer,
  RegForm,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/sections-bottom.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/sections-top.jsx
try { (() => {
/* Impacta IA — landing page recreation.
   Composes design-system primitives from window.ImpactaIADesignSystem_4dab94.
   Sections are exported to window for index.html to assemble. */
const DS = window.ImpactaIADesignSystem_4dab94;
const {
  Button,
  Card,
  Tag,
  Eyebrow,
  Stat,
  Input,
  Select,
  Checkbox
} = DS;
const A = "../../assets"; // asset base (relative to index.html)

/* ---------------- Shared layout bits ---------------- */
const impactaStyles = {
  container: {
    width: "100%",
    maxWidth: "var(--container)",
    margin: "0 auto",
    padding: "0 var(--gutter)"
  },
  section: {
    padding: "var(--space-10) 0"
  }
};
const Container = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    ...impactaStyles.container,
    ...style
  }
}, children);
const SectionTitle = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("h2", {
  style: {
    fontFamily: "var(--font-display)",
    fontWeight: 500,
    fontSize: "clamp(2rem, 4.2vw, 3rem)",
    lineHeight: 1.05,
    letterSpacing: "var(--tracking-tight)",
    color: "var(--white)",
    margin: "16px 0 0",
    maxWidth: "18ch",
    ...style
  }
}, children);

/* ---------------- Nav ---------------- */
function Nav() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(14px)",
      background: "#0e0e10cc",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 72
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${A}/logo-horizontal-white.png`,
    alt: "Impacta IA",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#form",
    variant: "primary",
    size: "sm",
    arrow: true
  }, "Participar")));
}

/* ---------------- Hero ---------------- */
function Hero() {
  const facts = [{
    big: "02 y 03",
    small: "Septiembre"
  }, {
    big: "Fundación Chile",
    small: "Vitacura, Santiago"
  }, {
    big: "2 días",
    small: "Presencial y gratuito"
  }, {
    big: "+400 cupos",
    small: "Exclusivo C-level"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--ink-900)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${A}/fondo-textura.webp`,
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,#0e0e1099 0%,#0e0e10 92%)"
    }
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: "relative",
      padding: "var(--space-9) var(--gutter) var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Fundaci\xF3n Chile \xB7 2 y 3 septiembre 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: "clamp(2.6rem, 6.5vw, 5.25rem)",
      lineHeight: 0.98,
      letterSpacing: "var(--tracking-tight)",
      color: "var(--white)",
      margin: "20px 0 0",
      maxWidth: "16ch"
    }
  }, "La conferencia de IA para quienes ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--pink-500)"
    }
  }, "toman decisiones"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "clamp(1rem,1.6vw,1.25rem)",
      lineHeight: 1.55,
      color: "var(--text-secondary)",
      maxWidth: "52ch",
      margin: "24px 0 0"
    }
  }, "Un evento para l\xEDderes que est\xE1n definiendo el futuro de sus organizaciones con inteligencia artificial. Dos d\xEDas de inmersi\xF3n en IA aplicada, casos reales y networking estrat\xE9gico."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 14,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#form",
    variant: "primary",
    size: "lg",
    arrow: true
  }, "Quiero participar"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "#form",
    variant: "secondary",
    size: "lg"
  }, "Ser sponsor")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
      gap: 1,
      marginTop: 56,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, facts.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "22px 0",
      borderRight: i < 3 ? "1px solid var(--border-subtle)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.5rem",
      color: "var(--white)"
    }
  }, f.big), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.85rem",
      color: "var(--text-tertiary)",
      marginTop: 4
    }
  }, f.small))))));
}

/* ---------------- Partners strip ---------------- */
function Partners() {
  const org = ["brinca.svg", "chile-global-ventures.png", "corfo.png"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--ink-850)"
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 40,
      padding: "26px var(--gutter)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-lecturis-rounded)",
      fontWeight: 700,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: ".14em",
      color: "var(--text-muted)"
    }
  }, "Organizan"), org.map(p => /*#__PURE__*/React.createElement("img", {
    key: p,
    src: `${A}/partners/${p}`,
    alt: "",
    style: {
      height: 26,
      opacity: 0.85
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 24,
      fontFamily: "var(--font-lecturis-rounded)",
      fontWeight: 700,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: ".14em",
      color: "var(--text-muted)"
    }
  }, "Media partner"), /*#__PURE__*/React.createElement("img", {
    src: `${A}/partners/diario-financiero.png`,
    alt: "",
    style: {
      height: 22,
      opacity: 0.85
    }
  })));
}

/* ---------------- Context ---------------- */
function Context() {
  return /*#__PURE__*/React.createElement("section", {
    style: impactaStyles.section
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Eyebrow, null, "El contexto"), /*#__PURE__*/React.createElement(SectionTitle, {
    style: {
      maxWidth: "22ch"
    }
  }, "La IA est\xE1 transformando todas las industrias."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "1.125rem",
      lineHeight: 1.55,
      maxWidth: "46ch",
      marginTop: 18
    }
  }, "Pero en Chile, la adopci\xF3n empresarial apenas comienza. Impacta IA re\xFAne a quienes est\xE1n cerrando esa brecha."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: 40,
      marginTop: 56
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "37%",
    label: "de empresas chilenas usa IA de forma sistem\xE1tica"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "1 de 5",
    label: "proyectos de IA llega a producci\xF3n",
    accent: "teal"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "84%",
    label: "de los CEO ve la IA como prioridad estrat\xE9gica",
    accent: "blue"
  }))));
}

/* ---------------- Ejes ---------------- */
function Ejes() {
  const ejes = [{
    n: "01",
    icon: "icon-innovar.png",
    title: "Innovar",
    accent: "pink",
    tag: "Emprender con IA",
    body: "Startups, MVPs y la práctica del vibe-coding. Cómo construir productos nuevos sobre modelos generativos en 2026."
  }, {
    n: "02",
    icon: "icon-adoptar.png",
    title: "Adoptar",
    accent: "blue",
    tag: "IA en la empresa",
    body: "Casos reales, paneles por función y mediciones concretas de ROI. Para equipos dando sus primeros pasos con IA generativa."
  }, {
    n: "03",
    icon: "icon-escalar.png",
    title: "Escalar",
    accent: "teal",
    tag: "IA con I+D",
    body: "Supercómputo, Ley I+D, datasets nacionales y la infraestructura que sostiene la IA a escala industrial."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...impactaStyles.section,
      background: "var(--ink-850)",
      borderTop: "1px solid var(--border-subtle)",
      borderBottom: "1px solid var(--border-subtle)"
    },
    id: "ejes"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Eyebrow, null, "Tres ejes \xB7 un objetivo"), /*#__PURE__*/React.createElement(SectionTitle, null, "Innova. Adopta. Escala."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "1.125rem",
      maxWidth: "48ch",
      marginTop: 18
    }
  }, "Que la IA funcione en tu empresa. Tres tracks paralelos durante dos d\xEDas \u2014 escoge tu camino o cruza entre ellos."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
      gap: 20,
      marginTop: 48
    }
  }, ejes.map(e => /*#__PURE__*/React.createElement(Card, {
    key: e.n,
    hover: true,
    accent: e.accent,
    padding: "28px"
  }, /*#__PURE__*/React.createElement("img", {
    src: `${A}/${e.icon}`,
    alt: "",
    style: {
      height: 64,
      width: 64,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.75rem",
      color: "var(--white)"
    }
  }, e.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-lecturis-rounded)",
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".14em",
      color: `var(--eje-${e.title.toLowerCase() === "innovar" ? "innovar" : e.title.toLowerCase() === "adoptar" ? "adoptar" : "escalar"})`
    }
  }, "EJE ", e.n)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: e.accent
  }, e.tag)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: "0.95rem",
      lineHeight: 1.55,
      marginTop: 16
    }
  }, e.body))))));
}
Object.assign(window, {
  Nav,
  Hero,
  Partners,
  Context,
  Ejes,
  Container,
  SectionTitle,
  impactaStyles
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/sections-top.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

})();
