/** Valida en producción: logo DEC + checkbox de sponsors + inscripción con opt-in. */
import { chromium } from "playwright";
let failures = 0;
const check = (c: boolean, l: string) => { console.log(c ? "PASS:" : "FAIL:", l); if (!c) failures++; };

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("https://www.impactaia.cl", { waitUntil: "networkidle" });
check((await page.locator('img[alt="DEC"]').count()) === 1, "logo DEC en Colaboran");

await page.goto("https://www.impactaia.cl/#form", { waitUntil: "networkidle" });
await page.reload({ waitUntil: "networkidle" });
const sponsorsBox = page.locator("text=comparta mis datos de contacto");
check((await sponsorsBox.count()) === 1, "checkbox sponsors visible (Asistente)");
await page.click('button:has-text("Sponsor")');
check((await sponsorsBox.count()) === 0, "checkbox sponsors oculto para otros intereses");
await page.click('button:has-text("Asistente")');

await page.fill('input[placeholder="Nombre y Apellido"]', "Prueba Optin Sponsors");
await page.fill('input[placeholder="nombre@empresa.cl"]', "francisco.martinez@brinca.global");
await page.fill('input[placeholder="Empresa"]', "Brinca (prueba interna)");
await page.selectOption("select >> nth=0", "Gerente");
await page.selectOption("select >> nth=1", "Innovación");
await page.click('button[role="checkbox"]:has-text("Miércoles 2 de septiembre")');
await page.check('input[type="checkbox"][required]');
// marcar el opt-in de sponsors (segundo checkbox no-required)
await page.locator('label:has-text("comparta mis datos") input[type="checkbox"]').check();
await page.click('button[type="submit"]');
await page.waitForSelector("text=Confirmado.", { timeout: 25000 });
check(true, "inscripción con opt-in aceptada (RPC de 16 parámetros OK)");
await browser.close();
console.log(failures === 0 ? "SPONSORS_CHECK_OK" : `FAILURES: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
