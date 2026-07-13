"use client";

import { motion, useReducedMotion } from "framer-motion";
import { agenda, agendaFranjas, type AgendaBlock } from "@/lib/content";

const EASE = [0.2, 0, 0, 1] as const;

/** rgba con alfa a partir de un hex `#rrggbb` — para tintes/bordes suaves. */
function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Columna de grilla por índice de día (desktop). Literales → los ve Tailwind. */
const DAY_COL = ["lg:col-start-2", "lg:col-start-3"] as const;
/** Color de cabecera por día: día 1 magenta, día 2 verde. */
const DAY_COLOR = ["#ED1E79", "#1DD2B3"] as const;
/** Fila de grilla por franja (desktop). */
const ROW: Record<AgendaBlock["franja"], string> = {
  AM: "lg:row-start-2",
  PM: "lg:row-start-3",
};

function BlockCard({ block, className, delay }: { block: AgendaBlock; className?: string; delay: number }) {
  const reduced = useReducedMotion();
  const { accent } = block;

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={["relative rounded-[10px] border p-6 sm:p-7 flex flex-col", className ?? ""].join(" ")}
      style={{
        borderColor: hexA(accent, 0.6),
        background: `linear-gradient(180deg, ${hexA(accent, 0.1)} 0%, rgba(16,15,18,0) 45%), #100F12`,
      }}
    >
      {/* Línea de acento superior */}
      <div className="h-[3px] w-10 rounded-full" style={{ background: accent }} />

      <h3 className="mt-5 font-[family-name:var(--font-display)] font-bold text-white leading-[1.15] text-[19px] sm:text-[21px]">
        {block.title}
      </h3>

      <ul className="mt-4 space-y-2.5 flex-1">
        {block.points.map((p) => (
          <li
            key={p}
            className="flex gap-2.5 text-[14px] leading-[1.5] text-white/65 font-[family-name:var(--font-body)]"
          >
            <span aria-hidden className="shrink-0 font-bold" style={{ color: accent }}>
              →
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <div
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold font-[family-name:var(--font-body)]"
        style={{ color: accent }}
      >
        Ver detalle
        <span aria-hidden>→</span>
      </div>
    </motion.article>
  );
}

function FranjaRail({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={[
        "hidden lg:flex items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]",
        className ?? "",
      ].join(" ")}
    >
      <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50 font-[family-name:var(--font-body)]">
        {label}
      </span>
    </div>
  );
}

export function Jornadas() {
  const reduced = useReducedMotion();

  return (
    <section id="programa" className="bg-night text-white px-6 sm:px-10 pt-24 sm:pt-32 pb-8 sm:pb-10 scroll-mt-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Encabezado */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 mb-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-[640px]"
          >
            <div className="eyebrow eyebrow-on-dark">El programa · Contenidos por día</div>
            <h2
              className="font-[family-name:var(--font-display)] font-bold leading-[0.98] tracking-[-0.035em] mt-5 text-white"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
            >
              Programa
            </h2>
          </motion.div>
        </div>

        {/* Matriz día × franja. Móvil: 1 columna, apila por día (los rieles se
            ocultan). Desktop: [riel | día 1 | día 2] con posición explícita. */}
        <div className="grid gap-4 lg:gap-5 grid-cols-1 lg:grid-cols-[64px_1fr_1fr] lg:grid-rows-[auto_1fr_1fr]">
          {/* Esquina vacía + rieles de franja (solo desktop) */}
          <div className="hidden lg:block lg:col-start-1 lg:row-start-1" />
          <FranjaRail label={agendaFranjas[0].label} className="lg:col-start-1 lg:row-start-2" />
          <FranjaRail label={agendaFranjas[1].label} className="lg:col-start-1 lg:row-start-3" />

          {agenda.map((d, di) => (
            <div key={d.day} className="contents">
              {/* Cabecera de día */}
              <div className={["flex items-baseline gap-3", DAY_COL[di], "lg:row-start-1 mt-2 lg:mt-0"].join(" ")}>
                <span
                  className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[0.08em]"
                  style={{ color: DAY_COLOR[di] }}
                >
                  {d.date}
                </span>
              </div>

              {d.blocks.map((b, bi) => (
                <BlockCard
                  key={b.n}
                  block={b}
                  delay={0.08 * (bi + 1)}
                  className={[DAY_COL[di], ROW[b.franja]].join(" ")}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
