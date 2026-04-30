"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { numeros } from "@/lib/content";

function useCountUp(target: number, durationMs: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return value;
}

function StatCell({
  num,
  suffix,
  lbl,
  note,
  visible,
  isLast,
  isFirst,
}: {
  num: number;
  suffix: string;
  lbl: string;
  note: string;
  visible: boolean;
  isLast: boolean;
  isFirst: boolean;
}) {
  const v = useCountUp(num, 1600, visible);
  return (
    <div
      className={[
        "py-10 sm:py-12 px-4 sm:px-8",
        isFirst ? "sm:pl-0" : "",
        !isLast ? "sm:border-r sm:border-white/15" : "",
      ].join(" ")}
    >
      <div
        className="font-[var(--font-display)] font-bold leading-[0.95] tracking-[-0.04em] text-white"
        style={{ fontSize: "clamp(64px, 9vw, 144px)" }}
      >
        {v}
        {suffix}
      </div>
      <div className="font-[var(--font-body)] text-base font-medium text-white mt-4">
        {lbl}
      </div>
      <div className="font-[var(--font-body)] text-xs text-white/50 mt-1.5">
        {note}
      </div>
    </div>
  );
}

export function Numeros() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-night text-white px-6 sm:px-10 py-24 sm:py-32"
    >
      <Image
        src="/img/bg-photo-4.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.18] mix-blend-screen pointer-events-none select-none"
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="eyebrow text-white/60">El evento, en números</div>
        <h2
          className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-16 text-white max-w-[16ch]"
          style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
        >
          Escala íntima.
          <br />
          Conversaciones reales.
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-white/15">
          {numeros.map((s, i) => (
            <StatCell
              key={s.lbl}
              num={s.num}
              suffix={s.suffix}
              lbl={s.lbl}
              note={s.note}
              visible={visible}
              isFirst={i === 0}
              isLast={i === numeros.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
