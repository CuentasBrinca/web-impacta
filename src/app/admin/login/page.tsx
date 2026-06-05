import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAuthed } from "@/lib/admin-auth";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Acceso · Inscritos Impacta IA",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthed()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="min-h-dvh grid place-items-center bg-night px-6 text-paper">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-8 backdrop-blur"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint-500">
          Impacta IA · Admin
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold">Inscritos</h1>
        <p className="mt-1 text-sm text-white/60">Ingresa la contraseña para gestionar las inscripciones.</p>

        <label htmlFor="password" className="mt-6 block text-sm font-medium text-white/80">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-lg bg-night/60 px-4 py-3 text-paper ring-1 ring-white/15 outline-none focus:ring-2 focus:ring-mint-500"
        />

        {error ? (
          <p className="mt-3 text-sm text-pink-300">Contraseña incorrecta. Intenta de nuevo.</p>
        ) : null}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-mint-500 px-4 py-3 font-semibold text-night transition hover:bg-mint-400"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
