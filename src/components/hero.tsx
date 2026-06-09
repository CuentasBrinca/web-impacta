"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button, ButtonLink } from "@/components/ui/button";
import { event } from "@/lib/content";
import { dispatchFormIntent } from "@/lib/form-intent";

const EASE = [0.2, 0, 0, 1] as const;

const heroMeta = [
  { lbl: "FECHA",   val: event.dates,  sub: undefined },
  { lbl: "LUGAR",   val: event.venue,  sub: event.venueAddress },
  { lbl: "FORMATO", val: event.format, sub: undefined },
  { lbl: "CUPOS",   val: event.capacity, sub: undefined },
] as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <header
      id="top"
      className="relative min-h-screen overflow-hidden flex flex-col justify-end bg-night text-white px-6 sm:px-10 pt-28 sm:pt-36 pb-20"
    >
      {/* Subtle photo texture */}
      <Image
        src="/img/bg-photo-3.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-[0.22] mix-blend-screen pointer-events-none select-none"
      />

      {/* Soft radial blue accent — single warm glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          right: "-10%",
          top: "0%",
          width: "60%",
          height: "70%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,255,0.18) 0%, rgba(0,0,255,0) 60%)",
        }}
        aria-hidden
      />

      {/* Bottom gradient for type contrast */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 40%, rgba(14,14,16,0.85) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px]">
        {/* Top label row */}
        <div className="absolute -top-72 sm:-top-96 left-0 flex flex-wrap items-center gap-3.5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.16] text-white text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
            {event.edition}
          </span>
          <span className="text-[13px] tracking-wide text-white/55">
            {event.venue}, Santiago · {event.dates}
          </span>
        </div>

        {/* Headline */}
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-[var(--font-display)] font-bold leading-[1.12] tracking-[-0.035em] text-white max-w-[16ch] m-0"
          style={{ fontSize: "clamp(48px, 9vw, 152px)" }}
        >
          La conferencia
          <br />
          de IA para quienes
          <br />
          <span className="shimmer-text">toman decisiones.</span>
        </motion.h1>

        {/* Sub-head + CTAs row */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
          className="mt-12 grid gap-12 items-end grid-cols-1 lg:grid-cols-[1.2fr_1fr]"
        >
          <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-white/85 max-w-[560px] m-0">
            400 ejecutivos C-level. Dos días de inmersión en IA aplicada — sin teoría, sin clichés.
            Adopta. Escala. Innova.
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="#form" variant="primary" size="lg">
              Quiero participar →
            </ButtonLink>
            <Button variant="ghost-dark" size="lg" onClick={() => dispatchFormIntent("Sponsor")}>
              Ser sponsor
            </Button>
          </div>
        </motion.div>

        {/* Bottom meta ticker */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
          className="mt-20 pt-7 border-t border-white/12 grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {heroMeta.map((m) => (
            <div key={m.lbl}>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/50">
                {m.lbl}
              </div>
              <div className="font-[var(--font-display)] text-lg font-medium text-white mt-2 tracking-tight">
                {m.val}
              </div>
              {m.sub && (
                <div className="font-[var(--font-body)] text-xs text-white/55 leading-snug mt-1">
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
