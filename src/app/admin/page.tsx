import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAuthed } from "@/lib/admin-auth";
import {
  fetchRegistrations,
  parseFilters,
  summarize,
  statusOptions,
  statusLabels,
} from "@/lib/admin-data";
import { formInteresOptions } from "@/lib/content";
import { logout } from "./actions";
import { RegistrationsTable } from "./registrations-table";

export const metadata: Metadata = {
  title: "Inscritos · Impacta IA",
  robots: { index: false, follow: false },
};

// Always render fresh — this is live operational data.
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isAuthed())) redirect("/admin/login");

  const sp = await searchParams;
  const filters = parseFilters(sp);
  const rows = await fetchRegistrations(filters);
  const stats = summarize(rows);

  // Build the export URL preserving the current filters.
  const exportParams = new URLSearchParams();
  if (filters.q) exportParams.set("q", filters.q);
  if (filters.interes) exportParams.set("interes", filters.interes);
  if (filters.status) exportParams.set("status", filters.status);
  const exportHref = `/admin/export${exportParams.toString() ? `?${exportParams}` : ""}`;

  const hasFilters = Boolean(filters.q || filters.interes || filters.status);

  return (
    <main className="min-h-dvh bg-paper-soft text-ink">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-ink-faint bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-blue-500">
              Impacta IA · Admin
            </p>
            <h1 className="font-display text-xl font-bold leading-tight">Inscritos</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={exportHref}
              className="rounded-lg bg-mint-500 px-4 py-2 text-sm font-semibold text-night transition hover:bg-mint-400"
            >
              ↓ Descargar Excel
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper-soft hover:text-ink"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Summary cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total" value={stats.total} accent="ink" big />
          {formInteresOptions.map((opt) => (
            <StatCard key={opt} label={opt} value={stats.byInteres[opt] ?? 0} />
          ))}
        </section>

        {/* Status chips */}
        <section className="mt-3 flex flex-wrap gap-2">
          {statusOptions.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-ink-faint"
            >
              {statusLabels[s]}
              <span className="font-bold text-ink">{stats.byStatus[s] ?? 0}</span>
            </span>
          ))}
        </section>

        {/* Filters */}
        <form
          method="get"
          className="mt-5 flex flex-wrap items-end gap-3 rounded-xl bg-paper p-4 ring-1 ring-ink-faint"
        >
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="q" className="mb-1 block text-xs font-medium text-ink-soft">
              Buscar
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={filters.q ?? ""}
              placeholder="Nombre, email, empresa o cargo…"
              className="w-full rounded-lg border border-ink-faint bg-paper px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="interes" className="mb-1 block text-xs font-medium text-ink-soft">
              Interés
            </label>
            <select
              id="interes"
              name="interes"
              defaultValue={filters.interes ?? ""}
              className="rounded-lg border border-ink-faint bg-paper px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Todos</option>
              {formInteresOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="mb-1 block text-xs font-medium text-ink-soft">
              Estado
            </label>
            <select
              id="status"
              name="status"
              defaultValue={filters.status ?? ""}
              className="rounded-lg border border-ink-faint bg-paper px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Todos</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Filtrar
          </button>
          {hasFilters ? (
            <a
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              Limpiar
            </a>
          ) : null}
        </form>

        <p className="mt-4 text-sm text-ink-soft">
          {stats.total === 0
            ? "Sin inscritos para este filtro."
            : `Mostrando ${stats.total} ${stats.total === 1 ? "inscrito" : "inscritos"}${
                hasFilters ? " (filtrado)" : ""
              }.`}
        </p>

        <RegistrationsTable rows={rows} />
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent = "soft",
  big = false,
}: {
  label: string;
  value: number;
  accent?: "ink" | "soft";
  big?: boolean;
}) {
  return (
    <div className="rounded-xl bg-paper p-4 ring-1 ring-ink-faint">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p
        className={`mt-1 font-display font-bold leading-none ${big ? "text-3xl" : "text-2xl"} ${
          accent === "ink" ? "text-blue-500" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
