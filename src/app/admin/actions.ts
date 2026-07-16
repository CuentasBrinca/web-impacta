"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  isAuthed,
} from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { manualStatusOptions, type Status, type Registration } from "@/lib/admin-data";
import { sendOutcomeEmail } from "@/lib/email";
import { eventDays, type EventDayKey } from "@/lib/content";
import type { FormInteres } from "@/lib/content";
import type { RegistrationOutcome } from "@/lib/schema";

/** Login form action. Redirects to /admin on success, back with ?error on failure. */
export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await setSessionCookie();
  redirect("/admin");
}

/** Logout action. */
export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

/**
 * Update the lifecycle status of one registration.
 * Solo estados "manuales": confirmed/waitlisted/cancelled se gestionan por el
 * flujo guiado (cupo + correo) y la cancelación por día — nunca por dropdown.
 */
export async function updateStatus(id: string, status: string): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
  if (!(manualStatusOptions as readonly string[]).includes(status)) {
    throw new Error("Estado inválido");
  }
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("pre_registrations")
    .update({ status: status as Status })
    .eq("id", id);
  if (error) {
    console.error("[admin] updateStatus failed", error);
    throw new Error("No se pudo actualizar el estado.");
  }
  revalidatePath("/admin");
}

/** Update the free-text notes of one registration. */
export async function updateNotes(id: string, notes: string): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
  const trimmed = notes.slice(0, 2000);
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("pre_registrations")
    .update({ notes: trimmed.length ? trimmed : null })
    .eq("id", id);
  if (error) {
    console.error("[admin] updateNotes failed", error);
    throw new Error("No se pudieron guardar las notas.");
  }
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
// Confirmación guiada, cancelación por día, reenvío, cupos y purga de pruebas
// ---------------------------------------------------------------------------

export type AdminActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const DAY_LABEL = Object.fromEntries(eventDays.map((d) => [d.date, d.short])) as Record<string, string>;

/** Deriva el resultado (y por tanto el correo) desde los estados por día de la fila. */
function outcomeFromRow(row: Pick<Registration, "dia_sep2" | "dia_sep3">): {
  outcome: RegistrationOutcome;
  confirmedDays: EventDayKey[];
  waitlistedDays: EventDayKey[];
} {
  const confirmedDays: EventDayKey[] = [];
  const waitlistedDays: EventDayKey[] = [];
  if (row.dia_sep2 === "confirmed") confirmedDays.push("sep2");
  if (row.dia_sep2 === "waitlisted") waitlistedDays.push("sep2");
  if (row.dia_sep3 === "confirmed") confirmedDays.push("sep3");
  if (row.dia_sep3 === "waitlisted") waitlistedDays.push("sep3");
  const outcome: RegistrationOutcome =
    confirmedDays.length > 0 && waitlistedDays.length === 0
      ? "confirmed_full"
      : confirmedDays.length > 0
        ? "confirmed_partial"
        : waitlistedDays.length > 0
          ? "waitlisted"
          : "generic";
  return { outcome, confirmedDays, waitlistedDays };
}

async function fetchRow(id: string) {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("pre_registrations")
    .select("id, nombre, email, interes, dia_sep2, dia_sep3, is_test")
    .eq("id", id)
    .single();
  if (error || !data) throw new Error("No se encontró la inscripción.");
  return data as Pick<Registration, "id" | "nombre" | "email" | "interes" | "dia_sep2" | "dia_sep3" | "is_test">;
}

/**
 * Flujo guiado de confirmación: valida cupo en la RPC atómica, confirma los
 * días pedidos y envía el correo de confirmación con calendario. Sirve para
 * históricos sin día y para promover desde la lista de espera.
 */
