# Impacta IA — Design System

A design system reverse-engineered from the live production build of **[impactaia.cl](https://www.impactaia.cl/)** — the marketing site for **Impacta IA**, the first AI conference for C-suite executives in Chile.

- **Event:** Impacta IA · Fundación Chile, Vitacura, Santiago · 2–3 September 2026 · +400 curated C-level seats.
- **Organizer:** [Brinca](https://www.brinca.com/) — a Chilean innovation, strategy, change-management and AI consultancy (est. 2010).
- **Language:** Chilean Spanish (es-CL).

## Sources
Everything here was extracted directly from the live site (no Figma or codebase was provided):
- Copy + structure: `https://www.impactaia.cl/`
- Fonts, colors, images: pulled from the site's compiled CSS and `/img` + `/_next/static/media` assets.

If a codebase or Figma file exists internally, attach it and this system can be tightened against the true source of record.

---

## CONTENT FUNDAMENTALS

**Language & voice.** Chilean Spanish, executive register. Confident, concise, a little provocative. Speaks peer-to-peer with senior leaders — never salesy, never hype for its own sake.

**Address.** Uses **tú** ("tu empresa", "escoge tu camino", "Deja tus datos"). Institutional "we" for the organizer ("acompañamos", "reúne a quienes…"). The reader is always a decision-maker.

**Tone traits.**
- *Declarative & punchy* — short statements, frequent periods. "Innova. Adopta. Escala." · "La IA para quienes toman decisiones."
- *Numbers as arguments* — "37%", "1 de 5", "+400 cupos", "+15 años". Stats carry the persuasion.
- *Honest, not utopian* — "en Chile, la adopción empresarial apenas comienza" · "del piloto a producción sin morir en el intento."
- *Curated exclusivity* — "cupos limitados", "curados", "mezcla intencional", "entre pares reales".

**Casing.** Sentence case for headlines and body. Eyebrows/labels in **UPPERCASE** with wide tracking ("EL CONTEXTO", "EJE 01", "PARA QUIÉN"). Titles keep normal capitalization.

**Punctuation quirks.** The middot `·` is a signature separator ("Tres ejes · un objetivo", "Fundación Chile · Santiago"). CTAs almost always carry a trailing arrow **→** ("Quiero participar →"). Em-dashes for asides.

**Emoji:** none. **Anglicisms** are welcome and untranslated where they're the industry term: *vibe-coding, MVP, keynote, matchmaking, networking, challenge brief, afterparty, reskilling, change management*.

**Examples to echo:**
- Eyebrow → title → one-sentence lead is the standard section opener.
- "Que la IA funcione en tu empresa."
- "Diseñado para quienes lideran la transformación."

---

## VISUAL FOUNDATIONS

**Overall vibe.** Dark, editorial, high-contrast. A near-black canvas with three luminous accents and generous negative space — feels like a premium tech-conference / editorial hybrid, not a typical SaaS landing page.

**Color.** Surfaces are a tight near-black ladder (`#0E0E10` page → `#161618` raised → `#18181A` card). Three brand accents form the signature **connected-node network**: **magenta `#ED1E79`** (primary), **teal `#1DD2B3`**, **electric blue `#6666FF`**. The three map 1:1 to the three "ejes" (Innovar=pink, Adoptar=blue, Escalar=teal). Text is white rendered through an alpha ladder (100/70/50/35%) rather than gray hexes. Accents are used sparingly — one magenta headline word, one colored top-bar per card — never as fills across large areas.

**Typography.**
- **Funnel Display** (Google Fonts, variable 300–800) — big display headlines & statements, tight −0.03em tracking, ~1.0 leading.
- **FH Lecturis** + **FH Lecturis Rounded** (proprietary, subset) — brand wordmark and uppercase eyebrows/labels/buttons.
- **Google Sans Flex** (300–900) — all body and UI text, 1.5–1.6 leading.

**Spacing & layout.** 4px base scale; sections breathe at 96–128px vertical rhythm. Max content width ~1200px, fluid gutter `clamp(1.25rem, 4vw, 4rem)`. Hairline dividers (`rgba(255,255,255,0.10)`) separate fact rows and list items rather than boxes.

**Backgrounds.** Full-bleed **node-network texture** (`fondo-textura.webp`) behind the hero at ~50% opacity, faded into the page with a protection gradient. A dim photographic background (`bg-photo-5.webp`, ~18% opacity) sits behind the form. Otherwise flat near-black — no gradients as decoration, no repeating patterns beyond the node motif.

**Cards.** Dark surface (`#18181A`), 1px hairline border (`white 10%`), **24px** radius (`--radius-lg`), no drop shadow at rest. Optional **3px colored top bar** to code the ejes. Hover = −4px lift + border brighten to 25% + surface lightens one step. Media cards go edge-to-edge (image, then padded text).

**Buttons.** Full **pill** radius, FH Lecturis Rounded Bold. Primary = solid magenta (hover → lighter `#F14B94`); secondary = transparent with white-alpha border that brightens to white on hover; ghost = text-only. Press = scale 0.97. Trailing → arrow is common.

**Radii.** xs 6 · sm 10 (inputs) · md 16 · lg 24 (cards) · xl 32 · pill (buttons/tags).

**Borders & shadows.** Borders do the structural work (hairline white-alpha). Shadows are minimal on dark; accent **glow** (`0 12px 40px #ed1e7933`) is reserved for emphasis. Inputs use a magenta focus ring (`0 0 0 3px` at 10% pink).

**Transparency & blur.** Sticky nav uses `backdrop-filter: blur(14px)` over `#0e0e10cc`. Tints (accent-soft, white-alpha fills) create depth without new colors.

**Motion.** Restrained. `cubic-bezier(0.22,1,0.36,1)` ease-out, 140–240ms. Fades and small lifts/translations; button press-scale. No bounces, no infinite decorative loops.

**Imagery vibe.** Photography is contemporary, cool-toned, real (speakers, event moments). The eje icons are soft 3D "blob" renders tinted to each accent. Partner logos are monochrome/white on dark.

---

## ICONOGRAPHY

- **No general-purpose icon set** ships with the brand. The site leans on **typographic glyphs** instead of an icon library.
- **Arrows** are the workhorse: the Unicode **→ (U+2192)** appears on nearly every CTA and list bullet. **↗** is used for external links.
- The **middot `·`** functions as a decorative/structural glyph throughout.
- **Eje icons** are three bespoke soft-3D **blob PNGs** (`icon-innovar.png` pink, `icon-adoptar.png` blue, `icon-escalar.png` teal) — copied into `/assets`. Treat these as brand illustrations, not a scalable icon system.
- **Flags** are small SVGs (`assets/flags/{cl,gb,it}.svg`) used as country markers on speaker cards.
- **Emoji:** never used.
- If a UI needs line icons, add a CDN set with a **light stroke** (e.g. Lucide at ~1.5px) to sit alongside Funnel Display — flagged as an addition, since the source ships none.

---

## Index / Manifest

**Root**
- `styles.css` — global entry point (import this). `@import`s the four token files below.
- `readme.md` — this file.
- `SKILL.md` — Agent-Skills wrapper.

**Tokens** (`tokens/`)
- `fonts.css` — `@font-face` for Funnel Display, Google Sans Flex, FH Lecturis, FH Lecturis Rounded.
- `colors.css` — palette + semantic aliases (surfaces, text, accents, eje mapping).
- `typography.css` — families, weights, scale, tracking, leading.
- `spacing.css` — spacing scale, radii, shadows, motion, layout.

**Components** (`components/`) — React primitives, exported on `window.ImpactaIADesignSystem_4dab94`:
- `core/` — **Button**, **Tag**, **Eyebrow**, **Stat**, **Card**
- `forms/` — **Input**, **Select**, **Checkbox**

**UI Kits** (`ui_kits/`)
- `landing/` — full click-through recreation of the Impacta IA landing page.

**Foundation cards** (`guidelines/`) — specimen cards for the Design System tab (Colors, Type, Spacing, Brand).

**Assets** (`assets/`) — logos, node texture, eje icons, speaker photos, format thumbnails, partner logos, flags; `assets/fonts/` holds the font binaries.

---

## CAVEATS
- **FH Lecturis / FH Lecturis Rounded are proprietary and were shipped by the site as tiny character subsets** (only glyphs used on the page). They will be missing characters in new copy. Funnel Display and Google Sans Flex are complete. **Replace the FH Lecturis files with full licensed versions** for production use.
- No logo was designed — the real horizontal wordmark PNG from the site is used as-is.
- Component inventory was inferred from the landing page (no component library was provided), so it is a sensible brand-fit set rather than an exhaustive product library.
