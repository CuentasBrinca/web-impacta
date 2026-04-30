"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ejes } from "@/lib/content";

const EASE = [0.2, 0, 0, 1] as const;

export function Ejes() {
  const reduced = useReducedMotion();

  return (
    <section id="ejes" className="relative bg-paper-soft overflow-hidden px-6 sm:px-10 py-24 sm:py-32">
      {/* Subtle grain — gives the off-white background tactile depth without competing with content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "multiply",
        }}
      />
      {/* Soft radial accent — lifts the section subtly without a hard color shift */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "-15%",
          top: "10%",
          width: "55%",
          height: "60%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,255,0.05) 0%, rgba(0,0,255,0) 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="max-w-[920px] mb-16">
          <div className="eyebrow">Tres ejes · un objetivo</div>
          <h2
            className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-4"
            style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
          >
            Innova. Adopta.
            <br />
            Escala.
          </h2>
          <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-ink-soft max-w-[620px]">
            Que la IA funcione en tu empresa. Tres tracks paralelos durante dos días — escoge tu camino o cruza entre ellos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ejes.map((e, idx) => (
            <motion.article
              key={e.id}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 * (idx + 1) }}
              whileHover={reduced ? undefined : { y: -6 }}
              className="bg-paper border border-ink rounded-2xl p-8 flex flex-col gap-4 min-h-[480px] relative overflow-hidden cursor-default transition-shadow duration-200 hover:shadow-[0_20px_40px_rgba(24,24,26,0.10)]"
            >
              <div
                className="font-[var(--font-display)] text-sm font-bold tracking-[0.12em]"
                style={{ color: e.color }}
              >
                {e.n} / 03
              </div>

              <div
                className="w-full h-[140px] grid place-items-center rounded-xl my-2 overflow-hidden"
                style={{ background: e.tint }}
              >
                <Image
                  src={e.icon}
                  alt={`Eje ${e.title}`}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-contain"
                />
              </div>

              <h3
                className="font-[var(--font-display)] font-bold tracking-[-0.03em] m-0"
                style={{ fontSize: "56px", color: e.color }}
              >
                {e.title}
              </h3>
              <div className="font-[var(--font-body)] text-sm font-medium text-ink-soft tracking-wide -mt-2">
                — {e.sub}
              </div>

              <p className="font-[var(--font-body)] text-[15px] leading-[1.55] text-ink m-0 flex-1">
                {e.desc}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full font-[var(--font-body)] text-xs font-semibold whitespace-nowrap"
                    style={{ background: e.tint, color: e.color }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
