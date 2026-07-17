/**
 * Capturas ANOTADAS para la guía del equipo (usa el stack local + seed demo).
 * Inyecta recuadros rosa + globos numerados sobre los elementos y guarda
 * cada pantalla en /tmp/guia/.
 */
import { chromium, type Page } from "playwright";
import { mkdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

mkdirSync("/tmp/guia", { recursive: true });
const BASE = "http://localhost:3000";

type Anno = { sel: string; n?: number; badge?: "left" | "right" };
type Box = { left: number; top: number; width: number; height: number; n?: number; badge?: "left" | "right" };

async function annotate(page: Page, annos: Anno[]) {
  // Los selectores se resuelven con locators de Playwright (soportan
  // :has-text etc.) y al navegador solo entran coordenadas.
  const boxes: Box[] = [];
  for (const { sel, n, badge } of annos) {
    const bb = await page.locator(sel).first().boundingBox();
    if (!bb) { console.error("anno sin match:", sel); continue; }
    boxes.push({ left: bb.x, top: bb.y, width: bb.width, height: bb.height, n, badge });
  }
  // Coordenadas ABSOLUTAS del documento (boundingBox es relativo al viewport
  // + scroll actual): así los overlays quedan pegados al elemento aunque el
  // screenshot capture un elemento más ancho que el viewport o re-scrollee.
  await page.evaluate((items) => {
    document.querySelectorAll("[data-guia-anno]").forEach((e) => e.remove());
    const sx = window.scrollX, sy = window.scrollY;
    for (const r of items) {
      const left = r.left + sx, top = r.top + sy;
      const box = document.createElement("div");
      box.setAttribute("data-guia-anno", "1");
      box.style.cssText = `position:absolute;left:${left - 6}px;top:${top - 6}px;width:${r.width + 12}px;height:${r.height + 12}px;border:3px solid #ed1e79;border-radius:12px;z-index:99999;pointer-events:none;box-shadow:0 0 0 2px rgba(255,255,255,.55)`;
      document.body.appendChild(box);
      if (r.n) {
        const b = document.createElement("div");
        b.setAttribute("data-guia-anno", "1");
        b.textContent = String(r.n);
        const bx = r.badge === "right" ? left + r.width - 10 : left - 18;
        b.style.cssText = `position:absolute;left:${bx}px;top:${top - 18}px;width:30px;height:30px;background:#ed1e79;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 16px -apple-system,sans-serif;z-index:100000;box-shadow:0 2px 6px rgba(0,0,0,.45);pointer-events:none`;
        document.body.appendChild(b);
      }
    }
  }, boxes);
  await page.waitForTimeout(300);
}

const b = await chromium.launch();
// 1700px de ancho: la tabla del admin (min 1380px + paddings) entra completa
// sin que el overflow recorte las últimas columnas.
const page = await b.newPage({ viewport: { width: 1700, height: 900 }, deviceScaleFactor: 2 });
page.on("dialog", (d) => d.accept());

/** El contenedor del admin limita a 1280px y oculta las últimas columnas de
    la tabla — se libera el ancho antes de capturar. */
async function widenAdmin() {
  await page.evaluate(() => {
    document.querySelectorAll(".max-w-7xl").forEach((e) => e.classList.remove("max-w-7xl"));
  });
  await page.waitForTimeout(200);
}

/** Screenshot de un elemento con margen extra (para incluir los globos numerados). */
async function shotPad(sel: string, path: string, pad = 26) {
  const bb = await page.locator(sel).first().boundingBox();
  if (!bb) throw new Error(`shotPad sin match: ${sel}`);
  await page.screenshot({
    path,
    clip: {
      x: Math.max(0, bb.x - pad),
      y: Math.max(0, bb.y - pad),
      width: bb.width + pad * 2,
      height: bb.height + pad * 2,
    },
  });
}

// ---------- 1. Formulario público: campos nuevos ----------
await page.goto(`${BASE}/#form`, { waitUntil: "networkidle" });
// La nav fija taparía la parte superior del screenshot del formulario.
await page.evaluate(() => document.querySelector("nav")?.remove());
await page.locator("#form form").scrollIntoViewIfNeeded();
await page.locator('input[type="tel"]').pressSequentially("912345678", { delay: 15 });
await annotate(page, [
  { sel: 'button[role="checkbox"]', n: 1, badge: "right" },
  { sel: 'input[type="tel"]', n: 2, badge: "right" },
  { sel: 'label:has(input[type="checkbox"]:not([required]))', n: 3, badge: "right" },
]);
await page.locator("#form form").screenshot({ path: "/tmp/guia/01-form-campos.png" });

// ---------- 2. Admin: login ----------
await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
{
  // Recorte alrededor del formulario de login (la página completa es negra)
  const bb = await page.locator("form").first().boundingBox();
  if (bb) {
    await page.screenshot({
      path: "/tmp/guia/02-admin-login.png",
      clip: { x: Math.max(0, bb.x - 60), y: Math.max(0, bb.y - 80), width: bb.width + 120, height: bb.height + 140 },
    });
  }
}
await page.fill('input[type="password"]', "admin-local-test");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin");
await page.waitForTimeout(1200);

// ---------- 3. Panorama del admin ----------
await annotate(page, [
  { sel: "section.grid >> nth=0 >> > div >> nth=0", n: 1 },
  { sel: "button[title='Editar cupo máximo'] >> nth=0", n: 2, badge: "right" },
  { sel: "#dia", n: 3 },
  { sel: "#test", n: 4 },
  { sel: 'button:has-text("Purgar pruebas")', n: 5 },
  { sel: 'a[href^="/admin/export"]', n: 6, badge: "right" },
]);
await page.screenshot({ path: "/tmp/guia/03-admin-panorama.png" });

// ---------- 4. Editar cupo ----------
const cardSep2 = page.locator("section.grid").first().locator("> div").first();
await cardSep2.locator("button[title='Editar cupo máximo']").click();
await page.waitForTimeout(300);
await annotate(page, [{ sel: "section.grid >> nth=0 >> input[type='number']", n: 1 }]);
await cardSep2.screenshot({ path: "/tmp/guia/04-editar-cupo.png" });
await page.keyboard.press("Escape");

// ---------- 5. La tabla: columnas nuevas ----------
await widenAdmin();
const tabla = page.locator("table");
await tabla.scrollIntoViewIfNeeded();
await annotate(page, [
  { sel: "thead th:nth-child(8)", n: 1 },   // Días
  { sel: "thead th:nth-child(9)", n: 2 },   // Estado
  { sel: "thead th:nth-child(10)", n: 3 },  // Correo
]);
await shotPad("table", "/tmp/guia/05-tabla.png");

// ---------- 6. Confirmación guiada (José Martínez, estado Nuevo) ----------
await page.goto(`${BASE}/admin?q=jmartinez`, { waitUntil: "networkidle" });
await widenAdmin();
await annotate(page, [{ sel: 'button:has-text("Confirmar…")', n: 1 }]);
await shotPad("table", "/tmp/guia/06-confirmar-paso1.png");
await page.click('button:has-text("Confirmar…")');
await page.waitForTimeout(400);
await annotate(page, [
  { sel: "td label:has-text('Miércoles')", n: 1 },
  { sel: "td label:has-text('Jueves')", n: 2 },
  { sel: 'button:has-text("Confirmar + correo")', n: 3 },
]);
await shotPad("table", "/tmp/guia/07-confirmar-paso2.png");
await page.keyboard.press("Escape");

// ---------- 7. Correo fallido + reenviar (Marcela Díaz) ----------
await page.goto(`${BASE}/admin?q=mdiaz`, { waitUntil: "networkidle" });
await widenAdmin();
await annotate(page, [
  { sel: "tbody tr:first-child td:nth-child(10) span", n: 1 },
  { sel: 'button:has-text("Reenviar")', n: 2 },
]);
await shotPad("table", "/tmp/guia/08-correo-fallido.png");

// ---------- 8. Cancelar un día (Carolina, confirmada ambos) ----------
await page.goto(`${BASE}/admin?q=cfuentes`, { waitUntil: "networkidle" });
await widenAdmin();
await annotate(page, [{ sel: "tbody tr:first-child td:nth-child(8) span button", n: 1 }]);
await shotPad("table", "/tmp/guia/09-cancelar-dia.png");
await page.click("tbody tr:first-child td:nth-child(8) span button"); // acepta el confirm via handler
await page.waitForTimeout(2500);
await shotPad("table", "/tmp/guia/10-cancelar-resultado.png");

// ---------- 9. Lista de espera ordenada ----------
await page.goto(`${BASE}/admin?dia=sep2%3Awaitlisted`, { waitUntil: "networkidle" });
await widenAdmin();
await shotPad("table", "/tmp/guia/11-lista-espera.png");

// ---------- 10. Filas de prueba ----------
await page.goto(`${BASE}/admin?test=solo`, { waitUntil: "networkidle" });
await annotate(page, [
  { sel: "tbody tr:first-child td:nth-child(2) span", n: 1 },
  { sel: 'button:has-text("Purgar pruebas")', n: 2 },
]);
await page.screenshot({ path: "/tmp/guia/12-filas-test.png" });

// ---------- 11. Pantallas de éxito del formulario ----------
async function fillAndSubmit(email: string, dias: ("mie" | "jue")[]) {
  await page.goto(`${BASE}/#form`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.fill('input[placeholder="Nombre y Apellido"]', "Ana Ejecutiva");
  await page.fill('input[placeholder="nombre@empresa.cl"]', email);
  await page.fill('input[placeholder="Empresa"]', "Empresa Demo");
  await page.selectOption("select >> nth=0", "Gerente");
  await page.selectOption("select >> nth=1", "Innovación");
  if (dias.includes("mie")) await page.click('button[role="checkbox"]:has-text("Miércoles")');
  if (dias.includes("jue")) await page.click('button[role="checkbox"]:has-text("Jueves")');
  await page.check('input[type="checkbox"][required]');
  await page.click('button[type="submit"]');
}
// La cancelación del paso 8 liberó un cupo del 2-sep — se vuelve a llenar
// para que las variantes "parcial" y "espera" ocurran de verdad.
{
  const { count } = await sb
    .from("pre_registrations")
    .select("id", { count: "exact", head: true })
    .eq("dia_sep2", "confirmed")
    .eq("is_test", false);
  await sb.from("event_days").update({ cupo: count ?? 0 }).eq("day", "2026-09-02");
}
await fillAndSubmit("ana1@empresa-demo.cl", ["jue"]);
await page.waitForSelector("text=Confirmado.", { timeout: 15000 });
await page.locator("#form").screenshot({ path: "/tmp/guia/13-exito-confirmado.png" });
await fillAndSubmit("ana2@empresa-demo.cl", ["mie", "jue"]); // sep2 lleno → parcial
await page.waitForSelector("text=lista de espera", { timeout: 15000 });
await page.locator("#form").screenshot({ path: "/tmp/guia/14-exito-parcial.png" });
await fillAndSubmit("ana3@empresa-demo.cl", ["mie"]); // sep2 lleno → espera
await page.waitForSelector("text=En lista de espera.", { timeout: 15000 });
await page.locator("#form").screenshot({ path: "/tmp/guia/15-exito-espera.png" });

await b.close();
console.log("CAPTURAS_OK");
