"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  manualStatusOptions,
  statusLabels,
  dayStatusLabels,
  emailTypeLabels,
  type Registration,
  type Status,
  type DayStatus,
} from "@/lib/admin-shared";
import { eventDays } from "@/lib/content";
import { updateStatus, updateNotes, confirmDays, cancelDay, resendEmail, type AdminActionResult } from "./actions";

const dateFmt = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const interesStyles: Record<string, string> = {
  Asistente: "bg-blue-100 text-blue-500",
  Speaker: "bg-mint-100 text-[#0F8A75]",
  Sponsor: "bg-pink-100 text-pink-500",
  Media: "bg-paper-soft text-ink-soft ring-1 ring-ink-faint",
};

const statusStyles: Record<Status, string> = {
  new: "bg-blue-100 text-blue-500",
  contacted: "bg-paper-soft text-ink ring-1 ring-ink-faint",
  confirmed: "bg-mint-100 text-[#0F8A75]",
  waitlisted: "bg-amber-100 text-amber-700",
  cancelled: "bg-paper-soft text-ink-soft ring-1 ring-ink-faint line-through",
  rejected: "bg-pink-100 text-pink-500",
  spam: "bg-paper-soft text-ink-soft ring-1 ring-ink-faint",
};

const dayChipStyles: Record<Exclude<DayStatus, null>, string> = {
  selected: "bg-paper-soft text-ink-soft ring-1 ring-ink-faint",
  confirmed: "bg-mint-100 text-[#0F8A75]",
  waitlisted: "bg-amber-100 text-amber-700",
  cancelled: "bg-paper-soft text-ink-soft ring-1 ring-ink-faint line-through",
};

