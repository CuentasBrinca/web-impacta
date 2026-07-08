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
  dates: "2 y 3 de septiembre 2026",
  venue: "Fundación Chile",
  venueAddress: "Av. Parque Antonio Rabat Sur 6165, Vitacura, Santiago",
  format: "2 días · presencial",
  capacity: "400 — exclusivo C-level",
  contact: {
    general: "hola@impactaia.cl",
    sponsors: "sponsors@impactaia.cl",
    press: "prensa@impactaia.cl",
  },
} as const;

// Anclas root-relative (`/#…`) para que la nav funcione también desde las
// páginas legales (/terminos, /privacidad, /codigo-etica): llevan a la home
// y bajan a la sección. En la home son scroll suave sin recargar.
export const navItems = [
  { label: "El evento", href: "/#evento" },
  { label: "Ejes temáticos", href: "/#ejes" },
  { label: "Para quién", href: "/#para-quien" },
  { label: "Speakers", href: "/#speakers" },
  { label: "Formatos", href: "/#formatos" },
] as const;

/**
 * Brinca es el ORGANIZADOR del evento — no un patrocinador. Se trata aparte
 * de `partners` (que son respaldos) para no diluir su rol en la grilla.
 * Fuente única de los datos de marca de Brinca en el sitio.
 *
 * - `logoDark`  → sobre fondos claros (BackedBy, bloque "Detrás de…").
 * - `logoLight` → sobre fondos oscuros (footer).
 * - `url`       → con UTM para atribuir el tráfico que Impacta IA deriva a Brinca.
 *
 * Copy y datos verificados en https://www.brinca.com (jun 2026).
 */
export const organizer = {
  name: "Brinca",
  url: "https://www.brinca.com/?utm_source=impactaia&utm_medium=referral&utm_campaign=impacta-ia-2026",
  logoDark: "/img/partners/brinca.svg",
  logoLight: "/img/partners/brinca-white.svg",
  width: 136,
  height: 37,
  tagline: "Atrévete a dar el salto.",
  blurb:
    "Impacta IA nace en Brinca, la consultora chilena de innovación, estrategia, gestión del cambio e inteligencia artificial. Desde 2010 acompañamos a grandes organizaciones a transformarse con IA aplicada — combinando creatividad, método y excelencia.",
  pillars: ["Creatividad", "Método", "Excelencia"] as const,
  stats: [
    { num: "+15", lbl: "años transformando grandes organizaciones" },
    { num: "+50", lbl: "empresas acompañadas en su transformación" },
    { num: "3", lbl: "frentes: estrategia, I+D e inteligencia artificial" },
  ],
} as const;

/**
 * Logos de partners agrupados por rol, tal como aparecen en la sección
 * "BackedBy". Cada logo declara su tamaño intrínseco; el layout normaliza por
 * altura. Archivos en /public/img/partners/.
 */
export type PartnerLogo = {
  readonly name: string;
  readonly logo: string;
  readonly width: number;
  readonly height: number;
  /** Sobrescribe el tamaño por defecto del logo (clases Tailwind de altura). */
  readonly sizeClass?: string;
};

export type PartnerGroup = {
  readonly label: string;
  /** "attribution" → etiqueta centrada en minúscula (ej. CORFO). */
  readonly variant?: "attribution";
  /** Oculta la etiqueta (p.ej. cuando el texto ya viene dentro del logo). */
  readonly hideLabel?: boolean;
  readonly logos: readonly PartnerLogo[];
};

