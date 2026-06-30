"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button, ButtonLink } from "@/components/ui/button";
import { event } from "@/lib/content";
import { dispatchFormIntent } from "@/lib/form-intent";

const EASE = [0.2, 0, 0, 1] as const;

const heroMeta = [
  { value: "02 y 03", value2: "Septiembre", sub: undefined, big: true },
  { value: event.venue, value2: undefined, sub: event.venueAddress, big: false },
  { value: "2 días", value2: undefined, sub: "Presencial y gratuito.", big: true },
  { value: "+400 cupos", value2: undefined, sub: "Exclusivo C-level, previa inscripción.", big: false },
] as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <header
      id="top"
      className="relative min-h-screen overflow-hidden flex flex-col bg-[#161618] text-white px-6 sm:px-10 pt-28 sm:pt-36 pb-12 sm:pb-16"
    >
      {/* Background image — molecule graphic (dark left, molecules right) */}
      <Image
        src="/img/bg-photo-2.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[30%_28%] scale-110 pointer-events-none select-none"
      />

      {/* Bottom gradient for type contrast over the stats row */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 55%, rgba(20,20,20,0.7) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] flex-1 flex flex-col justify-between">
        {/* Top group — headline, sub-head, CTAs */}
        <div>
          {/* Headline */}
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-[var(--font-display)] font-bold leading-[1.12] tracking-[-0.035em] text-white max-w-[16ch] m-0"
            style={{ fontSize: "clamp(40px, 7.2vw, 118px)" }}
          >
            La conferencia
            <br />
            de IA para quienes
            <br />
            <span className="shimmer-text">toman decisiones.</span>
          </motion.h1>

          {/* Sub-head + CTAs */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
            className="mt-5 sm:mt-7 max-w-[600px]"
          >
            <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-white/85 m-0">
              400 ejecutivos C-level. Dos días de inmersión en IA aplicada — sin teoría, sin clichés. Adopta. Escala. Innova.
            </p>
            <div className="flex flex-wrap gap-3 mt-8 justify-center sm:justify-end">
              <ButtonLink href="#form" variant="primary" size="lg">
                Quiero participar →
              </ButtonLink>
              <Button variant="inverse" size="lg" onClick={() => dispatchFormIntent("Sponsor")}>
                Ser sponsor
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom meta row */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
          className="mt-16 pt-7 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6"
        >
          {heroMeta.map((m) => (
            <div key={m.value}>
              <div
                className="font-[var(--font-display)] font-bold text-white leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: m.big ? "clamp(28px, 2.8vw, 40px)" : "clamp(19px, 1.6vw, 22px)" }}
              >
                {m.value}
                {m.value2 && (
                  <>
                    <br />
                    {m.value2}
                  </>
                )}
              </div>
              {m.sub && (
                <div className="font-[var(--font-body)] text-[13px] text-white/55 leading-snug mt-2 max-w-[230px]">
                  {m.sub}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
