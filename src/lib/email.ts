import "server-only";
import { Resend } from "resend";
import { event } from "@/lib/content";
import type { FormInteres } from "@/lib/content";
import type { PreRegistrationInput } from "@/lib/schema";

/**
 * Sends two emails after a successful pre-registration:
 *   1. Internal notification to NOTIFICATION_TO_EMAIL (Brinca team).
 *   2. Confirmation autoresponder to the user.
 *
 * Sender domain: correo.impactaia.cl (DKIM-signed, verified in Resend).
 * Reply-To is routed to the matching Brinca inbox per `interes`.
 *
 * Pre-launch dependency: the @impactaia.cl reply-to addresses must
 * actually receive email. Either Google Workspace MX on the apex, or
 * Cloudflare Email Routing forwarding to a real Brinca inbox. Until
 * one of those is in place, replies will bounce.
 *
 * No-op (logs and returns) if RESEND_API_KEY isn't set.
 */
const FROM_ADDRESS = "Impacta IA <hola@correo.impactaia.cl>";

/** Reply-to inbox per intent type — surfaces the right Brinca person. */
const REPLY_TO_BY_INTENT: Record<FormInteres, string> = {
  Asistir: event.contact.general,  // hola@impactaia.cl
  Speaker: event.contact.general,  // hola@impactaia.cl
  Sponsor: event.contact.sponsors, // sponsors@impactaia.cl
  Media:   event.contact.press,    // prensa@impactaia.cl
};

export async function sendPreRegistrationEmails(input: PreRegistrationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return;
  }
  const resend = new Resend(apiKey);
  const internalTo = process.env.NOTIFICATION_TO_EMAIL ?? "francisco.martinez@brinca.global";
  const userReplyTo = REPLY_TO_BY_INTENT[input.interes];

  // 1. Internal notification → Brinca team gets pinged with the new lead.
  //    Reply-To = the form submitter, so hitting "Responder" in Gmail goes
  //    straight to them without copy-pasting their address.
  const internal = resend.emails.send({
    from: FROM_ADDRESS,
    to: internalTo,
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

  // 2. Autoresponder to user → confirms receipt, sets expectations.
  //    Reply-To routed by intent: sponsors → sponsors@, media → prensa@,
  //    everything else → hola@. The recipient sees a clean From with
  //    impactaia branding and replies land in the right inbox.
  const user = resend.emails.send({
    from: FROM_ADDRESS,
    to: input.email,
    replyTo: userReplyTo,
    subject: `Recibimos tu pre-registro a ${event.name}`,
    text: [
      `Hola ${input.nombre.split(" ")[0]},`,
      ``,
      `Recibimos tu pre-registro a ${event.name} (${event.city}, ${event.monthYear}).`,
      ``,
      `Te escribiremos primero cuando se publique el programa, los speakers y los detalles para asegurar tu invitación (los cupos son limitados y curados).`,
      ``,
      `Si necesitas algo antes, escríbenos a ${userReplyTo}.`,
      ``,
      `— Equipo ${event.name}`,
      `Un evento de Brinca, con el respaldo de CORFO.`,
    ].join("\n"),
  });

  // Don't let one failed email break the other — fire both and log failures.
  const [internalRes, userRes] = await Promise.allSettled([internal, user]);
  if (internalRes.status === "rejected") console.error("[email] internal send failed", internalRes.reason);
  if (userRes.status === "rejected") console.error("[email] user send failed", userRes.reason);
}
