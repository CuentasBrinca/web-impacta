import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Filters, Registration } from "@/lib/admin-shared";

// Re-export client-safe pieces so server modules can import everything from here.
export {
  statusOptions,
  statusLabels,
  parseFilters,
  summarize,
} from "@/lib/admin-shared";
export type { Status, Registration, Filters } from "@/lib/admin-shared";

const SELECT_COLS =
  "id, created_at, nombre, email, empresa, cargo, interes, consent, source, status, notes";

/** Fetch registrations (newest first) matching the given filters. */
export async function fetchRegistrations(filters: Filters): Promise<Registration[]> {
  const sb = supabaseAdmin();
  let query = sb.from("pre_registrations").select(SELECT_COLS).order("created_at", { ascending: false });

  if (filters.interes) query = query.eq("interes", filters.interes);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.q) {
    // Escape PostgREST `or` reserved chars in the user term.
    const term = filters.q.replace(/[%,()]/g, " ").trim();
    if (term) {
      const like = `%${term}%`;
      query = query.or(`nombre.ilike.${like},email.ilike.${like},empresa.ilike.${like},cargo.ilike.${like}`);
    }
  }

  const { data, error } = await query.limit(5000);
  if (error) {
    console.error("[admin] fetchRegistrations failed", error);
    throw new Error("No se pudieron cargar las inscripciones.");
  }
  return (data ?? []) as Registration[];
}
