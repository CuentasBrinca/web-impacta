"use client";

import { useState } from "react";
import {
  speakerDays,
  speakersByDay,
  speakerTemas,
  type SpeakerDay,
  type SpeakerTema,
} from "@/lib/content";
import { SpeakerCard } from "@/components/speaker-card";

type TemaFilter = SpeakerTema | "Todos";

/** Filtros (tema a la izquierda, días a la derecha) + grilla de oradores. */
export function SpeakersDayGrid() {
  const [day, setDay] = useState<SpeakerDay>(speakerDays[0]);
  const [tema, setTema] = useState<TemaFilter>("Todos");

  const speakers = speakersByDay[day].filter(
    (s) => tema === "Todos" || s.tema === tema,
  );

  return (
    <>
      {/* Barra de filtros */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 mb-12">
        {/* Izquierda — filtro de tema */}
        <div className="relative">
          <label className="sr-only" htmlFor="tema-filter">
            Filtrar por tema
          </label>
          <select
            id="tema-filter"
            value={tema}
            onChange={(e) => setTema(e.target.value as TemaFilter)}
            className="appearance-none cursor-pointer rounded-full border border-white/35 bg-transparent text-white font-[var(--font-body)] text-base font-medium pl-6 pr-12 py-2.5 outline-none transition-colors hover:border-white/70 focus:border-white [&>option]:text-ink"
          >
            <option value="Todos">Todos los temas</option>
            {speakerTemas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Derecha — toggle de día */}
        <div
          role="tablist"
          aria-label="Día del programa"
          className="flex items-center gap-3"
        >
          {speakerDays.map((d) => {
            const active = d === day;
            return (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setDay(d)}
                className={[
                  "font-[var(--font-body)] text-base font-medium rounded-full px-7 py-2.5 transition-colors duration-150 cursor-pointer",
                  active
                    ? "bg-pink-500 text-white border border-pink-500"
                    : "bg-transparent text-white border border-white/35 hover:border-white/70",
                ].join(" ")}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grilla filtrada */}
      {speakers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {speakers.map((s, i) => (
            <SpeakerCard key={`${day}-${i}`} speaker={s} />
          ))}
        </div>
      ) : (
        <p className="font-[var(--font-body)] text-white/60 py-12">
          No hay oradores para esta combinación de filtros.
        </p>
      )}
    </>
  );
}
