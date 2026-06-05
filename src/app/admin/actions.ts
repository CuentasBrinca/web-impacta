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
import { statusOptions, type Status } from "@/lib/admin-data";

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

/** Update the lifecycle status of one registration. */
export async function updateStatus(id: string, status: string): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
  if (!(statusOptions as readonly string[]).includes(status)) {
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
