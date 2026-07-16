import ExcelJS from "exceljs";
import { isAuthed } from "@/lib/admin-auth";
import {
  fetchRegistrations,
  parseFilters,
  statusLabels,
  dayStatusLabels,
  type Status,
  type DayStatus,
} from "@/lib/admin-data";

const dayLabel = (st: DayStatus) => (st ? dayStatusLabels[st] : "—");

// Node runtime (exceljs + Buffer); never cache — live data.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export async function GET(request: Request) {
  if (!(await isAuthed())) {
    return new Response("No autorizado", { status: 401 });
  }

  const url = new URL(request.url);
  const filters = parseFilters({
    q: url.searchParams.get("q") ?? undefined,
    interes: url.searchParams.get("interes") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    dia: url.searchParams.get("dia") ?? undefined,
    // El export SIEMPRE excluye las filas de prueba del equipo.
    test: "ocultar",
  });

  const rows = await fetchRegistrations(filters);

  const wb = new ExcelJS.Workbook();
  wb.creator = "Impacta IA · Admin";
  const ws = wb.addWorksheet("Inscritos", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = [
    { header: "Fecha", key: "fecha", width: 18 },
    { header: "Nombre", key: "nombre", width: 26 },
    { header: "Email", key: "email", width: 30 },
    { header: "Teléfono", key: "telefono", width: 18 },
    { header: "Empresa", key: "empresa", width: 26 },
    { header: "Nivel", key: "cargo", width: 26 },
    { header: "Área", key: "area", width: 26 },
    { header: "Motivación", key: "motivacion", width: 40 },
    { header: "Interés", key: "interes", width: 12 },
    { header: "Día 2 sep", key: "dia2", width: 12 },
    { header: "Día 3 sep", key: "dia3", width: 12 },
    { header: "Estado", key: "estado", width: 16 },
    { header: "Último correo", key: "correo", width: 18 },
    { header: "Notas", key: "notas", width: 40 },
    { header: "Fuente", key: "source", width: 16 },
    { header: "Consentimiento", key: "consent", width: 15 },
    { header: "Comparte con sponsors", key: "consentSponsors", width: 20 },
  ];

  for (const r of rows) {
    ws.addRow({
      fecha: dateFmt.format(new Date(r.created_at)),
      nombre: r.nombre,
      email: r.email,
      telefono: r.telefono ?? "",
      empresa: r.empresa,
      cargo: r.cargo,
      area: r.area ?? "",
      motivacion: r.motivacion ?? "",
      interes: r.interes,
      dia2: dayLabel(r.dia_sep2),
      dia3: dayLabel(r.dia_sep3),
      estado: statusLabels[r.status as Status] ?? r.status,
      correo: r.email_status === "sent" ? "Enviado" : r.email_status === "failed" ? "FALLÓ" : "—",
      notas: r.notes ?? "",
      source: r.source ?? "",
      consent: r.consent ? "Sí" : "No",
      consentSponsors: r.consent_sponsors ? "Sí" : "No",
    });
  }

  // Header styling
  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.alignment = { vertical: "middle" };
  header.height = 22;
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0000FF" } };
  });
  ws.autoFilter = { from: "A1", to: "Q1" };

  const buf = await wb.xlsx.writeBuffer();

  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `inscritos-impacta-ia-${stamp}.xlsx`;

  return new Response(Buffer.from(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
