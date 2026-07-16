"use client";

import { useEffect, useState } from "react";

/**
 * Cuenta regresiva a la apertura del evento (miércoles 2 sep 2026, 09:00
 * hora de Santiago = 13:00 UTC — Chile sigue en UTC-4 hasta el cambio de
 * hora del 5-6 sep). Estilo de marca: tarjetas oscuras con borde sutil,
 * números en display rosa (como Stat del design system), labels uppercase.
 *
 * SSR-safe: renderiza "--" hasta montar en el cliente para evitar
 * hydration mismatch, y desaparece cuando el evento ya comenzó.
 */
const EVENT_START_UTC = Date.UTC(2026, 8, 2, 13, 0, 0);

type Parts = { d: number; h: number; m: number; s: number };

function remaining(): Parts | null {
  const diff = EVENT_START_UTC - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
    s: Math.floor(diff / 1_000) % 60,
  };
}

const UNITS: { key: keyof Parts; label: string }[] = [
  { key: "d", label: "Días" },
  { key: "h", label: "Horas" },
  { key: "m", label: "Minutos" },
  { key: "s", label: "Segundos" },
];

export function Countdown() {
  const [parts, setParts] = useState<Parts | null | "ssr">("ssr");

  useEffect(() => {
    setParts(remaining());
    const id = setInterval(() => setParts(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  // Evento ya comenzó → la cuenta regresiva desaparece.
  if (parts === null) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3" role="timer" aria-label="Cuenta regresiva al evento">
      {UNITS.map((u) => (
        <div
          key={u.key}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 min-w-[76px] sm:min-w-[96px]"
        >
          <span
            className="font-[family-name:var(--font-display)] font-bold leading-none tracking-[-0.02em] text-pink-500 tabular-nums"
            style={{ fontSize: "clamp(28px, 3.2vw, 44px)" }}
          >
            {parts === "ssr" ? "--" : String(parts[u.key]).padStart(2, "0")}
          </span>
          <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.14em] uppercase text-white/55 mt-2">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
