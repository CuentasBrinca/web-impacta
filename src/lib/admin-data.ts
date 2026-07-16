import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { eventDays, type EventDayKey } from "@/lib/content";
import type { Filters, Registration } from "@/lib/admin-shared";

// Re-export client-safe pieces so server modules can import everything from here.
export {
  statusOptions,
  manualStatusOptions,
  statusLabels,
  dayStatusLabels,
  emailTypeLabels,
  parseFilters,
  summarize,
} from "@/lib/admin-shared";
export type { Status, DayStatus, Registration, Filters } from "@/lib/admin-shared";

const SELECT_COLS =
  "id, created_at, nombre, email, empresa, cargo, area, motivacion, interes, consent, source, status, notes, " +
  "dia_sep2, dia_sep3, is_test, email_type, email_status, email_error, email_sent_at";

const DAY_COL: Record<EventDayKey, "dia_sep2" | "dia_sep3"> = {
  sep2: "dia_sep2",
  sep3: "dia_sep3",
};

/** Fetch registrations (newest first) matching the given filters. */
export async function fetchRegistrations(filters: Filters): Promise<Registration[]> {
  const sb = supabaseAdmin();
  let query = sb.from("pre_registrations").select(SELECT_COLS).order("created_at", { ascending: false });

  if (filters.interes) query = query.eq("interes", filters.interes);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.dia) {
    const [key, st] = filters.dia.split(":") as [EventDayKey, string];
    query = query.eq(DAY_COL[key], st);
  }
  if (filters.test === "solo") query = query.eq("is_test", true);
  if (filters.test === "ocultar") query = query.eq("is_test", false);
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
  // El SELECT multilinea impide que supabase-js infiera el tipo de fila.
  return (data ?? []) as unknown as Registration[];
}

export type DayStats = {
  key: EventDayKey;
  date: string;
  short: string;
  cupo: number;
  confirmed: number;
  waitlisted: number;
};

/**
 * Cupo y ocupación real por día — la fuente de verdad de los contadores del
 * header. Cuenta directo en la DB (excluyendo pruebas), no sobre las filas
 * filtradas de la tabla.
 */
export async function fetchDayStats(): Promise<DayStats[]> {
  const sb = supabaseAdmin();
  const { data: days, error } = await sb.from("event_days").select("day, cupo").order("day");
  if (error) {
    console.error("[admin] fetchDayStats failed", error);
    throw new Error("No se pudo cargar la configuración de cupos.");
  }

  const stats = await Promise.all(
    eventDays.map(async (d) => {
      const col = DAY_COL[d.key];
      const countWhere = async (st: string) => {
        const { count, error: cErr } = await sb
          .from("pre_registrations")
          .select("id", { count: "exact", head: true })
          .eq(col, st)
          .eq("is_test", false);
        if (cErr) throw new Error(cErr.message);
        return count ?? 0;
      };
      const [confirmed, waitlisted] = await Promise.all([countWhere("confirmed"), countWhere("waitlisted")]);
      return {
        key: d.key,
        date: d.date,
        short: d.short,
        cupo: days?.find((x) => x.day === d.date)?.cupo ?? 0,
        confirmed,
        waitlisted,
      };
    })
  );
  return stats;
}
