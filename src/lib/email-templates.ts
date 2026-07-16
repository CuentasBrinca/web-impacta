import { event, eventDays, eventSchedule, type EventDayKey } from "@/lib/content";
import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar";
import type { RegistrationOutcome } from "@/lib/schema";

/**
 * Templates de los correos transaccionales — módulo PURO (sin server-only,
 * sin Resend, sin Supabase) para poder testearlo y previsualizarlo fuera del
 * runtime de Next. El envío vive en email.ts.
 *
 * Copy aprobado por Francisco (jul 2026) — cambios de texto pasan por él.
 *
 * Nota de compatibilidad: los fondos van como atributo `bgcolor` ADEMÁS del
 * style inline — Gmail/Outlook eliminan `background` de CSS con frecuencia
 * (fue lo que borró la banda oscura del header en la v1).
 */

const SIGNATURE_PLAIN = [
  "— Equipo Impacta IA",
  "Un evento de Brinca, Chile Global Ventures y la Universidad Adolfo Ibáñez, con el respaldo de CORFO.",
];

const DAY_BY_KEY = Object.fromEntries(eventDays.map((d) => [d.key, d])) as Record<
  EventDayKey,
  (typeof eventDays)[number]
>;

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${event.venue}, ${event.venueAddress}`
)}`;

/** "el miércoles 2 de septiembre" / "el miércoles 2 y el jueves 3 de septiembre" */
function dayPhrase(keys: EventDayKey[]): string {
  const lower = keys.map((k) => DAY_BY_KEY[k].label.charAt(0).toLowerCase() + DAY_BY_KEY[k].label.slice(1));
  if (lower.length === 1) return `el ${lower[0]}`;
  return `el ${lower[0].replace(" de septiembre", "")} y el ${lower[1]}`;
}

/** Para asuntos y titulares: "2 y 3 de septiembre" / "miércoles 2 de septiembre" */
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
  const lines = ["Haz click para agregar el evento a tu calendario (también va adjunta la invitación):"];
  for (const k of keys) {
    lines.push(`· ${DAY_BY_KEY[k].label}:`);
    lines.push(`  Google Calendar: ${googleCalendarUrl(k)}`);
    lines.push(`  Outlook: ${outlookCalendarUrl(k)}`);
  }
  return lines;
}

// ---------------------------------------------------------------------------
// HTML — marca Impacta IA: banda tinta con logo, titular display, tarjeta de
// datos del evento, botones rosa. Todo table-based + bgcolor para máxima
// compatibilidad entre clientes.
// ---------------------------------------------------------------------------
const PINK = "#ed1e79";
const INK = "#0e0e10";
const FONT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function htmlShell(headline: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="es"><body style="margin:0;padding:0;" bgcolor="#f4f4f5">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f4f5" style="padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:560px;width:100%;border-radius:12px;overflow:hidden;">
<tr><td bgcolor="${INK}" style="padding:22px 32px;">
<img src="https://www.impactaia.cl/img/logo-horizontal-white.png" alt="Impacta IA" width="150" height="31" style="display:block;border:0;" />
</td></tr>
<tr><td style="padding:32px 32px 8px;font-family:${FONT};">
<div style="font-size:26px;line-height:1.25;font-weight:800;letter-spacing:-0.02em;color:${INK};">${headline}</div>
</td></tr>
<tr><td style="padding:16px 32px 8px;font-family:${FONT};font-size:15px;line-height:1.6;color:#1a1a1c;">
${bodyHtml}
</td></tr>
<tr><td style="padding:20px 32px 28px;font-family:${FONT};font-size:12px;line-height:1.5;color:#747476;border-top:1px solid #ececee;">
— Equipo Impacta IA<br/>Un evento de Brinca, Chile Global Ventures y la Universidad Adolfo Ib&aacute;&ntilde;ez, con el respaldo de CORFO.
</td></tr>
</table></td></tr></table></body></html>`;
}

const p = (s: string) => `<p style="margin:0 0 16px;">${s}</p>`;

/** Tarjeta con los datos del evento: días, horario y sede con link a Maps. */
function eventCardHtml(keys: EventDayKey[]): string {
  const dias = keys.map((k) => DAY_BY_KEY[k].label).join(" y ").replace(" de septiembre y", " y");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f7f7f8" style="border-radius:10px;margin:0 0 20px;"><tr><td style="padding:18px 20px;font-family:${FONT};font-size:14px;line-height:1.7;color:#1a1a1c;">
<strong>${dias}</strong><br/>
${eventSchedule.start} a ${eventSchedule.end} hrs.<br/>
${event.venue} · ${event.venueAddress}<br/>
<a href="${MAPS_URL}" style="color:${PINK};font-weight:600;">Ver en Google Maps →</a>
</td></tr></table>`;
}

