"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NIVEL_OTRO, AREA_OTRO, nivelesEjecutivos, type EventDayKey } from "@/lib/content";
import { preRegistrationSchema, type FormResult, type RegistrationOutcome } from "@/lib/schema";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendRegistrationEmail } from "@/lib/email";

/**
 * Dominios cuyo correo marca la fila como prueba del equipo: pueden
 * inscribirse N veces, no cuentan cupo y se excluyen del export.
 * Configurable sin deploy vía TEST_EMAIL_DOMAINS (coma-separado).
 */
function isTestEmail(email: string): boolean {
  const domains = (process.env.TEST_EMAIL_DOMAINS ?? "brinca.global,brinca.com")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && domains.includes(domain);
}

/**
 * Server Action invoked by FormSection on submit.
 * Returns a serializable result that the client maps to UI state.
 *
 * La decisión de confirmación (cupo por día) vive en la RPC
 * `register_attendee` de Postgres: el conteo y la inserción son una sola
 * transacción, así dos inscripciones simultáneas no pueden confirmar ambas
 * el último cupo. Aquí solo se decide QUIÉN califica (ejecutivo + Asistente)
 * y se traduce el resultado a UI + correo.
 */
export async function preRegister(input: unknown): Promise<FormResult> {
  // 1. Validate
  const parsed = preRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: first?.message ?? "Datos inválidos",
      field: first?.path?.[0] as FormResult extends { field?: infer F } ? F : never,
    };
  }
  const data = parsed.data;

  // 2. Honeypot — bots fill it; humans never see the field
  if (data.website && data.website.length > 0) {
    // Fail silently — pretend success to the bot
    return { ok: true, outcome: "generic", confirmedDays: [], waitlistedDays: [] };
  }

  // 3. Read headers (UA + IP) for audit + rate-limit signal
  const h = await headers();
  const userAgent = h.get("user-agent") ?? null;
  const fwd = h.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || h.get("x-real-ip") || "";

  // 4. Turnstile (no-op if env not set)
  const ok = await verifyTurnstile(data.turnstileToken, ip || undefined);
  if (!ok) {
    return { ok: false, error: "Verificación anti-bot fallida. Intenta de nuevo." };
  }

  // 5. IP hash (never store raw IP)
  const salt = process.env.IP_HASH_SALT ?? "impacta-ia-default-salt";
  const ipHash = ip ? createHash("sha256").update(ip + salt).digest("hex") : null;

  // 6. Insert vía RPC atómica (chequeo de cupo + escritura en una transacción)
  const isAsistente = data.interes === "Asistente";
  const autoConfirm =
    isAsistente && (nivelesEjecutivos as readonly string[]).includes(data.nivel);
  const isTest = isTestEmail(data.email);

  const sb = supabaseAdmin();
  const { data: rpc, error } = await sb.rpc("register_attendee", {
    p_nombre: data.nombre,
    p_email: data.email,
    p_empresa: data.empresa,
    // `cargo` (columna legacy) almacena el nivel; si es "Otro", el texto libre.
    p_cargo: data.nivel === NIVEL_OTRO ? data.nivelOtro : data.nivel,
    p_area: data.area === AREA_OTRO ? data.areaOtro : data.area,
    p_motivacion: data.motivacion || null,
    p_interes: data.interes,
    p_consent: data.consent,
    p_source: "landing-form",
    p_user_agent: userAgent,
    p_ip_hash: ipHash,
    p_dia2: isAsistente && data.diaSep2,
    p_dia3: isAsistente && data.diaSep3,
    p_auto_confirm: autoConfirm,
    p_is_test: isTest,
    p_consent_sponsors: isAsistente && data.consentSponsors,
    p_telefono: data.telefono || null,
  });

  if (error) {
    console.error("[pre-register] rpc failed", error);
    return { ok: false, error: "No pudimos registrar tu interés ahora. Intenta de nuevo en unos minutos." };
  }

  if (!rpc?.ok) {
    if (rpc?.error === "duplicate") {
      return {
        ok: false,
        error: "Este email ya está registrado. Te escribiremos para confirmar tu invitación.",
        field: "email",
      };
    }
    console.error("[pre-register] rpc rejected", rpc);
    return { ok: false, error: "No pudimos registrar tu interés ahora. Intenta de nuevo en unos minutos." };
  }

  // 7. Traducir estados por día → resultado para UI y correo
  const confirmedDays: EventDayKey[] = [];
  const waitlistedDays: EventDayKey[] = [];
  if (rpc.dia_sep2 === "confirmed") confirmedDays.push("sep2");
  if (rpc.dia_sep2 === "waitlisted") waitlistedDays.push("sep2");
  if (rpc.dia_sep3 === "confirmed") confirmedDays.push("sep3");
  if (rpc.dia_sep3 === "waitlisted") waitlistedDays.push("sep3");

  const outcome: RegistrationOutcome = !autoConfirm
    ? "generic"
    : confirmedDays.length > 0 && waitlistedDays.length === 0
      ? "confirmed_full"
      : confirmedDays.length > 0
        ? "confirmed_partial"
        : "waitlisted";

  // 8. Correo según resultado. Se espera (no fire-and-forget): en serverless
  //    una promesa suelta puede morir con la función, y además registramos
  //    el éxito/fallo del envío en la fila para poder reenviar desde el admin.
  //    Un fallo de correo NO bota la inscripción: ya está en la base.
  await sendRegistrationEmail({
    input: data,
    registrationId: rpc.id as string,
    outcome,
    confirmedDays,
    waitlistedDays,
  }).catch((e) => console.error("[pre-register] email error", e));

  return { ok: true, outcome, confirmedDays, waitlistedDays };
}
