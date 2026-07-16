import "server-only";
import { Resend } from "resend";
import { event, eventDays, eventSchedule, NIVEL_OTRO, AREA_OTRO, type EventDayKey } from "@/lib/content";
import type { FormInteres } from "@/lib/content";
import { icsForDay, icsFilename, googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { PreRegistrationInput, RegistrationOutcome } from "@/lib/schema";

/**
 * Correos transaccionales de la inscripción. Cuatro variantes según el
 * resultado (ver RegistrationOutcome en schema.ts):
 *
 *   confirmed_full    → confirmado en todos sus días — con calendario.
 *   confirmed_partial → confirmado en un día, lista de espera en el otro.
 *   waitlisted        → sin cupo en ninguno de sus días.
 *   generic           → no ejecutivos y otros intereses (autoresponder).
 *
 * Cada envío al usuario queda registrado en su fila (email_type/status/
 * error/sent_at) para que el admin muestre fallos y permita reenviar.
 * Copy aprobado por Francisco (jul 2026) — cambios de texto pasan por él.
 *
 * Sender domain: correo.impactaia.cl (DKIM-signed, verified in Resend).
 * No-op-con-registro si RESEND_API_KEY falta: la fila queda 'failed' con el
 * motivo, visible en el admin.
 */
const FROM_ADDRESS = "Impacta IA <hola@correo.impactaia.cl>";

const SIGNATURE_PLAIN = [
  "— Equipo Impacta IA",
  "Un evento de Brinca, Chile Global Ventures y la Universidad Adolfo Ibáñez, con el respaldo de CORFO.",
];

/** Reply-to inbox per intent type — surfaces the right Brinca person. */
const REPLY_TO_BY_INTENT: Record<FormInteres, string> = {
  Asistente: event.contact.general,  // hola@impactaia.cl
  Speaker: event.contact.general,  // hola@impactaia.cl
  Sponsor: event.contact.sponsors, // sponsors@impactaia.cl
  Media:   event.contact.press,    // prensa@impactaia.cl
};

const DAY_BY_KEY = Object.fromEntries(eventDays.map((d) => [d.key, d])) as Record<
  EventDayKey,
  (typeof eventDays)[number]
>;

/** "el miércoles 2 de septiembre" / "el miércoles 2 y el jueves 3 de septiembre" */
function dayPhrase(keys: EventDayKey[]): string {
  const lower = keys.map((k) => DAY_BY_KEY[k].label.charAt(0).toLowerCase() + DAY_BY_KEY[k].label.slice(1));
  if (lower.length === 1) return `el ${lower[0]}`;
  return `el ${lower[0].replace(" de septiembre", "")} y el ${lower[1]}`;
}

/** Para asuntos: "2 y 3 de septiembre" / "miércoles 2 de septiembre" */
function subjectDays(keys: EventDayKey[]): string {
  if (keys.length === 2) return "2 y 3 de septiembre";
  const l = DAY_BY_KEY[keys[0]].label;
  return l.charAt(0).toLowerCase() + l.slice(1);
}

const VENUE_LINES = [
  `${event.venue} — ${event.venueAddress}`,
  `${eventSchedule.start} a ${eventSchedule.end} hrs.`,
];

function calendarLinesPlain(keys: EventDayKey[]): string[] {
  const lines = ["Agrega el evento a tu calendario:"];
  for (const k of keys) {
    lines.push(`· ${DAY_BY_KEY[k].label}:`);
    lines.push(`  Google Calendar: ${googleCalendarUrl(k)}`);
    lines.push(`  Outlook: ${outlookCalendarUrl(k)}`);
  }
  lines.push("(adjuntamos también la invitación de calendario — un click en Apple Mail/Calendar)");
  return lines;
}

// ---------------------------------------------------------------------------
// HTML — armazón liviano con la marca (fondo blanco, header tinta, botón rosa)
// ---------------------------------------------------------------------------
const BRAND_PINK = "#ed1e79";
const BRAND_INK = "#0e0e10";

function htmlShell(bodyHtml: string): string {
  return `<!doctype html>
<html lang="es"><body style="margin:0;padding:0;background:#f4f4f5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:${BRAND_INK};padding:20px 32px;">
<img src="https://www.impactaia.cl/img/logo-horizontal-white.png" alt="Impacta IA" width="150" style="display:block;border:0;" />
</td></tr>
<tr><td style="padding:32px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1c;">
${bodyHtml}
</td></tr>
<tr><td style="padding:20px 32px 28px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#747476;border-top:1px solid #ececee;">
— Equipo Impacta IA<br/>Un evento de Brinca, Chile Global Ventures y la Universidad Adolfo Ib&aacute;&ntilde;ez, con el respaldo de CORFO.
</td></tr>
</table></td></tr></table></body></html>`;
}

const p = (s: string) => `<p style="margin:0 0 16px;">${s}</p>`;

function venueHtml(): string {
  return p(`<strong>${event.venue}</strong> — ${event.venueAddress}<br/>${eventSchedule.start} a ${eventSchedule.end} hrs.`);
}

function calendarButtonsHtml(keys: EventDayKey[]): string {
  const btn = (href: string, label: string) =>
    `<a href="${href}" style="background:${BRAND_PINK};color:#ffffff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;font-size:13px;font-weight:600;margin:0 8px 8px 0;">${label}</a>`;
  const rows = keys
    .map(
      (k) =>
        `<div style="margin:0 0 10px;"><div style="font-size:13px;color:#747476;margin:0 0 6px;">${DAY_BY_KEY[k].label}</div>` +
        btn(googleCalendarUrl(k), "Google Calendar") +
        btn(outlookCalendarUrl(k), "Outlook") +
        `</div>`
    )
    .join("");
  return `${rows}<p style="margin:0 0 16px;font-size:12px;color:#747476;">(adjuntamos también la invitación de calendario — un click en Apple Mail/Calendar)</p>`;
}

// ---------------------------------------------------------------------------
// Templates por resultado
// ---------------------------------------------------------------------------
type EmailContent = {
  subject: string;
  text: string;
  html: string;
  attachDays: EventDayKey[];
};

function buildOutcomeEmail(
  nombre: string,
  outcome: RegistrationOutcome,
  confirmed: EventDayKey[],
  waitlisted: EventDayKey[],
  replyTo: string
): EmailContent {
  const first = nombre.split(" ")[0];

  if (outcome === "confirmed_full") {
    const text = [
      `Hola ${first},`,
      ``,
      `Tu cupo en ${event.name} está confirmado para ${dayPhrase(confirmed)}.`,
      ``,
      ...VENUE_LINES,
      ``,
      ...calendarLinesPlain(confirmed),
      ``,
      `${event.name} reúne a 400 líderes — exclusivo C-level — en dos días de keynotes internacionales, paneles por función ejecutiva y casos reales de IA aplicada en Chile. Tu cupo es personal e intransferible.`,
      ``,
      `Si tu agenda cambia, avísanos respondiendo este correo para liberar tu lugar a tiempo.`,
      ``,
      `Nos vemos en septiembre,`,
      ...SIGNATURE_PLAIN,
    ].join("\n");
    const html = htmlShell(
      p(`Hola ${first},`) +
        p(`Tu cupo en <strong>${event.name}</strong> está confirmado para <strong>${dayPhrase(confirmed)}</strong>.`) +
        venueHtml() +
        calendarButtonsHtml(confirmed) +
        p(`${event.name} reúne a 400 líderes — exclusivo C-level — en dos días de keynotes internacionales, paneles por función ejecutiva y casos reales de IA aplicada en Chile. Tu cupo es personal e intransferible.`) +
        p(`Si tu agenda cambia, avísanos respondiendo este correo para liberar tu lugar a tiempo.`) +
        p(`Nos vemos en septiembre,`)
    );
    return {
      subject: `Estás confirmado · ${event.name} — ${subjectDays(confirmed)}`,
      text,
      html,
      attachDays: confirmed,
    };
  }

  if (outcome === "confirmed_partial") {
    const text = [
      `Hola ${first},`,
      ``,
      `Tu cupo en ${event.name} está confirmado para ${dayPhrase(confirmed)}.`,
      ``,
      `Para ${dayPhrase(waitlisted)} los cupos ya están completos: quedaste en lista de espera y te avisaremos por este medio si se libera un lugar.`,
      ``,
      ...VENUE_LINES,
      ``,
      ...calendarLinesPlain(confirmed),
      ``,
      `Si tu agenda cambia, avísanos respondiendo este correo para liberar tu lugar a tiempo.`,
      ``,
      `Nos vemos en septiembre,`,
      ...SIGNATURE_PLAIN,
    ].join("\n");
    const html = htmlShell(
      p(`Hola ${first},`) +
        p(`Tu cupo en <strong>${event.name}</strong> está confirmado para <strong>${dayPhrase(confirmed)}</strong>.`) +
        p(`Para ${dayPhrase(waitlisted)} los cupos ya están completos: quedaste en lista de espera y te avisaremos por este medio si se libera un lugar.`) +
        venueHtml() +
        calendarButtonsHtml(confirmed) +
        p(`Si tu agenda cambia, avísanos respondiendo este correo para liberar tu lugar a tiempo.`) +
        p(`Nos vemos en septiembre,`)
    );
    return {
      subject: `Tu cupo · ${event.name} — confirmado para el ${subjectDays(confirmed)}`,
      text,
      html,
      attachDays: confirmed,
    };
  }

  if (outcome === "waitlisted") {
    const days = [...confirmed, ...waitlisted];
    const plural = days.length > 1 ? "esos días" : "ese día";
    const text = [
      `Hola ${first},`,
      ``,
      `Recibimos tu inscripción a ${event.name} (${subjectDays(days)}). Los cupos para ${plural} ya están completos, así que quedaste en lista de espera.`,
      ``,
      `Los lugares se liberan con frecuencia a medida que las agendas ejecutivas se ajustan — si se abre un cupo, te escribiremos de inmediato a este correo con tu confirmación y los detalles.`,
      ``,
      `Si tienes dudas mientras tanto, escríbenos a ${replyTo}.`,
      ``,
      ...SIGNATURE_PLAIN,
    ].join("\n");
    const html = htmlShell(
      p(`Hola ${first},`) +
        p(`Recibimos tu inscripción a <strong>${event.name}</strong> (${subjectDays(days)}). Los cupos para ${plural} ya están completos, así que quedaste en <strong>lista de espera</strong>.`) +
        p(`Los lugares se liberan con frecuencia a medida que las agendas ejecutivas se ajustan — si se abre un cupo, te escribiremos de inmediato a este correo con tu confirmación y los detalles.`) +
        p(`Si tienes dudas mientras tanto, escríbenos a <a href="mailto:${replyTo}" style="color:${BRAND_PINK};">${replyTo}</a>.`)
    );
    return { subject: `Estás en lista de espera · ${event.name}`, text, html, attachDays: [] };
  }

  // generic — autoresponder revisado (sin "curados"; programa ya publicado)
  const text = [
    `Hola ${first},`,
    ``,
    `Recibimos tu pre-registro a ${event.name} (${event.venue}, Santiago · ${event.dates}).`,
    ``,
    `Los cupos son limitados: nuestro equipo está revisando cada solicitud y te escribiremos a este correo para confirmar tu invitación.`,
    ``,
    `Mientras tanto, el programa y los speakers ya están publicados en https://www.impactaia.cl.`,
    ``,
    `Si necesitas algo antes, escríbenos a ${replyTo}.`,
    ``,
    ...SIGNATURE_PLAIN,
  ].join("\n");
  const html = htmlShell(
    p(`Hola ${first},`) +
      p(`Recibimos tu pre-registro a <strong>${event.name}</strong> (${event.venue}, Santiago · ${event.dates}).`) +
      p(`Los cupos son limitados: nuestro equipo está revisando cada solicitud y te escribiremos a este correo para confirmar tu invitación.`) +
      p(`Mientras tanto, el programa y los speakers ya están publicados en <a href="https://www.impactaia.cl" style="color:${BRAND_PINK};">impactaia.cl</a>.`) +
      p(`Si necesitas algo antes, escríbenos a <a href="mailto:${replyTo}" style="color:${BRAND_PINK};">${replyTo}</a>.`)
  );
  return { subject: `Recibimos tu pre-registro · ${event.name}`, text, html, attachDays: [] };
}

// ---------------------------------------------------------------------------
// Envío + registro en la fila
// ---------------------------------------------------------------------------
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
      `Organización: ${input.empresa}`,
      `Nivel:        ${nivelTxt}`,
      `Área:         ${areaTxt}`,
      `Interés:      ${input.interes}`,
      `Días:         ${diasTxt}`,
      `Resultado:    ${outcomeTxt[args.outcome]}`,
      ...(input.motivacion ? [``, `Motivación:`, input.motivacion] : []),
      ``,
      `Consent (Ley 21.719): ${input.consent ? "sí" : "no"}`,
      ``,
      `Admin: https://www.impactaia.cl/admin`,
    ].join("\n"),
  });
  if (res.error) throw new Error(res.error.message ?? String(res.error));
}
