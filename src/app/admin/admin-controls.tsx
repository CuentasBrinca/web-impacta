"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DayStats } from "@/lib/admin-data";
import { setCupo, purgeTests } from "./actions";

/**
 * Tarjeta de ocupación por día: confirmados/cupo + lista de espera, con el
 * cupo editable en línea (rige de inmediato — la RPC lo lee en vivo).
 */
export function DayStatCard({ stats }: { stats: DayStats }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(stats.cupo));
  const [error, setError] = useState<string | null>(null);

  const pct = stats.cupo > 0 ? Math.min(100, Math.round((stats.confirmed / stats.cupo) * 100)) : 0;
  const full = stats.confirmed >= stats.cupo;

  function save() {
    const cupo = Number(value);
    startTransition(async () => {
      const res = await setCupo(stats.date, cupo);
      if (!res.ok) {
        setError(res.error);
        setValue(String(stats.cupo));
      } else {
        setError(null);
      }
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl bg-paper p-4 ring-1 ring-ink-faint">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{stats.short} · Confirmados</p>
        {editing ? (
          <span className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              value={value}
              disabled={pending}
              autoFocus
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-20 rounded border border-ink-faint bg-paper px-2 py-0.5 text-xs outline-none focus:border-blue-500"
            />
            <button onClick={save} disabled={pending} className="text-xs font-semibold text-blue-500">
              {pending ? "…" : "OK"}
            </button>
          </span>
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Editar cupo máximo"
            className="text-xs text-ink-soft underline decoration-dotted underline-offset-2 hover:text-ink"
          >
            cupo {stats.cupo} ✎
          </button>
        )}
      </div>
      <p className={`mt-1 font-display text-3xl font-bold leading-none ${full ? "text-pink-500" : "text-[#0F8A75]"}`}>
        {stats.confirmed}
        <span className="text-base font-semibold text-ink-soft">/{stats.cupo}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-soft ring-1 ring-ink-faint">
        <div
          className={`h-full rounded-full ${full ? "bg-pink-500" : "bg-mint-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        {stats.waitlisted > 0 ? `${stats.waitlisted} en lista de espera` : "Sin lista de espera"}
      </p>
      {error && <p className="mt-1 text-xs font-medium text-pink-500">{error}</p>}
    </div>
  );
}

/** Borra todas las filas de prueba, con doble confirmación. */
export function PurgeTestsButton({ testCount }: { testCount: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (testCount === 0 && !message) return null;

  function doPurge() {
    if (!window.confirm(`¿Borrar los ${testCount} registros de prueba (@brinca)? Esta acción es irreversible.`)) return;
    startTransition(async () => {
      const res = await purgeTests();
      setMessage(res.ok ? res.message : res.error);
      router.refresh();
    });
  }

  return (
    <span className="flex items-center gap-2">
      {testCount > 0 && (
        <button
          onClick={doPurge}
          disabled={pending}
          className="rounded-lg px-3 py-2 text-sm font-medium text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-50 disabled:opacity-50"
        >
          {pending ? "Borrando…" : `Purgar pruebas (${testCount})`}
        </button>
      )}
      {message && <span className="text-xs text-ink-soft">{message}</span>}
    </span>
  );
}
