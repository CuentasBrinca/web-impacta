/**
 * Single source of truth for landing copy + data.
 * Edit here → commit → Vercel redeploys automatically.
 *
 * BLOCKER pre-launch: stats below are placeholders. Replace with real
 * figures from the Brinca/Impacta IA Chile adoption study before go-live.
 */

export const event = {
  name: "Impacta IA",
  edition: "Primera edición · 2026",
  city: "Santiago, Chile",
  monthYear: "Septiembre 2026",
  format: "2 días · presencial",
  capacity: "400 — exclusivo C-level",
  contact: {
    general: "hola@impactaia.cl",
    sponsors: "sponsors@impactaia.cl",
    press: "prensa@impactaia.cl",
  },
} as const;

export const navItems = [
  { label: "El evento", href: "#evento" },
  { label: "Ejes", href: "#ejes" },
  { label: "Para quién", href: "#para-quien" },
  { label: "Partners", href: "#partners" },
] as const;

/**
 * Logos go in /public/img/partners/. Aspect ratios vary, so each entry
 * declares its intrinsic width/height — the layout normalizes by height.
 * Set logo: null to render a text wordmark fallback (used until the asset
 * arrives).
 */
export type Partner = {
  readonly name: string;
  readonly note: string;
  readonly logo: string | null;
  readonly width?: number;
  readonly height?: number;
};

export const partners: readonly Partner[] = [
  {
    name: "CORFO",
    note: "Respaldo institucional",
    logo: "/img/partners/corfo.png",
    width: 904, height: 282,
  },
  {
    // PENDING: drop /img/partners/brinca.png + /img/partners/brinca-black.png
    // and update logo path here.
    name: "Brinca",
    note: "Organizador",
    logo: null,
  },
  {
    name: "Chile Global Ventures",
    note: "Red diáspora tech",
    logo: "/img/partners/chile-global-ventures.svg",
    width: 2142, height: 755,
  },
  {
    name: "SCAI-Lab",
    note: "Centro de IA",
    logo: null, // pendiente — confirmado por user que aún no tiene logo
  },
  {
    name: "Universidad Adolfo Ibáñez",
    note: "Dirección de Innovación",
    logo: "/img/partners/uai.png",
    width: 1920, height: 480,
  },
  {
    name: "Diario Financiero",
    note: "Media partner",
    logo: "/img/partners/diario-financiero.png",
    width: 1200, height: 630,
  },
];

// PLACEHOLDER — replace with real data from the Chile AI adoption study
export const problemaStats = [
  { num: "37%",   lbl: "de empresas chilenas usa IA de forma sistemática", color: "var(--color-blue-500)" },
  { num: "1 de 5", lbl: "proyectos de IA llega a producción",               color: "var(--color-mint-500)" },
  { num: "84%",   lbl: "de los CEO ve la IA como prioridad estratégica",   color: "var(--color-pink-500)" },
] as const;

export const ejes = [
  {
    id: "innovar",
    n: "01",
    title: "Innovar",
    sub: "Emprender con IA",
    desc:
      "Startups, MVPs y la práctica del vibe-coding. Cómo construir productos nuevos sobre modelos generativos en 2026.",
    icon: "/img/icon-innovar.png",
    color: "#B11362",
    tint: "var(--color-pink-100)",
    tags: ["Startups IA", "Vibe-coding", "Producto"],
  },
  {
    id: "adoptar",
    n: "02",
    title: "Adoptar",
    sub: "IA en la empresa",
    desc:
      "Casos reales, paneles por función y mediciones concretas de ROI. Para equipos que están dando los primeros pasos con IA generativa.",
    icon: "/img/icon-adoptar.png",
    color: "var(--color-blue-500)",
    tint: "var(--color-blue-100)",
    tags: ["Casos reales", "ROI por función", "Change management"],
  },
  {
    id: "escalar",
    n: "03",
    title: "Escalar",
    sub: "Con I+D",
    desc:
      "Supercómputo, Ley I+D, datasets nacionales y la infraestructura que sostiene la IA a escala industrial.",
    icon: "/img/icon-escalar.png",
    color: "#0F8A75",
    tint: "var(--color-mint-100)",
    tags: ["Supercómputo", "Ley I+D", "Datasets"],
  },
] as const;

