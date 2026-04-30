"use client";

import type { FormInteres } from "@/lib/content";
import { dispatchFormIntent } from "@/lib/form-intent";

/**
 * Footer link that pre-selects a form interest before scrolling to #form.
 * Used by Sponsorship / Press / Speaker entries — anywhere we want the form
 * to "open already configured" for the user's intent.
 */
export function FooterIntentLink({
  intent,
  children,
}: {
  intent: FormInteres;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => dispatchFormIntent(intent)}
      className="font-[var(--font-body)] text-sm text-white text-left bg-transparent border-0 p-0 cursor-pointer transition-colors duration-150 hover:text-mint-500"
    >
      {children}
    </button>
  );
}
