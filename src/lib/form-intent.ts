import type { FormInteres } from "@/lib/content";

/**
 * Custom DOM event used to coordinate "open the form pre-selecting an intent"
 * across components without setting up React Context just for this.
 *
 * Dispatched by: hero "Ser sponsor" button, footer "Sponsorship" link, etc.
 * Consumed by: FormSection, which sets `interes` and runs a brief highlight
 * animation on the matching chip + scrolls into view.
 */
export const FORM_INTENT_EVENT = "impacta:set-form-intent";

export type FormIntentDetail = {
  interes: FormInteres;
};

/** Helper to dispatch the event from any client component. */
export function dispatchFormIntent(interes: FormInteres) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<FormIntentDetail>(FORM_INTENT_EVENT, { detail: { interes } })
  );
}