export const profiles = [
  {
    role: "CEO / Gerente General",
    what: "Estrategia",
    desc: "Cuándo, cuánto y cómo invertir en IA. Casos de empresas chilenas que ya están midiendo retorno.",
  },
  {
    role: "CTO / CIO / CDO",
    what: "Implementación",
    desc: "Arquitecturas, equipos y operación. Del piloto a producción sin morir en el intento.",
  },
  {
    role: "Founder / Emprendedor",
    what: "Construir con IA",
    desc: "Vibe-coding, MVPs en semanas y la mecánica de escalar startups nativas IA en 2026.",
  },
  {
    role: "Gerente de Personas / Transformación",
    what: "Cultura y adopción",
    desc: "Cómo lograr que la IA se use de verdad. Reskilling, change management y el rol de RRHH como motor de la transformación.",
  },
  {
    role: "Director de Innovación",
    what: "Adopción a escala",
    desc: "Gobernanza, portafolio y la conversación honesta con áreas de negocio.",
  },
] as const;

export const numeros = [
  { num: 400, suffix: "",  lbl: "ejecutivos C-level", note: "Curados, exclusivo" },
  { num: 12,  suffix: "+", lbl: "industrias",         note: "Banca, retail, salud, minería..." },
  { num: 3,   suffix: "",  lbl: "ejes temáticos",     note: "Adoptar · Escalar · Innovar" },
  { num: 2,   suffix: "",  lbl: "días de inmersión",  note: "Septiembre 2026" },
] as const;

export const programa = [
  { tag: "Keynotes",          title: "Voces internacionales", desc: "Speakers de referencia mundial en IA aplicada — anuncios en mayo." },
  { tag: "Paneles",           title: "Por función ejecutiva", desc: "Mesas paralelas para CEO, CTO, CFO y Dir. de Innovación. Sin teoría, casos reales." },
  { tag: "Challenge briefs",  title: "Trabajo en equipos",    desc: "Grupos curados resuelven un brief real de una empresa chilena." },
  { tag: "Demos",             title: "IA en vivo",            desc: "Implementaciones que ya están funcionando — código y métricas a la vista." },
  { tag: "Networking",        title: "Mesas C-level",         desc: "Cenas curadas por industria. Solo decision-makers, sin observadores." },
  { tag: "Afterparty",        title: "Cierre exclusivo",      desc: "Espacio íntimo para cerrar negocios y construir alianzas." },
] as const;

export const formInteresOptions = ["Asistir", "Speaker", "Sponsor", "Media"] as const;
export type FormInteres = (typeof formInteresOptions)[number];

export const formBenefits = [
  { dot: "var(--color-mint-500)", txt: "Prioridad para asegurar tu cupo en la primera ola de invitaciones" },
  { dot: "var(--color-blue-300)", txt: "Programa completo y line-up de speakers en mayo" },
  { dot: "var(--color-pink-500)", txt: "Newsletter mensual con casos chilenos de IA" },
] as const;

/**
 * Footer link `intent` flags the Footer to render this entry as a button
 * that pre-selects a form interest before scrolling — surfaces a clearer
 * path for sponsors / media reaching out.
 */
export type FooterLink = {
  readonly t: string;
  readonly a: string;
  readonly intent?: FormInteres;
};

export const footerColumns: ReadonlyArray<{ readonly h: string; readonly l: ReadonlyArray<FooterLink> }> = [
  {
    h: "El evento",
    l: [
      { t: "Pre-regístrate", a: "#form" },
      { t: "Los 3 ejes",     a: "#ejes" },
      { t: "Para quién",     a: "#para-quien" },
      { t: "Quiero ser sponsor",  a: "#form", intent: "Sponsor" },
      { t: "Soy media",           a: "#form", intent: "Media" },
    ],
  },
  {
    h: "Contacto",
    l: [
      { t: event.contact.general,  a: `mailto:${event.contact.general}` },
      { t: event.contact.sponsors, a: `mailto:${event.contact.sponsors}` },
      { t: event.contact.press,    a: `mailto:${event.contact.press}` },
    ],
  },
  {
    h: "Síguenos",
    l: [
      { t: "LinkedIn",     a: "#" },
      { t: "Twitter / X",  a: "#" },
      { t: "YouTube",      a: "#" },
    ],
  },
];
