# Impacta IA — Landing UI Kit

A high-fidelity, click-through recreation of **impactaia.cl**, the marketing site for the Impacta IA conference (Brinca, Santiago · Sep 2026).

## Files
- `index.html` — assembles the full page and mounts it. Loads `styles.css` + `_ds_bundle.js`, then the two section files.
- `sections-top.jsx` — `Nav`, `Hero`, `Partners`, `Context`, `Ejes` (+ shared `Container`, `SectionTitle`).
- `sections-bottom.jsx` — `Audience`, `Speakers` (Día 1/2 tabs), `Format`, `Organizer`, `RegForm` (submits to a thank-you state), `Footer`.

## Composition
Every section is built from the design-system primitives — `Button`, `Card`, `Tag`, `Eyebrow`, `Stat`, `Input`, `Select`, `Checkbox` — pulled from `window.ImpactaIADesignSystem_4dab94`. No primitive is re-implemented here.

## Interactions
- **Speakers**: Día 1 / Día 2 segmented toggle.
- **Pre-registration form**: client-side submit swaps the card to a "¡Gracias!" confirmation.
- Sticky blurred nav; smooth-scroll anchors (`#form`, `#ejes`, `#para-quien`).

## Assets
Real imagery pulled from the live site lives in `/assets` (logo, node texture, eje blob icons, speaker photos, format thumbnails, partner logos, flags). Paths are relative (`../../assets/...`).