export function RegistrationsTable({ rows }: { rows: Registration[] }) {
  if (rows.length === 0) {
    return (
      <div className="mt-4 rounded-xl bg-paper p-10 text-center text-ink-soft ring-1 ring-ink-faint">
        No hay inscripciones que coincidan.
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-xl bg-paper ring-1 ring-ink-faint">
      <table className="w-full min-w-[1380px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-faint text-left text-[0.7rem] uppercase tracking-wide text-ink-soft">
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Empresa</th>
            <th className="px-4 py-3 font-semibold">Nivel</th>
            <th className="px-4 py-3 font-semibold">Motivación</th>
            <th className="px-4 py-3 font-semibold">Interés</th>
            <th className="px-4 py-3 font-semibold">Días</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Correo</th>
            <th className="px-4 py-3 font-semibold">Notas</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <Row key={r.id} r={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ r }: { r: Registration }) {
  // Mensajes de resultado de las acciones de la fila (confirmar / cancelar / reenviar).
  const [notice, setNotice] = useState<AdminActionResult | null>(null);

  return (
    <>
      <tr className={`border-b border-ink-faint/60 align-top last:border-0 hover:bg-paper-soft/50 ${r.is_test ? "opacity-70" : ""}`}>
        <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{dateFmt.format(new Date(r.created_at))}</td>
        <td className="px-4 py-3 font-medium">
          {r.nombre}
          {r.is_test && (
            <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-amber-700">
              Test
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <a href={`mailto:${r.email}`} className="text-blue-500 hover:underline">
            {r.email}
          </a>
          {r.telefono && (
            <span className="block text-xs text-ink-soft whitespace-nowrap">{r.telefono}</span>
          )}
        </td>
        <td className="px-4 py-3">{r.empresa}</td>
        <td className="px-4 py-3 text-ink-soft">
          {r.cargo}
          {r.area ? <span className="block text-xs text-ink-soft/70">{r.area}</span> : null}
        </td>
        <td className="max-w-[220px] px-4 py-3 text-ink-soft">
          {r.motivacion ? (
            <span className="line-clamp-2 whitespace-pre-wrap" title={r.motivacion}>
              {r.motivacion}
            </span>
          ) : (
            "—"
          )}
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
              interesStyles[r.interes] ?? "bg-paper-soft text-ink-soft"
            }`}
          >
            {r.interes}
          </span>
        </td>
        <td className="px-4 py-3 min-w-[210px]">
          <DaysCell r={r} onResult={setNotice} />
        </td>
        <td className="px-4 py-3">
          <StatusCell id={r.id} value={r.status} />
        </td>
        <td className="px-4 py-3 min-w-[150px]">
          <EmailCell r={r} onResult={setNotice} />
        </td>
        <td className="px-4 py-3 min-w-[200px]">
          <NotesCell id={r.id} value={r.notes ?? ""} />
        </td>
      </tr>
      {notice && (
        <tr className="border-b border-ink-faint/60">
          <td colSpan={11} className="px-4 pb-3 pt-0">
            <span
              className={`inline-block rounded-lg px-3 py-1.5 text-xs font-medium ${
                notice.ok ? "bg-mint-100 text-[#0F8A75]" : "bg-pink-100 text-pink-500"
              }`}
            >
              {notice.ok ? notice.message : notice.error}
              <button onClick={() => setNotice(null)} className="ml-2 font-bold opacity-60 hover:opacity-100">
                ✕
              </button>
            </span>
          </td>
        </tr>
      )}
    </>
  );
}

/**
 * Días de asistencia + flujo guiado de confirmación. Único camino para
 * confirmar: elegir día(s) → la RPC valida cupo → correo automático.
 * Sobre cada día confirmado hay un ✕ para cancelarlo (libera cupo, sin correo).
 */
function DaysCell({ r, onResult }: { r: Registration; onResult: (n: AdminActionResult) => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const dayState: Record<string, DayStatus> = { sep2: r.dia_sep2, sep3: r.dia_sep3 };
  const [pick, setPick] = useState<Record<string, boolean>>({
    sep2: r.dia_sep2 === "selected" || r.dia_sep2 === "waitlisted",
    sep3: r.dia_sep3 === "selected" || r.dia_sep3 === "waitlisted",
  });

  if (r.interes !== "Asistente" && !r.dia_sep2 && !r.dia_sep3) {
    return <span className="text-ink-soft">—</span>;
  }

  function doConfirm() {
    startTransition(async () => {
      const res = await confirmDays(r.id, !!pick.sep2, !!pick.sep3);
      onResult(res);
      setOpen(false);
      router.refresh();
    });
  }

  function doCancelDay(date: string, short: string) {
    if (!window.confirm(`¿Cancelar la asistencia del ${short}? Libera el cupo de inmediato. No se envía ningún correo.`)) return;
    startTransition(async () => {
      const res = await cancelDay(r.id, date);
      onResult(res);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {eventDays.map((d) => {
          const st = dayState[d.key];
          if (!st) return null;
          return (
            <span
              key={d.key}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${dayChipStyles[st]}`}
              title={`${d.label}: ${dayStatusLabels[st]}`}
            >
              {d.short} · {dayStatusLabels[st]}
              {st === "confirmed" && (
                <button
                  disabled={pending}
                  onClick={() => doCancelDay(d.date, d.short)}
                  title={`Cancelar ${d.short}`}
                  className="font-bold opacity-50 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </span>
          );
        })}
      </div>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          disabled={pending}
          className="w-fit rounded-lg bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
        >
          Confirmar…
        </button>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-lg bg-paper-soft p-2 ring-1 ring-ink-faint">
          {eventDays.map((d) => (
            <label key={d.key} className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={!!pick[d.key]}
                disabled={dayState[d.key] === "confirmed"}
                onChange={(e) => setPick((p) => ({ ...p, [d.key]: e.target.checked }))}
              />
              {d.label}
              {dayState[d.key] === "confirmed" && <span className="text-[#0F8A75]">(ya confirmado)</span>}
            </label>
          ))}
          <div className="flex gap-1.5">
            <button
              onClick={doConfirm}
              disabled={pending || (!pick.sep2 && !pick.sep3)}
              className="rounded-lg bg-mint-500 px-2.5 py-1 text-xs font-semibold text-night transition hover:bg-mint-400 disabled:opacity-50"
            >
              {pending ? "Confirmando…" : "Confirmar + correo"}
            </button>
            <button
              onClick={() => setOpen(false)}
              disabled={pending}
              className="rounded-lg px-2 py-1 text-xs text-ink-soft hover:text-ink"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Estado del último correo + reenvío. */
function EmailCell({ r, onResult }: { r: Registration; onResult: (n: AdminActionResult) => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function doResend() {
    startTransition(async () => {
      const res = await resendEmail(r.id);
      onResult(res);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      {r.email_status === "sent" ? (
        <span className="text-xs text-[#0F8A75]" title={r.email_sent_at ? dateFmt.format(new Date(r.email_sent_at)) : ""}>
          ✓ {emailTypeLabels[r.email_type ?? ""] ?? r.email_type}
        </span>
      ) : r.email_status === "failed" ? (
        <span className="text-xs font-semibold text-pink-500" title={r.email_error ?? ""}>
          ✗ Falló ({emailTypeLabels[r.email_type ?? ""] ?? r.email_type})
        </span>
      ) : (
        <span className="text-xs text-ink-soft">—</span>
      )}
      <button
        onClick={doResend}
        disabled={pending}
        className="w-fit rounded-lg px-2 py-0.5 text-[0.7rem] font-medium text-ink-soft ring-1 ring-ink-faint transition hover:text-ink disabled:opacity-50"
      >
        {pending ? "Enviando…" : r.email_status ? "↺ Reenviar" : "Enviar correo"}
      </button>
    </div>
  );
}

function StatusCell({ id, value }: { id: string; value: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState<Status>(value);
  // confirmed / waitlisted / cancelled no son asignables a mano — se muestran
  // pero el dropdown solo ofrece estados manuales.
  const isManaged = !(manualStatusOptions as readonly string[]).includes(current);

  function onChange(next: Status) {
    setCurrent(next);
    startTransition(async () => {
      await updateStatus(id, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={current}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as Status)}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 ${statusStyles[current]}`}
      >
        {isManaged && (
          <option value={current} disabled className="bg-paper text-ink">
            {statusLabels[current]} (gestionado por días)
          </option>
        )}
        {manualStatusOptions.map((s) => (
          <option key={s} value={s} className="bg-paper text-ink">
            {statusLabels[s]}
          </option>
        ))}
      </select>
      {pending ? <span className="text-[0.7rem] text-ink-soft">…</span> : null}
    </div>
  );
}

function NotesCell({ id, value }: { id: string; value: string }) {
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(false);
  const dirty = text !== value;

  function save() {
    if (!dirty) return;
    startTransition(async () => {
      await updateNotes(id, text);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        disabled={pending}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        placeholder="Agregar nota…"
        className="w-full rounded-lg border border-ink-faint bg-paper px-2.5 py-1.5 text-sm outline-none focus:border-blue-500"
      />
      {pending ? (
        <span className="text-[0.7rem] text-ink-soft">…</span>
      ) : saved ? (
        <span className="text-[0.7rem] font-semibold text-[#0F8A75]">✓</span>
      ) : dirty ? (
        <span className="text-[0.7rem] text-pink-500">•</span>
      ) : null}
    </div>
  );
}
