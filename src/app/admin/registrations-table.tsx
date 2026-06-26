"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  statusOptions,
  statusLabels,
  type Registration,
  type Status,
} from "@/lib/admin-shared";
import { updateStatus, updateNotes } from "./actions";

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
  rejected: "bg-pink-100 text-pink-500",
  spam: "bg-paper-soft text-ink-soft ring-1 ring-ink-faint",
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
      <table className="w-full min-w-[960px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-faint text-left text-[0.7rem] uppercase tracking-wide text-ink-soft">
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Empresa</th>
            <th className="px-4 py-3 font-semibold">Nivel</th>
            <th className="px-4 py-3 font-semibold">Área</th>
            <th className="px-4 py-3 font-semibold">Interés</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
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
  return (
    <tr className="border-b border-ink-faint/60 align-top last:border-0 hover:bg-paper-soft/50">
      <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{dateFmt.format(new Date(r.created_at))}</td>
      <td className="px-4 py-3 font-medium">{r.nombre}</td>
      <td className="px-4 py-3">
        <a href={`mailto:${r.email}`} className="text-blue-500 hover:underline">
          {r.email}
        </a>
      </td>
      <td className="px-4 py-3">{r.empresa}</td>
      <td className="px-4 py-3 text-ink-soft">{r.cargo}</td>
      <td className="px-4 py-3 text-ink-soft">{r.area ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
            interesStyles[r.interes] ?? "bg-paper-soft text-ink-soft"
          }`}
        >
          {r.interes}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusCell id={r.id} value={r.status} />
      </td>
      <td className="px-4 py-3 min-w-[220px]">
        <NotesCell id={r.id} value={r.notes ?? ""} />
      </td>
    </tr>
  );
}

function StatusCell({ id, value }: { id: string; value: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState<Status>(value);

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
        {statusOptions.map((s) => (
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
