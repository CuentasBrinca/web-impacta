import { formInteresOptions } from "@/lib/content";

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
  "rejected",
  "spam",
] as const;
export type Status = (typeof statusOptions)[number];

/** Human labels (Spanish) for the lifecycle states. */
export const statusLabels: Record<Status, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  confirmed: "Confirmado",
  rejected: "Rechazado",
  spam: "Spam",
};

export type Registration = {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  empresa: string;
  cargo: string;
  interes: string;
  consent: boolean;
  source: string | null;
  status: Status;
  notes: string | null;
};

export type Filters = {
  q?: string;
  interes?: string;
  status?: string;
};

/** Normalize raw searchParams into known filter values (drops junk). */
export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  const interes = one(sp.interes);
  const status = one(sp.status);
  return {
    q: one(sp.q),
    interes: interes && (formInteresOptions as readonly string[]).includes(interes) ? interes : undefined,
    status: status && (statusOptions as readonly string[]).includes(status) ? status : undefined,
  };
}

/** Counts for the summary cards. Computed in-memory from the full set. */
export function summarize(rows: Registration[]) {
  const byInteres: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const r of rows) {
    byInteres[r.interes] = (byInteres[r.interes] ?? 0) + 1;
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  }
  return { total: rows.length, byInteres, byStatus };
}
