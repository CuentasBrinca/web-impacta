import "server-only";
import { Resend } from "resend";
import { event } from "@/lib/content";
import type { PreRegistrationInput } from "@/lib/schema";

/**
 * Sends two emails after a successful pre-registration:
 *   1. Internal notification to NOTIFICATION_TO_EMAIL (sales/ops).
 *   2. Confirmation autoresponder to the user.
 *
 * No-op (logs and returns) if RESEND_API_KEY isn't set yet.
 *
 * BLOCKER pre-launch: verify the impactaia.cl domain in Resend and switch
 * the `from` addresses below from the testing domain to hola@impactaia.cl.
 */
const FROM_INTERNAL = "Impacta IA <onboarding@resend.dev>";
const FROM_USER = "Impacta IA <onboarding@resend.dev>";

export async function sendPreRegistrationEmails(input: PreRegistrationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return;
  }
  const resend = new Resend(apiKey);
  const to = process.env.NOTIFICATION_TO_EMAIL ?? "francisco.martinez@brinca.global";

  const internal = resend.emails.send({
    from: FROM_INTERNAL,
    to,
    replyTo: input.email,
    subject: `[Impacta IA] Nuevo pre-registro · ${input.interes} · ${input.empresa}`,
    text: [
      `Nombre:   ${input.nombre}`,
      `Email:    ${input.email}`,
      `Empresa:  ${input.empresa}`,
      `Cargo:    ${input.cargo}`,
      `Interés:  ${input.interes}`,
      ``,
      `Consent (Ley 21.719): ${input.consent ? "sí" : "no"}`,
      ``,
      `Dashboard: https://supabase.com/dashboard/project/slsjrbfqkvcelqmkfenh/editor`,
    ].join("\n"),
  });

  const user = resend.emails.send({
    from: FROM_USER,
    to: input.email,
    subject: `Recibimos tu pre-registro a ${event.name}`,
    text: [
      `Hola ${input.nombre.split(" ")[0]},`,
      ``,
      `Recibimos tu pre-registro a ${event.name} (${event.city}, ${event.monthYear}).`,
      ``,
      `Te escribiremos primero cuando se publique el programa, los speakers y los detalles para asegurar tu invitación (los cupos son limitados y curados).`,
      ``,
      `Si necesitas algo antes, escríbenos a ${event.contact.general}.`,
      ``,
      `— Equipo ${event.name}`,
      `Un evento de Brinca, con el respaldo de CORFO.`,
    ].join("\n"),
  });

  // Don't let one failed email break the other.
  const [internalRes, userRes] = await Promise.allSettled([internal, user]);
  if (internalRes.status === "rejected") console.error("[email] internal send failed", internalRes.reason);
  if (userRes.status === "rejected") console.error("[email] user send failed", userRes.reason);
}
