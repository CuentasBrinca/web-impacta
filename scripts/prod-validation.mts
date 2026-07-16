/**
 * Validación post-deploy en PRODUCCIÓN (www.impactaia.cl).
 * Inocua por diseño: la única escritura es una inscripción con correo
 * @brinca.global → fila marcada is_test (no cuenta cupo, no sale en export,
 * purgable desde el admin con un click).
 */
import { chromium } from "playwright";

const BASE = "https://www.impactaia.cl";
const TEST_EMAIL = process.argv[2] ?? "francisco.martinez@brinca.global";

let failures = 0;
const check = (cond: boolean, label: string, extra?: unknown) => {
  console.log(cond ? "PASS:" : "FAIL:", label, cond ? "" : (extra ?? ""));
  if (!cond) failures++;
};

// 1. rutas básicas
{
  const home = await fetch(BASE);
  check(home.status === 200, "1. home 200");
  const ics = await fetch(`${BASE}/calendario/2026-09-02.ics`);
  const body = await ics.text();
  check(ics.status === 200 && body.includes("BEGIN:VCALENDAR") && body.includes("20260902T090000"),
    "1b. .ics del 2-sep servido");
  const ics404 = await fetch(`${BASE}/calendario/2026-09-99.ics`);
  check(ics404.status === 404, "1c. .ics inválido 404");
}

// 2. inscripción ejecutiva de prueba en el sitio REAL
// (con un reintento: recién tras un deploy el HTML cacheado del CDN puede
// referenciar action IDs viejos → Next fuerza un reload y se pierde el envío)
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function submitExec(): Promise<boolean> {
  await page.goto(`${BASE}/#form`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.fill('input[placeholder="Nombre y Apellido"]', "Prueba Equipo Impacta");
  await page.fill('input[placeholder="nombre@empresa.cl"]', TEST_EMAIL);
  await page.fill('input[placeholder="Empresa"]', "Brinca (prueba interna)");
  await page.selectOption("select >> nth=0", "Gerente");
  await page.selectOption("select >> nth=1", "Innovación");
  await page.click('button[role="checkbox"]:has-text("Miércoles 2 de septiembre")');
  await page.click('button[role="checkbox"]:has-text("Jueves 3 de septiembre")');
  await page.check('input[type="checkbox"][required]');
  await page.click('button[type="submit"]');
  return page.waitForSelector("text=Confirmado.", { timeout: 25000 }).then(() => true).catch(() => false);
}
check((await submitExec()) || (await submitExec()), "2. ejecutivo test confirmado en producción");
check((await page.locator('a:has-text("Google Calendar")').count()) === 2, "2b. botones calendario por día");
await page.screenshot({ path: "/tmp/prod-success.png" });

// 3. re-inscripción del mismo correo test (debe permitirse)
await page.goto(`${BASE}/#form`);
await page.reload();
await page.fill('input[placeholder="Nombre y Apellido"]', "Prueba Equipo Impacta 2");
await page.fill('input[placeholder="nombre@empresa.cl"]', TEST_EMAIL);
await page.fill('input[placeholder="Empresa"]', "Brinca (prueba interna)");
await page.selectOption("select >> nth=0", "Profesional / Especialista");
await page.selectOption("select >> nth=1", "Innovación");
await page.click('button[role="checkbox"]:has-text("Jueves 3 de septiembre")');
await page.check('input[type="checkbox"][required]');
await page.click('button[type="submit"]');
await page.waitForSelector("text=Listo.", { timeout: 25000 });
check(true, "3. mismo correo test se re-inscribe (no ejecutivo → genérico)");

await browser.close();
console.log(failures === 0 ? "PROD_VALIDATION_OK" : `FAILURES: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
