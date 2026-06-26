"use client";

import Image from "next/image";
import { useState } from "react";
import { speakerDays, speakersByDay, countryFlags, type SpeakerDay, type Speaker } from "@/lib/content";

export function Speakers() {
  const [day, setDay] = useState<SpeakerDay>(speakerDays[0]);
  const speakers = speakersByDay[day];

  return (
    <section id="speakers" className="bg-night text-white px-6 sm:px-10 py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Encabezado + toggle de día */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 mb-14">
          <h2
            className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] m-0 text-white"
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

        {/* Grilla de speakers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {speakers.map((s, i) => (
            <SpeakerCard key={`${day}-${i}`} speaker={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <article className="flex flex-col h-full">
      <div className="aspect-square w-full overflow-hidden bg-[#D9D9D9]">
        {speaker.photo && (
          <Image
            src={speaker.photo}
            alt={speaker.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <h3 className="font-[var(--font-body)] text-xl font-bold text-white mt-5 mb-2">
        {speaker.name}
      </h3>
      <p className="font-[var(--font-body)] text-[15px] leading-[1.5] text-white/60 m-0">
        {speaker.role}
      </p>
      {speaker.country && (
        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 py-1.5 pl-1.5 pr-4">
            {countryFlags[speaker.country] && (
              <Image
                src={countryFlags[speaker.country]}
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] rounded-full shrink-0"
              />
            )}
            <span className="font-[var(--font-body)] text-[13px] text-white/80">
              {speaker.country}
            </span>
          </span>
        </div>
      )}
    </article>
  );
}
