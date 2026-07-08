<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design System

This project has an official design system: **Impacta IA Design System**, installed as a skill at
`.claude/skills/impacta-ia-design/`. Any UI work (pages, components, styles, mocks, artifacts) MUST follow it.

Invoke it with `/impacta-ia-design`, or read `.claude/skills/impacta-ia-design/readme.md` for the brand
foundations (colors, type, spacing, components). Tokens live in `tokens/`, React primitives in `components/`.
Do not introduce new colors, fonts, or component patterns that aren't in the system.
