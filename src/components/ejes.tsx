"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ejes } from "@/lib/content";

const EASE = [0.2, 0, 0, 1] as const;

/** Color de acento por eje, ajustado para leerse sobre las tarjetas oscuras. */
const EJE_COLOR: Record<string, string> = {
  innovar: "#F478AF",
  adoptar: "#6666FF",
  escalar: "#1DD2B3",
};

export function Ejes() {
  const reduced = useReducedMotion();

  return (
    <section id="ejes" className="relative bg-[#CFCFCF] overflow-hidden px-6 sm:px-10 py-24 sm:py-32">
      <div className="relative mx-auto max-w-[1280px]">
        <div className="max-w-[1180px] mb-16">
          <div className="eyebrow">Tres ejes · un objetivo</div>
          <h2
            className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-4 whitespace-nowrap"
            style={{ fontSize: "clamp(24px, 6.5vw, 74px)" }}
          >
            Innova. Adopta. Escala.
          </h2>
          <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-ink-soft max-w-[620px]">
            Que la IA funcione en tu empresa. Tres tracks paralelos durante dos días — escoge tu camino o cruza entre ellos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ejes.map((e, idx) => {
            const color = EJE_COLOR[e.id] ?? e.color;
            return (
              <motion.article
                key={e.id}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.08 * (idx + 1) }}
                className="bg-[#111113] rounded-[6px] p-8 sm:p-10 pb-14 sm:pb-16 flex flex-col min-h-[435px]"
              >
                <Image
                  src={e.icon}
                  alt={`Eje ${e.title}`}
                  width={128}
                  height={128}
                  className="w-[91px] h-[91px] object-contain mt-[20px]"
                />

                <div className="mt-[35px]">
                  {/* Título + etiqueta EJE 0X */}
                  <div className="flex items-end justify-between gap-4">
                    <h3
                      className="font-[var(--font-display)] font-bold tracking-[-0.03em] m-0 leading-none"
                      style={{ fontSize: "clamp(30px, 3vw, 40px)", color }}
                    >
                      {e.title}
                    </h3>
                    <div className="text-right leading-none shrink-0" style={{ color }}>
                      <div className="font-[var(--font-body)] text-[11px] font-semibold tracking-[0.1em]">
                        EJE
                      </div>
                      <div className="font-[var(--font-display)] text-lg font-bold mt-1">
                        {e.n}
                      </div>
                    </div>
                  </div>

                  {/* Línea de acento */}
                  <div className="h-[3px] w-full mt-4 mb-6 rounded-full" style={{ background: color }} />

                  <div className="font-[var(--font-body)] text-[15px] font-bold text-white mb-4">
                    {e.sub}
                  </div>

                  <p className="font-[var(--font-body)] text-[14px] leading-[1.6] text-white/55 m-0">
                    {e.desc}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
