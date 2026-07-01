import Image from "next/image";
import { countryFlags, type Speaker } from "@/lib/content";

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
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
      {(speaker.country || speaker.tema) && (
        <div className="mt-auto pt-5 flex flex-wrap items-center gap-2">
          {speaker.country && (
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
          )}
          {speaker.tema && (
            <span className="inline-flex items-center rounded-full border border-white/25 px-4 py-1.5 font-[var(--font-body)] text-[13px] text-white/80">
              {speaker.tema}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
