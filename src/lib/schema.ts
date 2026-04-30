import { z } from "zod";
import { formInteresOptions } from "@/lib/content";

/**
 * Validation schema for the pre-registration form.
 * Used by both the client form (react-hook-form) and the server action.
 */
export const preRegistrationSchema = z.object({
  nombre: z.string().trim().min(2, "Nombre muy corto").max(200),
  email: z.email("Email inválido").trim().toLowerCase().max(320),
  empresa: z.string().trim().min(2, "Empresa muy corta").max(200),
  cargo: z.string().trim().min(2, "Cargo muy corto").max(200),
  interes: z.enum(formInteresOptions),
  consent: z.literal(true, {
    error: "Necesitamos tu consentimiento para procesar tu inscripción.",
  }),
  // Honeypot — bots fill this; humans don't see it. Server rejects if non-empty.
  website: z.string().max(0).optional().default(""),
  // Turnstile token — verified server-side. Optional in dev (falls back to honeypot only).
  turnstileToken: z.string().optional(),
});

export type PreRegistrationInput = z.infer<typeof preRegistrationSchema>;

export type FormResult =
  | { ok: true }
  | { ok: false; error: string; field?: keyof PreRegistrationInput };
