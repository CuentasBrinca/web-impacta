/**
 * Genera la guía del equipo (PDF) a partir de las capturas anotadas en
 * /tmp/guia/. Salida: ~/Downloads/guia-inscripciones-impacta-ia.pdf
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";

const PINK = "#ed1e79";
const INK = "#0e0e10";
const img = (f: string, w = "100%") =>
  `<img src="file:///tmp/guia/${f}" style="width:${w};max-width:100%;border:1px solid #e2e2e5;border-radius:10px;margin:10px 0 4px;" />`;
const cap = (s: string) => `<div class="cap">${s}</div>`;

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a1c; font-size: 12.5px; line-height: 1.55; }
  .page { padding: 46px 52px; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  h1 { font-size: 34px; letter-spacing: -0.02em; margin: 0 0 6px; }
  h2 { font-size: 21px; letter-spacing: -0.01em; margin: 0 0 14px; padding-bottom: 8px; border-bottom: 3px solid ${PINK}; }
  h3 { font-size: 15px; margin: 18px 0 6px; color: ${INK}; }
  p { margin: 0 0 10px; }
  ul, ol { margin: 0 0 10px; padding-left: 20px; }
  li { margin-bottom: 4px; }
  .cap { font-size: 10.5px; color: #747476; margin-bottom: 12px; }
  .cover { background: ${INK}; color: #fff; height: 297mm; padding: 70px 60px; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; }
  .cover h1 { color: #fff; font-size: 44px; line-height: 1.1; }
  .cover .pink { color: ${PINK}; }
  .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #999; margin-bottom: 14px; }
  .chip { display: inline-block; background: #f5f5f6; border: 1px solid #e2e2e5; border-radius: 999px; padding: 2px 10px; font-size: 11px; font-weight: 600; margin: 0 4px 4px 0; }
  .num { display: inline-flex; width: 20px; height: 20px; background: ${PINK}; color: #fff; border-radius: 50%; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; margin-right: 7px; vertical-align: -4px; }
  /* Sin flex: el flex colapsa los espacios entre <b> y el texto siguiente */
  .legend li { list-style: none; margin-bottom: 7px; }
  .legend { padding-left: 2px; }
  table.rules { width: 100%; border-collapse: collapse; font-size: 12px; margin: 8px 0 12px; }
  table.rules th { background: ${INK}; color: #fff; text-align: left; padding: 7px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
  table.rules td { border: 1px solid #e2e2e5; padding: 7px 10px; vertical-align: top; }
  .warn { background: #fdf2f7; border-left: 4px solid ${PINK}; padding: 10px 14px; border-radius: 0 8px 8px 0; margin: 10px 0; }
  .row2 { display: flex; gap: 14px; } .row2 > div { flex: 1; }
  code { background: #f5f5f6; border-radius: 4px; padding: 1px 5px; font-size: 11.5px; }
</style></head><body>

<div class="cover">
  <div>
    <div class="eyebrow" style="color:#aaa">Impacta IA · 2 y 3 de septiembre 2026 · Fundación Chile</div>
    <h1>Guía del sistema<br/>de <span class="pink">inscripciones</span><br/>y panel admin</h1>
    <p style="color:#bbb;max-width:60ch;font-size:14px;margin-top:18px">
      Cómo funciona la confirmación automática por día, los cupos y la lista de espera,
      los correos que reciben los inscritos, y el paso a paso para gestionar todo desde
      el panel de administración.
    </p>
  </div>
  <div style="color:#777;font-size:12px">Equipo Impacta IA · Brinca — 16 de julio de 2026 · v1</div>
</div>

<div class="page">
  <h2>1 · Qué cambió: el sistema en una página</h2>
  <p>El formulario de <b>impactaia.cl</b> dejó de ser una simple lista de interesados: ahora <b>confirma cupos automáticamente</b>, administra lista de espera por día y envía los correos correspondientes, sin intervención del equipo. El panel admin pasa a ser la herramienta central de gestión.</p>
  <h3>Las piezas nuevas</h3>
  <ul>
    <li><b>Selección de día(s):</b> quien se inscribe como Asistente elige miércoles 2, jueves 3, o ambos (obligatorio al menos uno).</li>
    <li><b>Confirmación automática por día:</b> los niveles ejecutivos quedan confirmados al instante si hay cupo en los días que marcaron.</li>
    <li><b>Cupos por día</b> (200 y 200 al lanzar), editables desde el admin con efecto inmediato.</li>
    <li><b>Lista de espera por día</b>, en orden de llegada, con promoción manual desde el admin.</li>
    <li><b>4 correos automáticos</b> según el resultado, con invitación de calendario (.ics + botones Google/Outlook) para los confirmados.</li>
    <li><b>Auditoría de correos:</b> cada envío queda registrado; los fallos se ven en el admin y se reenvían con un botón.</li>
    <li><b>Teléfono opcional</b> con formato +56 9 1234 5678, y <b>opt-in para compartir contacto con sponsors</b> (columna propia en el Excel).</li>
    <li><b>Modo prueba:</b> los correos <code>@brinca.global</code> y <code>@brinca.com</code> pueden inscribirse infinitas veces, no ocupan cupo y se purgan con un click.</li>
  </ul>
  <h3>Quiénes se auto-confirman</h3>
  <p>Solo inscripciones con interés <b>Asistente</b> y nivel:</p>
  <p>
    <span class="chip">Gerente General / CEO</span><span class="chip">Director(a)</span>
    <span class="chip">Gerente</span><span class="chip">Subgerente</span>
  </p>
  <p>Todos los demás niveles (y el nivel "Otro", aunque el texto diga gerente) quedan en estado <b>Nuevo</b> para revisión manual del equipo, igual que antes. Speaker, Sponsor y Media no cambian.</p>
  <h3>Los 4 resultados posibles de una inscripción ejecutiva</h3>
  <table class="rules">
    <tr><th>Resultado</th><th>Cuándo ocurre</th><th>Correo que recibe</th></tr>
    <tr><td><b>Confirmado total</b></td><td>Hay cupo en todos los días que marcó</td><td>"Estás confirmado" + calendario</td></tr>
    <tr><td><b>Confirmado parcial</b></td><td>Cupo en un día; el otro lleno</td><td>Confirmación del día + aviso de espera del otro</td></tr>
    <tr><td><b>Lista de espera</b></td><td>Todos sus días llenos</td><td>"Estás en lista de espera"</td></tr>
    <tr><td><b>Pre-registro</b> (no ejecutivos)</td><td>Siempre</td><td>Autoresponder de revisión manual</td></tr>
  </table>
</div>

<div class="page">
  <h2>2 · Lo que ve el inscrito</h2>
  <h3>El formulario</h3>
  <ul class="legend">
    <li><span class="num">1</span>Día(s) de asistencia — obligatorio marcar al menos uno (puede ambos).</li>
    <li><span class="num">2</span>Teléfono opcional — se formatea solo a +56 9 1234 5678 al escribir.</li>
    <li><span class="num">3</span>Opt-in de sponsors — opcional; si lo marca, su nombre y correo se pueden compartir con sponsors oficiales.</li>
  </ul>
  ${img("01-form-campos.png", "62%")}
  ${cap("Formulario de inscripción con los campos nuevos (solo aparecen para interés Asistente).")}
</div>

<div class="page">
  <h3>La pantalla de éxito cambia según el resultado</h3>
  <div class="row2">
    <div>${img("13-exito-confirmado.png")}${cap("Confirmado: muestra los días y botones para agregar el evento al calendario (Google, Outlook, Apple).")}</div>
    <div>${img("14-exito-parcial.png")}${cap("Parcial: confirma un día y avisa la lista de espera del otro.")}</div>
  </div>
  ${img("15-exito-espera.png", "50%")}
  ${cap("Lista de espera: cupos llenos en los días marcados.")}
</div>

<div class="page">
  <h2>3 · Los correos automáticos</h2>
  <p>Cada inscripción dispara <b>dos correos</b>: la notificación interna al equipo (con nivel, días, resultado, teléfono y opt-in de sponsors) y el correo al inscrito según su resultado. Los confirmados llevan la invitación de calendario adjunta (.ics) más botones de Google Calendar y Outlook.</p>
  <div class="row2">
    <div>${img("16-correo-confirmado.png")}${cap("Confirmado total — con tarjeta del evento, Google Maps y calendario por día.")}</div>
    <div>${img("17-correo-parcial.png")}${cap("Confirmado parcial — confirma el día con cupo y explica la espera del otro.")}</div>
  </div>
</div>

<div class="page">
  <div class="row2">
    <div>${img("18-correo-espera.png")}${cap("Lista de espera — se compromete a avisar si se libera un lugar (por eso existe la promoción manual en el admin).")}</div>
    <div>${img("19-correo-generico.png")}${cap("Pre-registro (no ejecutivos y otros intereses) — revisión manual del equipo.")}</div>
  </div>
  <div class="warn"><b>Todo envío queda registrado.</b> Si Resend falla, el correo NO se pierde en silencio: la fila queda marcada "Falló" en el admin y se reenvía con un botón (sección 4.7).</div>
</div>

<div class="page">
  <h2>4 · El panel admin, paso a paso</h2>
  <h3>4.1 Ingreso</h3>
  <p>En <b>impactaia.cl/admin</b> con la contraseña del equipo.</p>
  ${img("02-admin-login.png", "46%")}
  <h3>4.2 El panorama</h3>
  <ul class="legend">
    <li><span class="num">1</span><b>Ocupación por día:</b> confirmados/cupo con barra de avance y cuántos esperan. Cuenta solo inscritos reales (las pruebas @brinca no suman).</li>
    <li><span class="num">2</span><b>Editar cupo:</b> click en "cupo N ✎", nuevo número, Enter. Rige al instante para las inscripciones siguientes.</li>
    <li><span class="num">3</span><b>Filtro por día y estado</b> (ej: "2 sep · En espera" muestra la lista de espera de ese día).</li>
    <li><span class="num">4</span><b>Filtro de pruebas:</b> mostrar todas, ocultarlas o ver solo pruebas.</li>
    <li><span class="num">5</span><b>Purgar pruebas:</b> borra TODOS los registros @brinca (pide confirmación).</li>
    <li><span class="num">6</span><b>Descargar Excel:</b> exporta con días, estados, teléfono y opt-in de sponsors. Nunca incluye pruebas.</li>
  </ul>
  ${img("03-admin-panorama.png")}
</div>

<div class="page">
  <h3>4.3 La tabla: columnas nuevas</h3>
  <ul class="legend">
    <li><span class="num">1</span><b>Días:</b> un chip por día con su estado — Confirmado (verde), En espera (ámbar), Marcado (gris, eligió el día pero no está confirmado), Cancelado (tachado). El teléfono aparece bajo el email.</li>
    <li><span class="num">2</span><b>Estado:</b> "Confirmado / Lista de espera / Cancelado" los administra el sistema según los días — el menú solo permite Nuevo, Contactado, Rechazado y Spam.</li>
    <li><span class="num">3</span><b>Correo:</b> el último correo enviado y si llegó (✓) o falló (✗).</li>
  </ul>
  ${img("05-tabla.png")}
  <div class="warn"><b>Regla de oro:</b> la ÚNICA forma de confirmar a alguien es el botón "Confirmar…". Por eso el menú de estado ya no ofrece "Confirmado": el flujo guiado valida el cupo y envía el correo; a mano no.</div>
</div>

<div class="page">
  <h3>4.4 Confirmar manualmente (históricos, no ejecutivos, o promover la espera)</h3>
  <p>Sirve para tres casos: inscritos antiguos sin días elegidos, no ejecutivos que el equipo decide aceptar, y personas en lista de espera cuando se libera cupo.</p>
  <p><b>Paso 1</b> — busca a la persona y presiona <b>Confirmar…</b> en su columna Días:</p>
  ${img("06-confirmar-paso1.png")}
  <p style="margin-top:10px"><b>Paso 2</b> — marca el o los días <span class="num" style="margin:0 3px">1</span><span class="num" style="margin:0 3px">2</span> y presiona <b>Confirmar + correo</b> <span class="num" style="margin:0 3px">3</span>:</p>
  ${img("07-confirmar-paso2.png")}
  <ul style="margin-top:8px">
    <li>El sistema <b>valida el cupo</b>: si el día está lleno, no confirma y avisa ("Sin cupo disponible para 2 sep — libera un cupo o sube el tope").</li>
    <li>Si confirma, <b>envía automáticamente</b> el correo de confirmación con el calendario. No hay que enviar nada a mano.</li>
  </ul>
</div>

<div class="page">
  <h3>4.5 Cancelar la asistencia de un día</h3>
  <p>Cuando un confirmado avisa que no podrá ir, presiona la <b>✕</b> en el chip verde del día:</p>
  ${img("09-cancelar-dia.png")}
  <ul style="margin-top:8px">
    <li>El cupo se <b>libera al instante</b> y el sistema muestra cuántas personas esperan ese día:</li>
  </ul>
  ${img("10-cancelar-resultado.png")}
  ${cap("Tras cancelar: 'Cupo del 2 sep liberado — hay N en lista de espera para ese día.'")}
  <ul>
    <li><b>No se envía ningún correo</b> al cancelar (la persona ya avisó por otro canal; y un error de click se corrige re-confirmando sin que nadie se entere).</li>
    <li>La cancelación queda en el historial de la fila — no se borra nada.</li>
  </ul>
  <h3>4.6 La lista de espera y cómo "corre la lista"</h3>
  <p>Filtra por <b>Día → "2 sep · En espera"</b>: la tabla se ordena <b>por orden de llegada</b> (el primero de la lista es el primero a promover). Para promover: botón <b>Confirmar…</b> del primero → el flujo valida el cupo liberado y envía su correo de confirmación.</p>
  ${img("11-lista-espera.png")}
</div>

<div class="page">
  <h3>4.7 Correos fallidos y reenvío</h3>
  <ul class="legend">
    <li><span class="num">1</span>Si un correo falló, la columna Correo lo muestra en rojo (✗) con el motivo al pasar el mouse.</li>
    <li><span class="num">2</span><b>↺ Reenviar</b> envía de nuevo el correo que corresponde al estado ACTUAL de la persona.</li>
  </ul>
  ${img("08-correo-fallido.png")}
  <h3>4.8 Registros de prueba (@brinca)</h3>
  <ul class="legend">
    <li><span class="num">1</span>Toda inscripción con correo <code>@brinca.global</code> o <code>@brinca.com</code> queda con la etiqueta <b>TEST</b>: puede repetirse infinitas veces, no ocupa cupo y no sale en el Excel.</li>
    <li><span class="num">2</span><b>Purgar pruebas</b> las borra todas de una vez (pide confirmación; es irreversible).</li>
  </ul>
  ${img("12-filas-test.png")}
</div>

<div class="page">
  <h2>5 · Reglas de oro y cómo probar</h2>
  <table class="rules">
    <tr><th>Regla</th><th>Por qué</th></tr>
    <tr><td>Confirmar SOLO con el botón "Confirmar…"</td><td>Es la única vía que valida cupo y envía el correo. El menú de estado no ofrece "Confirmado" a propósito.</td></tr>
    <tr><td>Cancelar con la ✕ del día, no cambiando el estado</td><td>La ✕ libera el cupo del día correcto y conserva el historial.</td></tr>
    <tr><td>El cupo se edita en la tarjeta del día y rige al instante</td><td>Subirlo "corre la lista" solo en el sentido de que ABRE cupo — promover sigue siendo manual, persona por persona.</td></tr>
    <tr><td>Probar SIEMPRE con correos @brinca</td><td>Se repiten, no ensucian cupos ni Excel, y se purgan con un click.</td></tr>
    <tr><td>Para probar el cupo lleno, usar un correo personal NO-brinca</td><td>Las pruebas @brinca se saltan el chequeo de capacidad por diseño. Baja el cupo, inscríbete con un gmail, y borra la fila después.</td></tr>
    <tr><td>Si un correo falló, usar ↺ Reenviar</td><td>Nada se reenvía solo; el fallo queda visible hasta que alguien lo resuelva.</td></tr>
  </table>
  <h3>Receta para probar el flujo completo (2 minutos)</h3>
  <ol>
    <li>Inscríbete en impactaia.cl como Asistente, nivel Gerente, con tu correo @brinca y ambos días → verás la pantalla "Confirmado." y te llegarán los 2 correos (interno + confirmación con calendario).</li>
    <li>En el admin: encuentra tu fila (etiqueta TEST), cancela un día con la ✕, re-confírmalo con "Confirmar…".</li>
    <li>Al terminar: <b>Purgar pruebas</b>.</li>
  </ol>
  <p style="margin-top:26px;color:#747476;font-size:11px">Guía generada el 16 de julio de 2026 · Sistema desplegado en producción ese mismo día · Dudas técnicas: Francisco Martínez</p>
</div>

</body></html>`;

writeFileSync("/tmp/guia/guia.html", html);
const b = await chromium.launch();
const page = await b.newPage();
await page.goto("file:///tmp/guia/guia.html", { waitUntil: "networkidle" });
const out = `${homedir()}/Downloads/guia-inscripciones-impacta-ia.pdf`;
await page.pdf({ path: out, format: "A4", printBackground: true });
await b.close();
console.log("PDF_OK →", out);
