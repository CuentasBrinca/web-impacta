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
      <div className="mt-5 mb-2 flex items-start justify-between gap-3">
        <h3 className="font-[family-name:var(--font-body)] text-xl font-bold text-white m-0">
          {speaker.name}
        </h3>
        {speaker.linkedin ? (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn de ${speaker.name}`}
            className="shrink-0 mt-1 text-mint-500 hover:text-mint-300 transition-colors duration-150"
          >
            <LinkedInIcon />
          </a>
        ) : (
          <span aria-hidden className="shrink-0 mt-1 text-mint-500">
            <LinkedInIcon />
          </span>
        )}
      </div>
      <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.5] text-white/60 m-0">
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
              <span className="font-[family-name:var(--font-body)] text-[13px] text-white/80">
                {speaker.country}
              </span>
            </span>
          )}
          {speaker.tema && (
            <span className="inline-flex items-center rounded-full border border-white/25 px-4 py-1.5 font-[family-name:var(--font-body)] text-[13px] text-white/80">
              {speaker.tema}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

/** Glifo "in" de LinkedIn (currentColor → hereda el color del contenedor). */
function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}
