"use client";

import { usePathname } from "next/navigation";
import type { FormInteres } from "@/lib/content";
import { dispatchFormIntent, storePendingFormIntent } from "@/lib/form-intent";

/**
 * Footer link that pre-selects a form interest before scrolling to #form.
 * Used by Sponsorship / Press / Speaker entries — anywhere we want the form
 * to "open already configured" for the user's intent.
 *
 * On the home page the form is present, so we dispatch an in-page event.
 * On other pages (e.g. /terminos) there's no form to listen, so we stash the
 * intent and navigate to /#form, where FormSection applies it on load.
 */
const LINK_CLASS =
  "font-[var(--font-body)] text-sm text-white text-left bg-transparent border-0 p-0 cursor-pointer transition-colors duration-150 hover:text-mint-500";

export function FooterIntentLink({
  intent,
  children,
}: {
  intent: FormInteres;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <button type="button" onClick={() => dispatchFormIntent(intent)} className={LINK_CLASS}>
        {children}
      </button>
    );
  }

  return (
    <a
      href="/#form"
      onClick={() => storePendingFormIntent(intent)}
      className={`${LINK_CLASS} no-underline`}
    >
      {children}
    </a>
  );
}
