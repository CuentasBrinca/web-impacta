import { z } from "zod";
import { formInteresOptions, formNivelOptions, formAreaOptions, NIVEL_OTRO, AREA_OTRO } from "@/lib/content";

/**
 * Validation schema for the pre-registration form.
 * Used by both the client form (react-hook-form) and the server action.
 */
export const preRegistrationSchema = z
  .object({
    nombre: z.string().trim().min(2, "Nombre muy corto").max(200),
    email: z.email("Email inválido").trim().toLowerCase().max(320),
    empresa: z.string().trim().min(2, "Organización muy corta").max(200),
    nivel: z.enum(formNivelOptions, { error: "Selecciona tu nivel de responsabilidad" }),
    // Texto libre cuando nivel === NIVEL_OTRO (validado en el refine de abajo).
    nivelOtro: z.string().trim().max(200).optional().default(""),
    area: z.enum(formAreaOptions, { error: "Selecciona el área a la que perteneces" }),
    // Texto libre cuando area === AREA_OTRO (validado en el refine de abajo).
    areaOtro: z.string().trim().max(200).optional().default(""),
    motivacion: z.string().trim().max(1000).optional().default(""),
    interes: z.enum(formInteresOptions),
    consent: z.literal(true, {
      error: "Necesitamos tu consentimiento para procesar tu inscripción.",
    }),
    // Honeypot — bots fill this; humans don't see it. Server rejects if non-empty.
    website: z.string().max(0).optional().default(""),
    // Turnstile token — verified server-side. Optional in dev (falls back to honeypot only).
    turnstileToken: z.string().optional(),
  })
  .refine((d) => d.nivel !== NIVEL_OTRO || d.nivelOtro.length >= 2, {
    error: "Especifica tu cargo",
    path: ["nivelOtro"],
  })
  .refine((d) => d.area !== AREA_OTRO || d.areaOtro.length >= 2, {
    error: "Especifica tu área",
    path: ["areaOtro"],
  });

export type PreRegistrationInput = z.infer<typeof preRegistrationSchema>;

export type FormResult =
  | { ok: true }
  | { ok: false; error: string; field?: keyof PreRegistrationInput };
