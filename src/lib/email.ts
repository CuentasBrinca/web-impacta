import "server-only";
import { Resend } from "resend";
import { event, NIVEL_OTRO, AREA_OTRO, type EventDayKey } from "@/lib/content";
import type { FormInteres } from "@/lib/content";
import { icsForDay, icsFilename } from "@/lib/calendar";
import { buildOutcomeEmail } from "@/lib/email-templates";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { PreRegistrationInput, RegistrationOutcome } from "@/lib/schema";

/**
 * Envío de los correos transaccionales de la inscripción. Los templates
 * (4 variantes según RegistrationOutcome) viven en email-templates.ts.
 *
 * Cada envío al usuario queda registrado en su fila (email_type/status/
 * error/sent_at) para que el admin muestre fallos y permita reenviar.
 *
 * Sender domain: correo.impactaia.cl (DKIM-signed, verified in Resend).
 * Si RESEND_API_KEY falta, la fila queda 'failed' con el motivo — visible
 * en el admin en vez de perderse en un log.
 */
const FROM_ADDRESS = "Impacta IA <hola@correo.impactaia.cl>";

/** Reply-to inbox per intent type — surfaces the right Brinca person. */
const REPLY_TO_BY_INTENT: Record<FormInteres, string> = {
  Asistente: event.contact.general,  // hola@impactaia.cl
  Speaker: event.contact.general,  // hola@impactaia.cl
  Sponsor: event.contact.sponsors, // sponsors@impactaia.cl
  Media:   event.contact.press,    // prensa@impactaia.cl
};

export type OutcomeEmailParams = {
  registrationId: string;
  nombre: string;
  email: string;
  interes: FormInteres;
  outcome: RegistrationOutcome;
  confirmedDays: EventDayKey[];
  waitlistedDays: EventDayKey[];
};

/**
 * Envía el correo al inscrito según su resultado y registra el envío en su
 * fila. Reutilizado por: el formulario, la confirmación manual del admin y
 * el botón "reenviar". Nunca lanza: devuelve { sent, error }.
 */
export async function sendOutcomeEmail(params: OutcomeEmailParams): Promise<{ sent: boolean; error?: string }> {
  const replyTo = REPLY_TO_BY_INTENT[params.interes] ?? event.contact.general;
  const content = buildOutcomeEmail(
    params.nombre,
    params.outcome,
    params.confirmedDays,
    params.waitlistedDays,
    replyTo
  );

  let sendError: string | null = null;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    sendError = "RESEND_API_KEY not set";
  } else {
    try {
      const resend = new Resend(apiKey);
      const res = await resend.emails.send({
        from: FROM_ADDRESS,
        to: params.email,
        replyTo,
        subject: content.subject,
        text: content.text,
        html: content.html,
        attachments: content.attachDays.map((k) => ({
          filename: icsFilename(k),
          content: Buffer.from(icsForDay(k)),
          contentType: "text/calendar; method=PUBLISH",
        })),
      });
      if (res.error) sendError = res.error.message ?? String(res.error);
    } catch (e) {
      sendError = e instanceof Error ? e.message : String(e);
    }
  }

  // Registrar el resultado en la fila — el admin muestra fallos y permite reenviar.
  const { error: dbError } = await supabaseAdmin()
    .from("pre_registrations")
    .update({
      email_type: params.outcome,
      email_status: sendError ? "failed" : "sent",
      email_error: sendError,
      email_sent_at: sendError ? null : new Date().toISOString(),
    })
    .eq("id", params.registrationId);
  if (dbError) console.error("[email] failed to record send status", dbError);
  if (sendError) console.error("[email] user send failed", sendError);

  return sendError ? { sent: false, error: sendError } : { sent: true };
}

/**
 * Flujo del formulario: notificación interna al equipo + correo al inscrito.
 * Un fallo en uno no bloquea el otro.
 */
export async function sendRegistrationEmail(args: {
  input: PreRegistrationInput;
  registrationId: string;
  outcome: RegistrationOutcome;
  confirmedDays: EventDayKey[];
  waitlistedDays: EventDayKey[];
}) {
  const { input } = args;
  const [internalRes, userRes] = await Promise.allSettled([
    sendInternalNotification(args),
    sendOutcomeEmail({
      registrationId: args.registrationId,
      nombre: input.nombre,
      email: input.email,
      interes: input.interes,
      outcome: args.outcome,
      confirmedDays: args.confirmedDays,
      waitlistedDays: args.waitlistedDays,
    }),
  ]);
  if (internalRes.status === "rejected") console.error("[email] internal send failed", internalRes.reason);
  if (userRes.status === "rejected") console.error("[email] user send failed", userRes.reason);
}

/** Notificación interna → Brinca team gets pinged with the new lead. */
async function sendInternalNotification(args: {
  input: PreRegistrationInput;
  outcome: RegistrationOutcome;
  confirmedDays: EventDayKey[];
  waitlistedDays: EventDayKey[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping internal notification");
    return;
  }
  const { input } = args;
  const resend = new Resend(apiKey);
  const internalTo = process.env.NOTIFICATION_TO_EMAIL ?? "francisco.martinez@brinca.global";
  // Si el nivel/área es "Otro", mostramos el texto que escribió el usuario.
  const nivelTxt = input.nivel === NIVEL_OTRO ? `${input.nivel}: ${input.nivelOtro}` : input.nivel;
  const areaTxt = input.area === AREA_OTRO ? `${input.area}: ${input.areaOtro}` : input.area;
  const outcomeTxt: Record<RegistrationOutcome, string> = {
    confirmed_full: "CONFIRMADO automáticamente",
    confirmed_partial: "Confirmado PARCIAL (resto en lista de espera)",
    waitlisted: "LISTA DE ESPERA (cupos llenos)",
    generic: "Pre-registro (revisión manual)",
  };
  const diasTxt =
    [input.diaSep2 && "2 sep", input.diaSep3 && "3 sep"].filter(Boolean).join(" + ") || "—";

  // Reply-To = the form submitter, so hitting "Responder" in Gmail goes
  // straight to them without copy-pasting their address.
  const res = await resend.emails.send({
    from: FROM_ADDRESS,
    to: internalTo,
    replyTo: input.email,
    subject: `[Impacta IA] Nuevo pre-registro · ${input.interes} · ${input.empresa}`,
    text: [
      `Nombre:       ${input.nombre}`,
      `Email:        ${input.email}`,
      `Teléfono:     ${input.telefono || "—"}`,
      `Organización: ${input.empresa}`,
      `Nivel:        ${nivelTxt}`,
      `Área:         ${areaTxt}`,
      `Interés:      ${input.interes}`,
      `Días:         ${diasTxt}`,
      `Resultado:    ${outcomeTxt[args.outcome]}`,
      ...(input.motivacion ? [``, `Motivación:`, input.motivacion] : []),
      ``,
      `Consent (Ley 21.719): ${input.consent ? "sí" : "no"}`,
      `Comparte contacto con sponsors: ${input.consentSponsors ? "SÍ" : "no"}`,
      ``,
      `Admin: https://www.impactaia.cl/admin`,
    ].join("\n"),
  });
  if (res.error) throw new Error(res.error.message ?? String(res.error));
}
