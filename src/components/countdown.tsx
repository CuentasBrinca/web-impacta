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
    <div role="timer" aria-label="Cuenta regresiva al inicio del evento">
      <div className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.16em] uppercase text-white/60 mb-3">
        El evento comienza en
      </div>
      {/* grid-cols-4 fijo: las 4 tarjetas SIEMPRE miden lo mismo y nunca
          caen a una segunda fila (la etiqueta más larga no estira su celda) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-[420px] sm:max-w-none sm:w-fit">
        {UNITS.map((u) => (
          <div
            key={u.key}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] backdrop-blur-sm px-2 py-3 sm:py-4 sm:w-[112px]"
          >
            <span
              className="font-[family-name:var(--font-display)] font-bold leading-none tracking-[-0.02em] text-pink-500 tabular-nums"
              style={{ fontSize: "clamp(26px, 3.2vw, 44px)" }}
            >
              {parts === "ssr" ? "--" : String(parts[u.key]).padStart(2, "0")}
            </span>
            <span className="font-[family-name:var(--font-body)] text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase text-white/55 mt-2">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
