/**
 * Seed de datos DEMO en el Supabase LOCAL para las capturas de la guía del
 * equipo: cupo chico en 2-sep (se llena), confirmados, parcial, lista de
 * espera, no ejecutivo, fila test y correos enviado/fallido.
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

await sb.from("pre_registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await sb.from("event_days").update({ cupo: 3 }).eq("day", "2026-09-02");
await sb.from("event_days").update({ cupo: 200 }).eq("day", "2026-09-03");

const reg = (o: Record<string, unknown>) =>
  sb.rpc("register_attendee", {
    p_nombre: "", p_email: "", p_empresa: "", p_cargo: "Gerente", p_area: "Innovación",
    p_motivacion: null, p_interes: "Asistente", p_consent: true, p_source: "landing-form",
    p_user_agent: "demo", p_ip_hash: null, p_dia2: true, p_dia3: true,
    p_auto_confirm: true, p_is_test: false, p_consent_sponsors: false, p_telefono: null,
    ...o,
  });

// 3 ejecutivos llenan el cupo de 3 del 2-sep (confirmados ambos días)
await reg({ p_nombre: "Carolina Fuentes", p_email: "cfuentes@empresa-demo.cl", p_empresa: "Falabella", p_cargo: "Gerente General / CEO", p_telefono: "+56 9 8765 4321", p_consent_sponsors: true });
await reg({ p_nombre: "Andrés Soto", p_email: "asoto@empresa-demo.cl", p_empresa: "BCI", p_cargo: "Gerente", p_area: "Transformación Digital" });
await reg({ p_nombre: "Valentina Reyes", p_email: "vreyes@empresa-demo.cl", p_empresa: "Codelco", p_cargo: "Director(a)", p_telefono: "+56 9 5555 1234" });
// 4º ejecutivo: 2-sep lleno → PARCIAL (espera 2-sep, confirmado 3-sep)
await reg({ p_nombre: "Rodrigo Pérez", p_email: "rperez@empresa-demo.cl", p_empresa: "Entel", p_cargo: "Subgerente", p_area: "TI" });
// 5º: solo 2-sep → LISTA DE ESPERA total
await reg({ p_nombre: "Marcela Díaz", p_email: "mdiaz@empresa-demo.cl", p_empresa: "CCU", p_cargo: "Gerente", p_dia3: false });
// No ejecutivo → new/selected (flujo actual)
await reg({ p_nombre: "José Martínez", p_email: "jmartinez@empresa-demo.cl", p_empresa: "Copec", p_cargo: "Jefatura / Líder", p_auto_confirm: false, p_dia3: false });
// Fila de prueba del equipo
await reg({ p_nombre: "Prueba Equipo", p_email: "qa@brinca.global", p_empresa: "Brinca", p_is_test: true });

// Simular correos: los 3 confirmados y el parcial quedaron 'sent'; Marcela quedó 'failed'
const at = new Date().toISOString();
for (const [email, type] of [
  ["cfuentes@empresa-demo.cl", "confirmed_full"],
  ["asoto@empresa-demo.cl", "confirmed_full"],
  ["vreyes@empresa-demo.cl", "confirmed_full"],
  ["rperez@empresa-demo.cl", "confirmed_partial"],
] as const) {
  await sb.from("pre_registrations").update({ email_type: type, email_status: "sent", email_error: null, email_sent_at: at }).eq("email", email);
}
await sb.from("pre_registrations").update({ email_type: "waitlisted", email_status: "failed", email_error: "Resend: rate limit exceeded (demo)" }).eq("email", "mdiaz@empresa-demo.cl");

const { count } = await sb.from("pre_registrations").select("id", { count: "exact", head: true });
console.log("SEED_OK — filas:", count);
