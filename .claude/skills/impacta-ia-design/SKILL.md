---
name: impacta-ia-design
description: Use this skill to generate well-branded interfaces and assets for Impacta IA (the C-suite AI conference by Brinca, Chile), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference
- **Global CSS:** link `styles.css` (imports all tokens + `@font-face`).
- **Components:** load `_ds_bundle.js`, then `const { Button, Card, Tag, Eyebrow, Stat, Input, Select, Checkbox } = window.ImpactaIADesignSystem_4dab94`.
- **Vibe:** dark near-black canvas (`#0E0E10`), magenta `#ED1E79` primary, teal `#1DD2B3` + electric blue `#6666FF` as the three-eje accents. Funnel Display for headlines, Google Sans Flex for body. Pill buttons, 24px hairline-bordered cards, uppercase eyebrows, trailing → on CTAs. Chilean Spanish, `·` separators, no emoji.
- **Fonts caveat:** FH Lecturis (Rounded) are proprietary subsets — replace with full files for production.