export const partnerGroups: readonly PartnerGroup[] = [
  {
    label: "Organizan",
    logos: [
      { name: "Brinca", logo: "/img/partners/brinca.svg", width: 136, height: 37 },
      { name: "Chile Global Ventures", logo: "/img/partners/chile-global-ventures.png", width: 336, height: 80 },
    ],
  },
  {
    label: "Colaboran",
    logos: [{ name: "Universidad Adolfo Ibáñez", logo: "/img/partners/uai.png", width: 360, height: 82 }],
  },
  {
    label: "Media partner",
    logos: [{ name: "Diario Financiero", logo: "/img/partners/diario-financiero.png", width: 98, height: 85 }],
  },
  {
    label: "Proyecto apoyado por",
    hideLabel: true, // El texto "Proyecto apoyado por" ya viene dentro del logo de CORFO.
    logos: [{ name: "CORFO", logo: "/img/partners/corfo-v2.png", width: 276, height: 125, sizeClass: "h-[52px] sm:h-[64px]" }],
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
    icon: "/img/icon-innovar-v2.png",
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
    icon: "/img/icon-adoptar-v2.png",
    color: "var(--color-blue-500)",
    tint: "var(--color-blue-100)",
    tags: ["Casos reales", "ROI por función", "Change management"],
  },
  {
    id: "escalar",
    n: "03",
    title: "Escalar",
    sub: "IA con I+D",
    desc:
      "Supercómputo, Ley I+D, datasets nacionales y la infraestructura que sostiene la IA a escala industrial.",
    icon: "/img/icon-escalar-v2.png",
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

/**
 * Speakers por día. `photo: null` → placeholder gris (aún sin foto).
 * Drop fotos en /public/img/speakers/ y apunta `photo` cuando lleguen.
 */
export type Speaker = {
  readonly name: string;
  readonly role: string;
  readonly photo: string | null;
  readonly country: string;
  /** Tema/track de la charla — usado por el filtro en la página /speakers. */
  readonly tema?: SpeakerTema;
};

/** Temas (tracks) de las charlas — alineados a los tres ejes del evento. */
export const speakerTemas = ["Innovación", "Adopción", "Escalamiento"] as const;
export type SpeakerTema = (typeof speakerTemas)[number];

/** Banderas circulares por país (en /public/img/flags/). */
export const countryFlags: Record<string, string> = {
  Argentina: "/img/flags/ar.svg",
  Italia: "/img/flags/it.svg",
  "Reino Unido": "/img/flags/gb.svg",
  Chile: "/img/flags/cl.svg",
};

export const speakerDays = ["Día 1", "Día 2"] as const;
export type SpeakerDay = (typeof speakerDays)[number];

/** Texto de relleno para oradores de ejemplo. */
const ROLE_LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.";

/** Genera N oradores placeholder, rotando el tema entre los tres ejes. */
function placeholderSpeakers(count: number, temaOffset = 0): Speaker[] {
  return Array.from({ length: count }, (_, i) => ({
    name: "Nombre Apellido",
    role: ROLE_LOREM,
    photo: null,
    country: "Argentina",
    tema: speakerTemas[(temaOffset + i) % speakerTemas.length],
  }));
}

/** Fotos disponibles de los primeros speakers (info real pendiente). */
const speakerPhotos = [
  "/img/speakers/speaker-1.webp",
  "/img/speakers/speaker-2.webp",
  "/img/speakers/speaker-3.webp",
  "/img/speakers/speaker-4.webp",
] as const;

/** Asigna las fotos disponibles a los primeros speakers de la lista. */
function withPhotos(
  speakers: Speaker[],
  photos: readonly string[] = speakerPhotos,
): Speaker[] {
  return speakers.map((s, i) =>
    i < photos.length ? { ...s, photo: photos[i] } : s,
  );
}

// 4 oradores reales (con foto) + 16 placeholders = 20.
const speakersDia1: readonly Speaker[] = withPhotos([
  {
    name: "Stefano Puntoni",
    role: "Codirector del programa de investigación sobre inteligencia artificial humana de Wharton.",
    photo: null,
    country: "Italia",
    tema: "Innovación",
  },
  {
    name: "Daniel Strode",
    role: "Autor del best seller “La ventaja del innovador”. Experto en transformación del trabajo en la era de la IA.",
    photo: null,
    country: "Reino Unido",
    tema: "Innovación",
  },
  {
    name: "Jeannette Escudero",
    role: "Directora Ejecutiva Talento Digital para Chile. Experta en innovación y desarrollo de equipos para la adopción tecnológica.",
    photo: null,
    country: "Chile",
    tema: "Escalamiento",
  },
  {
    name: "Nicolás Rivas",
    role: "Líder de datos, inteligencia de negocios e inteligencia artificial en startups, Gerente de Soluciones IA en Brinca.",
    photo: null,
    country: "Chile",
    tema: "Adopción",
  },
  ...placeholderSpeakers(16, 2),
]);

export const speakersByDay: Record<SpeakerDay, readonly Speaker[]> = {
  "Día 1": speakersDia1,
  // Día 2 replica el mismo contenido del Día 1.
  "Día 2": speakersDia1,
};

export const numeros = [
  { num: 400, suffix: "",  lbl: "ejecutivos C-level", note: "Curados, exclusivo" },
  { num: 12,  suffix: "+", lbl: "industrias",         note: "Banca, retail, salud, minería..." },
  { num: 3,   suffix: "",  lbl: "ejes temáticos",     note: "Adoptar · Escalar · Innovar" },
  { num: 2,   suffix: "",  lbl: "días de inmersión",  note: "2 y 3 de septiembre" },
] as const;

export const programa = [
  { tag: "Keynotes",          title: "Keynotes con voces internacionales", desc: "Speakers de referencia mundial en IA aplicada — anuncios en mayo.",                    img: "/img/Group-1.webp" },
  { tag: "Paneles",           title: "Paneles por función ejecutiva",      desc: "Mesas paralelas para CEO, CTO, CFO y Dir. de Innovación. Sin teoría, casos reales.",   img: "/img/Group-2.webp" },
  { tag: "Challenge briefs",  title: "Challenge Briefs en equipo",         desc: "Grupos curados resuelven un brief real de una empresa chilena.",                       img: "/img/Group-3.webp" },
  { tag: "Demos",             title: "Talleres de IA",                     desc: "Implementaciones que ya están funcionando — código y métricas a la vista.",            img: "/img/Group.webp"   },
  { tag: "Networking",        title: "Matchmaking y networking",           desc: "Rondas de conexión dirigida entre empresas, proveedores y startups.",                 img: "/img/Group-4.webp" },
  { tag: "Afterparty",        title: "Afterparty: cierre exclusivo",       desc: "Espacio íntimo para cerrar negocios y construir alianzas.",                            img: "/img/Group-5.webp" },
] as const;

export const formInteresOptions = ["Asistente", "Speaker", "Sponsor", "Media"] as const;
export type FormInteres = (typeof formInteresOptions)[number];

/** Opción que dispara un campo de texto abierto en el formulario. */
export const NIVEL_OTRO = "Otro";

/** Opciones del dropdown "Nivel de responsabilidad". */
export const formNivelOptions = [
  "Gerente General / CEO",
  "Director(a)",
  "Gerente",
  "Subgerente",
  "Jefatura / Líder",
  "Coordinador(a)",
  "Profesional / Especialista",
  "Consultor(a)",
  NIVEL_OTRO,
] as const;
export type FormNivel = (typeof formNivelOptions)[number];

/** Opción que dispara un campo de texto abierto para el área. */
export const AREA_OTRO = "Otro";

/** Opciones del dropdown "Área a la que pertenece". */
export const formAreaOptions = [
  "Recursos Humanos",
  "Tecnología de la Información (TI)",
  "Innovación",
  "Finanzas",
  "Gerencia General",
  "Operaciones",
  "Comercial / Ventas",
  "Marketing",
  "Transformación Digital",
  AREA_OTRO,
] as const;
export type FormArea = (typeof formAreaOptions)[number];

export const formBenefits = [
  { dot: "var(--color-mint-500)", txt: "Prioridad para ser considerado en la primera ola de invitaciones." },
  { dot: "var(--color-blue-300)", txt: "Acceso anticipado al programa y line-up de speakers." },
  { dot: "var(--color-pink-500)", txt: "Actualizaciones y contenidos exclusivos sobre Impacta IA." },
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
      { t: "Pre-regístrate", a: "/#form" },
      { t: "Los 3 ejes",     a: "/#ejes" },
      { t: "Para quién",     a: "/#para-quien" },
      { t: "Quiero ser sponsor",  a: "/#form", intent: "Sponsor" },
      { t: "Soy media",           a: "/#form", intent: "Media" },
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
      { t: "LinkedIn",  a: "https://www.linkedin.com/company/brincaglobal/" },
      { t: "Instagram", a: "https://www.instagram.com/brinca.global/" },
    ],
  },
];
