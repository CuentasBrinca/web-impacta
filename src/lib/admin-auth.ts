import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal password gate for the /admin area.
 *
 * - The single password lives in the ADMIN_PASSWORD env var (set in .env.local
 *   for dev and in the Vercel dashboard for production).
 * - On login we set an httpOnly cookie whose value is an HMAC derived from the
 *   password. The plaintext password is never stored in the cookie, and the
 *   token cannot be forged without knowing the password.
 * - Auth checks recompute the expected token and compare in constant time.
 *
 * This is deliberately simple: one shared password, no user accounts. Good
 * enough to keep the leads list private; not meant for multi-user RBAC.
 */

export const ADMIN_COOKIE = "impacta_admin";
const SESSION_TAG = "impacta-admin-session-v1";
// 30 days — long enough that the manager rarely re-logs in.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD no está configurada (o es muy corta). Define ADMIN_PASSWORD en .env.local y en Vercel.",
    );
  }
  return pw;
}

/** Deterministic session token derived from the current password. */
export function sessionToken(): string {
  return createHmac("sha256", adminPassword()).update(SESSION_TAG).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  // Both are fixed-length hex digests; guard length to avoid throwing.
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/** Constant-time check that a submitted password matches ADMIN_PASSWORD. */
export function verifyPassword(candidate: string): boolean {
  const expected = createHmac("sha256", adminPassword()).update(SESSION_TAG).digest("hex");
  const got = createHmac("sha256", candidate ?? "").update(SESSION_TAG).digest("hex");
  return safeEqualHex(expected, got);
}

/** True when the incoming request carries a valid admin session cookie. */
export async function isAuthed(): Promise<boolean> {
  let expected: string;
  try {
    expected = sessionToken();
  } catch {
    // No password configured → nobody is authed.
    return false;
  }
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqualHex(token, expected);
}

/** Write the session cookie (call from a Server Action / Route Handler). */
export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Clear the session cookie. */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
