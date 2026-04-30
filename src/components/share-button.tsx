"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHARE_TEXT =
  "Impacta IA · Conferencia de IA para C-suite · Santiago · Septiembre 2026. Pre-regístrate aquí:";

/**
 * Comparte vía Web Share API si está disponible (móvil),
 * con fallback a copiar al portapapeles (desktop). Feedback visual en ambos casos.
 */
export function ShareButton() {
  const [state, setState] = useState<"idle" | "shared" | "copied">("idle");

  const handle = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://impactaia.cl";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Impacta IA", text: SHARE_TEXT, url });
        setState("shared");
        setTimeout(() => setState("idle"), 2000);
        return;
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return; // user cancelled
        // fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      // last resort: do nothing — the share affordance just won't confirm
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      className="group inline-flex items-center gap-2.5 self-start px-4 py-2.5 rounded-full border border-ink-faint hover:border-ink bg-paper text-ink font-[var(--font-body)] text-sm font-semibold transition-colors duration-200"
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      <span className="relative inline-block min-w-[88px] text-left">
        <AnimatePresence mode="wait" initial={false}>
          {state === "idle" && (
            <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
              Compártelo
            </motion.span>
          )}
          {state === "copied" && (
            <motion.span key="copied" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="text-blue-500">
              ¡Link copiado!
            </motion.span>
          )}
          {state === "shared" && (
            <motion.span key="shared" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="text-mint-500">
              ¡Compartido!
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
