import Image from "next/image";
import { organizer } from "@/lib/content";

/**
 * Bloque "Detrás de Impacta IA" — posiciona a Brinca como el organizador y
 * presta su credibilidad al evento (responde "¿por qué confiar en esta
 * conferencia?"). Sección oscura limpia que antecede al formulario.
 */
export function Organizador() {
  return (
    <section
      id="organizador"
      className="bg-ink text-white px-6 sm:px-10 py-24 sm:py-32 scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-20 items-end">
          <div>
            <div className="eyebrow text-white/60">El organizador</div>
            <h2
              className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 text-white max-w-[14ch]"
              style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
            >
              Detrás de Impacta IA está Brinca.
            </h2>
          </div>

          <div className="flex flex-col gap-7 max-w-[520px]">
            <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.5] text-white/85 m-0">
              {organizer.blurb}
            </p>

            <ul className="list-none flex flex-wrap gap-2.5 m-0 p-0">
              {organizer.pillars.map((p) => (
                <li
                  key={p}
                  className="font-[var(--font-body)] text-[13px] font-medium text-white/80 border border-white/20 rounded-full px-4 py-1.5"
                >
                  {p}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-6 mt-1">
              <Image
                src={organizer.logoLight}
                alt={organizer.name}
                width={organizer.width}
                height={organizer.height}
                className="h-8 w-auto"
              />
              <a
                href={organizer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[var(--font-body)] text-base font-medium text-mint-500 no-underline hover:text-mint-300 transition-colors duration-150 inline-flex items-center gap-1.5"
              >
                Conoce Brinca
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Credenciales — la trayectoria de Brinca como respaldo del evento. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-white/15 mt-16">
          {organizer.stats.map((s, i) => (
            <div
              key={s.lbl}
              className={[
                "py-10 sm:py-12 px-0 sm:px-8",
                i === 0 ? "sm:pl-0" : "",
                i !== organizer.stats.length - 1 ? "sm:border-r sm:border-white/15" : "",
              ].join(" ")}
            >
              <div
                className="font-[var(--font-display)] font-bold leading-[0.95] tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(48px, 6vw, 88px)" }}
              >
                {s.num}
              </div>
              <div className="font-[var(--font-body)] text-[15px] leading-[1.45] text-white/60 mt-3 max-w-[28ch]">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