export async function confirmDays(id: string, dia2: boolean, dia3: boolean): Promise<AdminActionResult> {
  if (!(await isAuthed())) redirect("/admin/login");
  if (!dia2 && !dia3) return { ok: false, error: "Selecciona al menos un día." };

  const sb = supabaseAdmin();
  const { data: rpc, error } = await sb.rpc("admin_confirm_days", {
    p_id: id,
    p_dia2: dia2,
    p_dia3: dia3,
  });
  if (error) {
    console.error("[admin] confirmDays rpc failed", error);
    return { ok: false, error: "No se pudo confirmar. Intenta de nuevo." };
  }
  if (!rpc?.ok) {
    if (rpc?.error === "capacity") {
      const days = ((rpc.full_days ?? []) as string[]).map((d) => DAY_LABEL[d] ?? d).join(" y ");
      return { ok: false, error: `Sin cupo disponible para ${days}. Libera un cupo o sube el tope.` };
    }
    return { ok: false, error: "No se pudo confirmar la inscripción." };
  }

  const row = await fetchRow(id);
  const derived = outcomeFromRow(row);
  const emailRes = await sendOutcomeEmail({
    registrationId: row.id,
    nombre: row.nombre,
    email: row.email,
    interes: row.interes as FormInteres,
    ...derived,
  });

  revalidatePath("/admin");
  return emailRes.sent
    ? { ok: true, message: "Confirmado — correo de confirmación enviado." }
    : { ok: true, message: `Confirmado, pero el correo FALLÓ (${emailRes.error}). Reenvíalo desde la tabla.` };
}

/**
 * Cancela la asistencia de un día. Libera el cupo al instante, conserva el
 * historial y NO envía ningún correo (decisión de diseño: la persona ya avisó
 * por otro canal; un error de click se corrige re-confirmando sin ruido).
 */
export async function cancelDay(id: string, date: string): Promise<AdminActionResult> {
  if (!(await isAuthed())) redirect("/admin/login");
  if (!eventDays.some((d) => d.date === date)) return { ok: false, error: "Día inválido." };

  const sb = supabaseAdmin();
  const { data: rpc, error } = await sb.rpc("admin_cancel_day", { p_id: id, p_day: date });
  if (error || !rpc?.ok) {
    console.error("[admin] cancelDay failed", error ?? rpc);
    return { ok: false, error: "No se pudo cancelar." };
  }

  revalidatePath("/admin");
  const waiting = Number(rpc.waitlisted_count ?? 0);
  return {
    ok: true,
    message:
      waiting > 0
        ? `Cupo del ${DAY_LABEL[date]} liberado — hay ${waiting} en lista de espera para ese día.`
        : `Cupo del ${DAY_LABEL[date]} liberado.`,
  };
}

/** Reenvía el correo correspondiente al estado actual de la fila. */
export async function resendEmail(id: string): Promise<AdminActionResult> {
  if (!(await isAuthed())) redirect("/admin/login");

  const row = await fetchRow(id);
  const derived = outcomeFromRow(row);
  const emailRes = await sendOutcomeEmail({
    registrationId: row.id,
    nombre: row.nombre,
    email: row.email,
    interes: row.interes as FormInteres,
    ...derived,
  });

  revalidatePath("/admin");
  return emailRes.sent
    ? { ok: true, message: `Correo reenviado a ${row.email}.` }
    : { ok: false, error: `El envío falló de nuevo: ${emailRes.error}` };
}

/** Actualiza el cupo máximo de un día. Rige de inmediato (la RPC lo lee en vivo). */
export async function setCupo(date: string, cupo: number): Promise<AdminActionResult> {
  if (!(await isAuthed())) redirect("/admin/login");
  if (!eventDays.some((d) => d.date === date)) return { ok: false, error: "Día inválido." };
  if (!Number.isInteger(cupo) || cupo < 0 || cupo > 10000) return { ok: false, error: "Cupo inválido." };

  const sb = supabaseAdmin();
  const { error } = await sb.from("event_days").update({ cupo }).eq("day", date);
  if (error) {
    console.error("[admin] setCupo failed", error);
    return { ok: false, error: "No se pudo actualizar el cupo." };
  }
  revalidatePath("/admin");
  return { ok: true, message: `Cupo del ${DAY_LABEL[date]} actualizado a ${cupo}.` };
}

/** Borra TODAS las filas de prueba (is_test). Irreversible — el botón pide confirmación. */
export async function purgeTests(): Promise<AdminActionResult> {
  if (!(await isAuthed())) redirect("/admin/login");
  const sb = supabaseAdmin();
  const { error, count } = await sb
    .from("pre_registrations")
    .delete({ count: "exact" })
    .eq("is_test", true);
  if (error) {
    console.error("[admin] purgeTests failed", error);
    return { ok: false, error: "No se pudieron borrar las pruebas." };
  }
  revalidatePath("/admin");
  return { ok: true, message: `${count ?? 0} registros de prueba eliminados.` };
}
