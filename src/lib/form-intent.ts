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

/**
 * For links that live on pages without the form (e.g. /terminos): the form
 * can't receive the in-page event, so we stash the intent and let FormSection
 * pick it up after navigating to /#form.
 */
const PENDING_INTENT_KEY = "impacta:pending-form-intent";

export function storePendingFormIntent(interes: FormInteres) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_INTENT_KEY, interes);
  } catch {
    // sessionStorage unavailable (private mode / blocked) — degrade silently
  }
}

/** Read and clear any intent stashed before navigation. */
export function takePendingFormIntent(): FormInteres | null {
  if (typeof window === "undefined") return null;
  try {
    const v = sessionStorage.getItem(PENDING_INTENT_KEY);
    if (v) sessionStorage.removeItem(PENDING_INTENT_KEY);
    return (v as FormInteres) || null;
  } catch {
    return null;
  }
}
