import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client for server-only contexts (Route Handlers, Server Actions).
 * Uses the SERVICE_ROLE key — bypasses RLS. Never import from client code.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
