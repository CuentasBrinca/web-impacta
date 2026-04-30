"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHARE_TEXT =
  "Impacta IA · Conferencia de IA para C-suite · Santiago · Septiembre 2026. Pre-regístrate aquí:";

const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://impactaia.cl";

/**
 * Share affordances. Mobile gets a dedicated WhatsApp button (the dominant
 * channel for our audience in Chile). Desktop gets a copy-link button.
 *
 * Both render in the DOM; visibility is controlled with Tailwind responsive
 * utilities so the SSR HTML is identical on the server and the client (no
 * hydration mismatch / flash of wrong button).
 */
export function ShareButton() {
  return (
    <div className="flex flex-wrap items-center gap-2.5 self-start">
      <WhatsappShare />
      <CopyLinkShare />
    </div>
  );
}

/* -------------------------------------------------------------------------
   WhatsApp — mobile only. wa.me works for both app and web.
   ------------------------------------------------------------------------- */

function WhatsappShare() {
  const text = encodeURIComponent(`${SHARE_TEXT} ${SITE_URL}`);
  const href = `https://wa.me/?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-share="whatsapp"
      className="md:hidden group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#25D366]/40 hover:border-[#25D366] bg-paper text-ink font-[var(--font-body)] text-sm font-semibold transition-colors duration-200 active:scale-[0.98]"
      aria-label="Comparte por WhatsApp"
    >
      <WhatsappIcon className="text-[#25D366] transition-transform duration-200 group-hover:scale-110" />
      <span>Comparte por WhatsApp</span>
    </a>
  );
}

function WhatsappIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.005 0C5.376 0 .005 5.371.005 12c0 2.117.553 4.184 1.602 6.005L0 24l6.135-1.605A11.96 11.96 0 0 0 12.005 24c6.629 0 12-5.371 12-12s-5.371-12-12-12zm0 21.799a9.79 9.79 0 0 1-4.991-1.366l-.358-.213-3.71.973.99-3.621-.232-.371a9.795 9.795 0 0 1-1.504-5.201c0-5.41 4.4-9.811 9.811-9.811 2.62 0 5.082 1.022 6.937 2.876a9.747 9.747 0 0 1 2.873 6.94c-.005 5.412-4.405 9.794-9.816 9.794z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
   Copy link — desktop dominant; also a fallback for mobile when WhatsApp
   isn't the user's preferred channel.
   ------------------------------------------------------------------------- */

function CopyLinkShare() {
  const [state, setState] = useState<"idle" | "copied">("idle");

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${SITE_URL}`);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      // last resort silent fail — the user can try again
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-ink-faint hover:border-ink bg-paper text-ink font-[var(--font-body)] text-sm font-semibold transition-colors duration-200 active:scale-[0.98]"
      aria-label="Copiar link al portapapeles"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span className="relative inline-block min-w-[88px] text-left">
        <AnimatePresence mode="wait" initial={false}>
          {state === "idle" ? (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              Copiar link
            </motion.span>
          ) : (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="text-blue-500"
            >
              ¡Copiado!
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
