import { event, eventDays, eventSchedule, type EventDayKey } from "@/lib/content";

/**
 * Generación de eventos de calendario para los días confirmados.
 * Compartido por los correos de confirmación (adjunto .ics + botones) y la
 * pantalla de éxito del formulario (mismos botones). Sin dependencias de
 * servidor: importable desde componentes cliente.
 *
 * Los horarios usan TZID=America/Santiago con un VTIMEZONE embebido para las
 * reglas 2026 (el 2-3 sep es UTC-4; el cambio a horario de verano es el 5-6
 * sep). Los clientes grandes (Google/Apple/Outlook) reconocen el TZID y usan
 * su propia base de zonas horarias, así que la hora es robusta incluso si el
 * decreto de cambio de hora se mueve.
 */

const DAY_BY_KEY = Object.fromEntries(eventDays.map((d) => [d.key, d])) as Record<
  EventDayKey,
  (typeof eventDays)[number]
>;

const TITLE = `${event.name} — ${event.edition}`;
const LOCATION = `${event.venue}, ${event.venueAddress}`;
const DESCRIPTION = `Tu cupo está confirmado. Programa y detalles en https://www.impactaia.cl`;

const compact = (isoDate: string) => isoDate.replaceAll("-", "");
const compactTime = (hhmm: string) => `${hhmm.replace(":", "")}00`;

/** Escapa comas, punto y coma y saltos según RFC 5545. */
function escapeIcs(s: string): string {
  return s.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

/** Pliega líneas a ≤74 caracteres (continuación = CRLF + espacio, RFC 5545). */
function foldIcsLine(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
}

export function icsForDay(key: EventDayKey): string {
  const day = DAY_BY_KEY[key];
  const d = compact(day.date);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Impacta IA//Confirmacion 2026//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${eventSchedule.timezone}`,
    "BEGIN:STANDARD",
    "DTSTART:20260405T000000",
    "TZOFFSETFROM:-0300",
    "TZOFFSETTO:-0400",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:20260906T000000",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0300",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    // UID estable por día: re-importar actualiza el mismo evento en vez de duplicarlo.
    `UID:impacta-ia-${day.date}@impactaia.cl`,
    "DTSTAMP:20260716T120000Z",
    `DTSTART;TZID=${eventSchedule.timezone}:${d}T${compactTime(eventSchedule.start)}`,
    `DTEND;TZID=${eventSchedule.timezone}:${d}T${compactTime(eventSchedule.end)}`,
    `SUMMARY:${escapeIcs(TITLE)}`,
    `LOCATION:${escapeIcs(LOCATION)}`,
    `DESCRIPTION:${escapeIcs(DESCRIPTION)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

export function icsFilename(key: EventDayKey): string {
  return `impacta-ia-${DAY_BY_KEY[key].date}.ics`;
}

export function googleCalendarUrl(key: EventDayKey): string {
  const day = DAY_BY_KEY[key];
  const d = compact(day.date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${d}T${compactTime(eventSchedule.start)}/${d}T${compactTime(eventSchedule.end)}`,
    ctz: eventSchedule.timezone,
    location: LOCATION,
    details: DESCRIPTION,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(key: EventDayKey): string {
  const day = DAY_BY_KEY[key];
  const params = new URLSearchParams({
    rru: "addevent",
    subject: TITLE,
    startdt: `${day.date}T${eventSchedule.start}:00`,
    enddt: `${day.date}T${eventSchedule.end}:00`,
    location: LOCATION,
    body: DESCRIPTION,
  });
  return `https://outlook.office.com/calendar/action/compose?${params}`;
}

/** Ruta del .ics descargable en el sitio (para Apple Calendar / descarga directa). */
export function icsDownloadPath(key: EventDayKey): string {
  return `/calendario/${DAY_BY_KEY[key].date}.ics`;
}
