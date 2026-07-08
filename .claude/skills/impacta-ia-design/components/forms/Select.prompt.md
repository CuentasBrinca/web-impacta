One-sentence: Fully brand-styled custom dropdown — dark popover, magenta hover/selected states, rotating chevron — replacing the OS-white native menu, for the form's role/area/participation selectors.

```jsx
<Select label="Área a la que pertenece" required
  options={["Recursos Humanos","Tecnología (TI)","Innovación","Finanzas"]} />

// controlled
<Select value={area} onChange={(e) => setArea(e.target.value)} options={opts} />
```

Trigger matches `Input` (fill, hairline border, magenta focus glow); clicking opens a dark `--ink-800` panel with hairline border and shadow — options highlight with `accent-soft` on hover/keyboard, the selected row shows a magenta ✓. Chevron rotates open/closed. Pass `options` as strings or `{value,label}`; `placeholder` is the empty state. Works controlled (`value`) or uncontrolled (`defaultValue`); a hidden native `<select>` keeps it submitting inside a `<form>`. Keyboard: ↑/↓ to move, Enter/Space to pick, Esc to close, click-outside to dismiss.