function calendarButtonsHtml(keys: EventDayKey[]): string {
  const btn = (href: string, label: string) =>
    `<a href="${href}" style="background:${PINK};color:#ffffff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;font-size:13px;font-weight:600;margin:0 8px 8px 0;" bgcolor="${PINK}">${label}</a>`;
  const rows = keys
    .map(
      (k) =>
        `<div style="margin:0 0 12px;"><div style="font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#747476;margin:0 0 7px;">${DAY_BY_KEY[k].label}</div>` +
        btn(googleCalendarUrl(k), "Google Calendar") +
        btn(outlookCalendarUrl(k), "Outlook") +
        `</div>`
    )
    .join("");
  return `<div style="font-size:15px;font-weight:700;color:${INK};margin:0 0 12px;">Haz click para agregar el evento a tu calendario</div>${rows}<p style="margin:0 0 16px;font-size:12px;color:#747476;">La invitación también va adjunta — en Apple Mail/Calendar basta un click.</p>`;
}

// ---------------------------------------------------------------------------
// Templates por resultado
// ---------------------------------------------------------------------------
export type EmailContent = {
  subject: string;
  text: string;
  html: string;
  attachDays: EventDayKey[];
};

export function buildOutcomeEmail(
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
      `Cómo llegar: ${MAPS_URL}`,
      ``,
      ...calendarLinesPlain(confirmed),
      ``,
      `Serás parte de un grupo curado de 400 líderes — keynotes internacionales, paneles por función ejecutiva y casos reales de IA aplicada en Chile. Tu cupo es personal e intransferible.`,
      ``,
      `Si tu agenda cambia, responde este correo para liberar tu lugar a tiempo.`,
      ``,
      `Nos vemos en septiembre.`,
      ``,
      ...SIGNATURE_PLAIN,
    ].join("\n");
    const html = htmlShell(
      "Estás confirmado ✓",
      p(`Hola ${first},`) +
        p(`Tu cupo en <strong>${event.name}</strong> está confirmado para <strong>${dayPhrase(confirmed)}</strong>.`) +
        eventCardHtml(confirmed) +
        calendarButtonsHtml(confirmed) +
        p(`Serás parte de un grupo curado de 400 líderes — keynotes internacionales, paneles por función ejecutiva y casos reales de IA aplicada en Chile. Tu cupo es personal e intransferible.`) +
        p(`Si tu agenda cambia, responde este correo para liberar tu lugar a tiempo.`) +
        p(`Nos vemos en septiembre.`)
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
      `Cómo llegar: ${MAPS_URL}`,
      ``,
      ...calendarLinesPlain(confirmed),
      ``,
      `Si tu agenda cambia, responde este correo para liberar tu lugar a tiempo.`,
      ``,
      `Nos vemos en septiembre.`,
      ``,
      ...SIGNATURE_PLAIN,
    ].join("\n");
    const html = htmlShell(
      `Confirmado para el ${subjectDays(confirmed)}`,
      p(`Hola ${first},`) +
        p(`Tu cupo en <strong>${event.name}</strong> está confirmado para <strong>${dayPhrase(confirmed)}</strong>.`) +
        p(`Para ${dayPhrase(waitlisted)} los cupos ya están completos: quedaste en <strong>lista de espera</strong> y te avisaremos por este medio si se libera un lugar.`) +
        eventCardHtml(confirmed) +
        calendarButtonsHtml(confirmed) +
        p(`Si tu agenda cambia, responde este correo para liberar tu lugar a tiempo.`) +
        p(`Nos vemos en septiembre.`)
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
      "Estás en lista de espera",
      p(`Hola ${first},`) +
        p(`Recibimos tu inscripción a <strong>${event.name}</strong> (${subjectDays(days)}). Los cupos para ${plural} ya están completos, así que quedaste en <strong>lista de espera</strong>.`) +
        p(`Los lugares se liberan con frecuencia a medida que las agendas ejecutivas se ajustan — si se abre un cupo, te escribiremos de inmediato a este correo con tu confirmación y los detalles.`) +
        p(`Si tienes dudas mientras tanto, escríbenos a <a href="mailto:${replyTo}" style="color:${PINK};">${replyTo}</a>.`)
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
    "Recibimos tu pre-registro",
    p(`Hola ${first},`) +
      p(`Recibimos tu pre-registro a <strong>${event.name}</strong> (${event.venue}, Santiago · ${event.dates}).`) +
      p(`Los cupos son limitados: nuestro equipo está revisando cada solicitud y te escribiremos a este correo para confirmar tu invitación.`) +
      p(`Mientras tanto, el programa y los speakers ya están publicados en <a href="https://www.impactaia.cl" style="color:${PINK};">impactaia.cl</a>.`) +
      p(`Si necesitas algo antes, escríbenos a <a href="mailto:${replyTo}" style="color:${PINK};">${replyTo}</a>.`)
  );
  return { subject: `Recibimos tu pre-registro · ${event.name}`, text, html, attachDays: [] };
}
