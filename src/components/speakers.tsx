"use client";

import { useState } from "react";
import { speakerDays, speakersByDay, type SpeakerDay } from "@/lib/content";
import { SpeakerCard } from "@/components/speaker-card";
import { ButtonLink } from "@/components/ui/button";

export function Speakers() {
  const [day, setDay] = useState<SpeakerDay>(speakerDays[0]);
  // El home muestra solo un adelanto; el listado completo está en /speakers.
  const speakers = speakersByDay[day].slice(0, 4);

  return (
    <section id="speakers" className="bg-night text-white px-6 sm:px-10 py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Encabezado + toggle de día */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 mb-14">
          <h2
            className="font-[family-name:var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] m-0 text-white"
            style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
          >
            Conversaciones reales
            <br />
            Speakers.
          </h2>

          <div
            role="tablist"
            aria-label="Día del programa"
            className="flex items-center gap-3 pb-2"
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
                    "font-[family-name:var(--font-body)] text-base font-medium rounded-full px-7 py-2.5 transition-colors duration-150 cursor-pointer",
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

        {/* Grilla de speakers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {speakers.map((s, i) => (
            <SpeakerCard key={`${day}-${i}`} speaker={s} />
          ))}
        </div>

        {/* CTA → página con todos los oradores */}
        <div className="mt-16 flex justify-center">
          <ButtonLink href="/speakers" variant="ghost-dark" size="lg">
            Ver todos los Speakers →
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
