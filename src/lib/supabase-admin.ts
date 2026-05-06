import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Vercel's env-var UI sometimes preserves line breaks when long values
 * (JWTs, URLs) are pasted from chat/email clients that auto-wrap. Those
 * line breaks become invalid HTTP header values at runtime.
 *
 * JWTs and URLs never contain valid whitespace, so stripping it is a safe
 * defensive normalization that prevents this whole class of paste errors.
 */
function readEnv(name: string): string {
  const raw = process.env[name];
  if (!raw) {
    throw new Error(`Missing env var: ${name}`);
  }
  return raw.replace(/\s+/g, "");
}

/**
 * Admin Supabase client for server-only contexts (Route Handlers, Server Actions).
 * Uses the SERVICE_ROLE key — bypasses RLS. Never import from client code.
 */
export function supabaseAdmin() {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
