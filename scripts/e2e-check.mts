/**
 * E2E de navegador contra el dev server + Supabase local.
 * Cubre: formulario (días obligatorios, variantes de éxito), admin (login,
 * confirmación guiada, cancelación, reenvío, purga de pruebas) y export.
 * Temporal — se borra tras la validación (no es infra de CI).
 */
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const BASE = "http://localhost:3000";
const sb = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

let failures = 0;
const check = (cond: boolean, label: string, extra?: unknown) => {
  console.log(cond ? "PASS:" : "FAIL:", label, cond ? "" : (extra ?? ""));
  if (!cond) failures++;
};

// estado limpio
await sb.from("pre_registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await sb.from("event_days").update({ cupo: 200 }).neq("day", "1900-01-01");

const browser = await chromium.launch();
const page = await browser.newPage();

async function fillForm(opts: { nombre: string; email: string; nivel: string; dias: ("sep2" | "sep3")[] }) {
  // goto al mismo URL+hash es same-document y no desmonta la SuccessCard — reload explícito.
  await page.goto(`${BASE}/#form`);
  await page.reload();
  await page.fill('input[placeholder="Nombre y Apellido"]', opts.nombre);
  await page.fill('input[placeholder="nombre@empresa.cl"]', opts.email);
  await page.fill('input[placeholder="Empresa"]', "ACME Test");
  await page.selectOption("select >> nth=0", opts.nivel);
  await page.selectOption("select >> nth=1", "Innovación");
  for (const d of opts.dias) {
    const label = d === "sep2" ? "Miércoles 2 de septiembre" : "Jueves 3 de septiembre";
    await page.click(`button[role="checkbox"]:has-text("${label}")`);
  }
  await page.check('input[type="checkbox"][required]');
  await page.click('button[type="submit"]');
}

// 1. Asistente sin día → error, no envía
await page.goto(`${BASE}/#form`);
await page.fill('input[placeholder="Nombre y Apellido"]', "Sin Dia");
await page.fill('input[placeholder="nombre@empresa.cl"]', "sindia@brinca.global");
await page.fill('input[placeholder="Empresa"]', "ACME");
await page.selectOption("select >> nth=0", "Gerente");
await page.selectOption("select >> nth=1", "Innovación");
await page.check('input[type="checkbox"][required]');
await page.click('button[type="submit"]');
await page.waitForSelector('[role="alert"]');
check((await page.textContent('[role="alert"]'))!.includes("al menos un día"), "1. bloquea envío sin día");

// 2. Ejecutivo test → confirmado ambos días + botones calendario
await fillForm({ nombre: "Gina Gerente", email: "gina@brinca.global", nivel: "Gerente", dias: ["sep2", "sep3"] });
await page.waitForSelector("text=Confirmado.", { timeout: 15000 });
check(true, "2. pantalla Confirmado.");
check((await page.locator('a:has-text("Google Calendar")').count()) === 2, "2b. botones Google x2 (uno por día)");
check((await page.locator('a:has-text("Apple / .ics")').count()) === 2, "2c. descarga .ics x2");
{
  const row = await sb.from("pre_registrations").select("*").eq("email", "gina@brinca.global").single();
  check(row.data?.is_test === true, "2d. marcado is_test");
  check(row.data?.status === "confirmed" && row.data?.dia_sep2 === "confirmed", "2e. confirmado en DB");
  check(row.data?.email_status === "failed" && row.data?.email_type === "confirmed_full",
    "2f. envío registrado como failed (sin RESEND_API_KEY) — visible, no silencioso", row.data?.email_status);
}

// 3. No ejecutivo → Listo. (genérico), queda new/selected
await fillForm({ nombre: "Pablo Pro", email: "pablo@brinca.global", nivel: "Profesional / Especialista", dias: ["sep2"] });
await page.waitForSelector("text=Listo.", { timeout: 15000 });
{
  const row = await sb.from("pre_registrations").select("*").eq("email", "pablo@brinca.global").single();
  check(row.data?.status === "new" && row.data?.dia_sep2 === "selected", "3. no ejecutivo new/selected");
}

// OJO: los cupos solo aplican a correos NO-test (las filas @brinca no cuentan
// ni chequean capacidad, por diseño) — estos escenarios usan dominio real.
// 4. Cupo sep3 = 0 → parcial
await sb.from("event_days").update({ cupo: 0 }).eq("day", "2026-09-03");
await fillForm({ nombre: "Dora Dir", email: "dora@empresa-e2e.cl", nivel: "Director(a)", dias: ["sep2", "sep3"] });
await page.waitForSelector("text=lista de espera", { timeout: 15000 });
check((await page.locator("text=Confirmado.").count()) === 1, "4. parcial: heading Confirmado + aviso espera");

// 5. Ambos cupos 0 → lista de espera
await sb.from("event_days").update({ cupo: 0 }).eq("day", "2026-09-02");
await fillForm({ nombre: "Willy Wait", email: "willy@empresa-e2e.cl", nivel: "Subgerente", dias: ["sep2"] });
await page.waitForSelector("text=En lista de espera.", { timeout: 15000 });
check(true, "5. pantalla lista de espera");

// --- ADMIN ---
await page.goto(`${BASE}/admin/login`);
await page.fill('input[type="password"]', "admin-local-test");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin", { timeout: 15000 });
check(true, "6. login admin");
check((await page.locator("text=en lista de espera").count()) >= 1, "6b. tarjetas de día muestran espera");

// 7. Confirmación guiada de Willy (waitlisted) con cupo 0 → error de cupo
await page.fill("#q", "willy");
await page.click('button:has-text("Filtrar")');
await page.click('button:has-text("Confirmar…")');
await page.click('button:has-text("Confirmar + correo")');
await page.waitForSelector("text=Sin cupo disponible", { timeout: 15000 });
check(true, "7. admin bloquea confirmación sin cupo");

// 8. subir cupo desde la tarjeta y promover
await sb.from("event_days").update({ cupo: 200 }).neq("day", "1900-01-01");
await page.reload();
await page.fill("#q", "willy");
await page.click('button:has-text("Filtrar")');
await page.click('button:has-text("Confirmar…")');
await page.click('button:has-text("Confirmar + correo")');
await page.waitForSelector("text=Confirmado", { timeout: 15000 });
{
  await page.waitForTimeout(1500);
  const row = await sb.from("pre_registrations").select("*").eq("email", "willy@empresa-e2e.cl").single();
  check(row.data?.dia_sep2 === "confirmed" && row.data?.status === "confirmed", "8. promoción efectiva en DB");
  check(row.data?.email_type === "confirmed_full", "8b. correo de confirmación intentado tras promover");
}

// 9. cancelar un día de Gina
page.on("dialog", (d) => d.accept());
await page.fill("#q", "gina");
await page.click('button:has-text("Filtrar")');
await page.click('span:has-text("2 sep · Confirmado") >> button');
await page.waitForSelector("text=liberado", { timeout: 15000 });
{
  await page.waitForTimeout(1500);
  const row = await sb.from("pre_registrations").select("*").eq("email", "gina@brinca.global").single();
  check(row.data?.dia_sep2 === "cancelled" && row.data?.dia_sep3 === "confirmed", "9. cancelación por día en DB");
}

// 10. reenviar correo (fallará por falta de API key, pero registra el intento)
await page.click('button:has-text("Reenviar") >> nth=0');
await page.waitForSelector("text=falló", { timeout: 15000 });
check(true, "10. reenvío reporta fallo visible (sin API key)");

// 11. export excluye tests
{
  const cookies = await page.context().cookies();
  const cookie = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  const res = await fetch(`${BASE}/admin/export`, { headers: { cookie } });
  check(res.status === 200 && (res.headers.get("content-type") ?? "").includes("spreadsheet"), "11. export xlsx 200");
}

// 12. purga de pruebas — borra SOLO las filas test, las reales quedan
await page.goto(`${BASE}/admin`);
await page.click('button:has-text("Purgar pruebas")');
await page.waitForSelector("text=eliminados", { timeout: 15000 });
{
  const tests = await sb.from("pre_registrations").select("id", { count: "exact", head: true }).eq("is_test", true);
  const reals = await sb.from("pre_registrations").select("id", { count: "exact", head: true }).eq("is_test", false);
  check(tests.count === 0, "12. purga eliminó todas las filas test", tests.count);
  check((reals.count ?? 0) >= 2, "12b. las filas reales sobreviven la purga", reals.count);
}
// limpieza final
await sb.from("pre_registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");

await browser.close();
console.log(failures === 0 ? "ALL_E2E_OK" : `E2E FAILURES: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
