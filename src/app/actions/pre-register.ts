"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { preRegistrationSchema, type FormResult } from "@/lib/schema";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendPreRegistrationEmails } from "@/lib/email";

/**
 * Server Action invoked by FormSection on submit.
 * Returns a serializable result that the client maps to UI state.
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
    return { ok: true };
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

  // 6. Insert
  const sb = supabaseAdmin();
  const { error } = await sb.from("pre_registrations").insert({
    nombre: data.nombre,
    email: data.email,
    empresa: data.empresa,
    cargo: data.cargo,
    interes: data.interes,
    consent: data.consent,
    source: "landing-form",
    user_agent: userAgent,
    ip_hash: ipHash,
  });

  if (error) {
    // Postgres unique_violation = "23505"
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Este email ya está registrado. Te escribiremos cuando publiquemos el programa.",
        field: "email",
      };
    }
    console.error("[pre-register] insert failed", error);
    return { ok: false, error: "No pudimos registrar tu interés ahora. Intenta de nuevo en unos minutos." };
  }

  // 7. Emails — fire and forget; don't block the UX on email failures
  void sendPreRegistrationEmails(data).catch((e) => console.error("[pre-register] email error", e));

  return { ok: true };
}
