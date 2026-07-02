---
name: tailwind-v4-font-family-arbitrary
description: In this project's Tailwind v4, font-family via arbitrary var must use the family-name hint
metadata:
  type: project
---

En este proyecto (Tailwind v4), `font-[var(--font-display)]` es AMBIGUO y compila a `font-weight`, no a `font-family` — la fuente nunca se aplica. Hay que usar el hint explícito: `font-[family-name:var(--font-display)]` (o el utility generado del token, p. ej. `font-display`).

**Why:** el 2026-07-02, tras agregar Funnel Display, los títulos no cambiaban de fuente. Los 74 usos en 19 componentes tenían `font-[var(--font-*)]` roto desde antes.

**How to apply:** al escribir clases de fuente con variables CSS, siempre `font-[family-name:var(--font-...)]`. Tokens en [[globals.css]]: `--font-display` (títulos, empieza por Funnel Display), `--font-body`, `--font-display-rounded`.
