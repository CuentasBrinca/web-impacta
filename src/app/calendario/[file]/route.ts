import { eventDays } from "@/lib/content";
import { icsForDay } from "@/lib/calendar";

/**
 * Sirve el .ics de cada día del evento: /calendario/2026-09-02.ics
 * Mismo contenido que el adjunto del correo de confirmación (lib/calendar.ts).
 * Sin datos personales → público y cacheable. Lo usa la pantalla de éxito
 * del formulario como opción "Apple Calendar / descargar".
 */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const day = eventDays.find((d) => `${d.date}.ics` === file);
  if (!day) return new Response("Not found", { status: 404 });

  return new Response(icsForDay(day.key), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="impacta-ia-${day.date}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
