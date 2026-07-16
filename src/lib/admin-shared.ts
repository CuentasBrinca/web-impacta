import { formInteresOptions, eventDays, type EventDayKey } from "@/lib/content";

/**
 * Client-safe admin types, constants and pure helpers.
 *
 * Kept separate from admin-data.ts (which is `server-only` and imports the
 * Supabase admin client) so Client Components can import labels/types without
 * pulling server code into the browser bundle.
 */

/** Lifecycle states — mirrors the CHECK constraint in the DB migration. */
export const statusOptions = [
  "new",
  "contacted",
  "confirmed",
  "waitlisted",
  "cancelled",
  "rejected",
  "spam",
] as const;
export type Status = (typeof statusOptions)[number];

/**
 * Estados asignables a mano desde el dropdown de la tabla. `confirmed`,
 * `waitlisted` y `cancelled` NO están: se gestionan solo por el flujo guiado
 * (confirmar día → valida cupo → correo) y la cancelación por día — la única
 * vía que respeta cupos y correos.
 */
export const manualStatusOptions = ["new", "contacted", "rejected", "spam"] as const;

/** Human labels (Spanish) for the lifecycle states. */
export const statusLabels: Record<Status, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  confirmed: "Confirmado",
  waitlisted: "Lista de espera",
  cancelled: "Cancelado",
  rejected: "Rechazado",
  spam: "Spam",
};

/** Estado de una persona respecto de un día del evento (columnas dia_sep2/3). */
export type DayStatus = "selected" | "confirmed" | "waitlisted" | "cancelled" | null;

export const dayStatusLabels: Record<Exclude<DayStatus, null>, string> = {
  selected: "Marcado",
  confirmed: "Confirmado",
  waitlisted: "En espera",
  cancelled: "Cancelado",
};

/** Último correo transaccional enviado (columna email_type). */
export const emailTypeLabels: Record<string, string> = {
  confirmed_full: "Confirmación",
  confirmed_partial: "Confirmación parcial",
  waitlisted: "Lista de espera",
  generic: "Pre-registro",
};

export type Registration = {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  empresa: string;
  cargo: string;
  area: string | null;
  motivacion: string | null;
  interes: string;
  consent: boolean;
  source: string | null;
  status: Status;
  notes: string | null;
  dia_sep2: DayStatus;
  dia_sep3: DayStatus;
  is_test: boolean;
  email_type: string | null;
  email_status: "sent" | "failed" | null;
  email_error: string | null;
  email_sent_at: string | null;
};

export const dayKeys = eventDays.map((d) => d.key) as EventDayKey[];
export const dayShortLabels = Object.fromEntries(eventDays.map((d) => [d.key, d.short])) as Record<
  EventDayKey,
  string
>;

export type Filters = {
  q?: string;
  interes?: string;
  status?: string;
  /** Filtra por estado en un día: "sep2:confirmed", "sep3:waitlisted", … */
  dia?: string;
  /** "solo" = solo pruebas; por defecto se muestran todas (marcadas). */
  test?: "solo" | "ocultar";
};

const DIA_FILTER_RE = /^(sep2|sep3):(selected|confirmed|waitlisted|cancelled)$/;

/** Normalize raw searchParams into known filter values (drops junk). */
export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  const interes = one(sp.interes);
  const status = one(sp.status);
  const dia = one(sp.dia);
  const test = one(sp.test);
  return {
    q: one(sp.q),
    interes: interes && (formInteresOptions as readonly string[]).includes(interes) ? interes : undefined,
    status: status && (statusOptions as readonly string[]).includes(status) ? status : undefined,
    dia: dia && DIA_FILTER_RE.test(dia) ? dia : undefined,
    test: test === "solo" || test === "ocultar" ? test : undefined,
  };
}

/** Counts for the summary cards. Computed in-memory from the full set. */
export function summarize(rows: Registration[]) {
  const byInteres: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let tests = 0;
  for (const r of rows) {
    byInteres[r.interes] = (byInteres[r.interes] ?? 0) + 1;
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    if (r.is_test) tests++;
  }
  return { total: rows.length, byInteres, byStatus, tests };
}
