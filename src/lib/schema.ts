import { z } from "zod";
import {
  formInteresOptions,
  formNivelOptions,
  formAreaOptions,
  NIVEL_OTRO,
  AREA_OTRO,
  type EventDayKey,
} from "@/lib/content";

/**
 * Validation schema for the pre-registration form.
 * Used by both the client form (react-hook-form) and the server action.
 */
export const preRegistrationSchema = z
  .object({
    nombre: z.string().trim().min(2, "Nombre muy corto").max(200),
    email: z.email("Email inválido").trim().toLowerCase().max(320),
    empresa: z.string().trim().min(2, "Organización muy corta").max(200),
    // Teléfono OPCIONAL, formato canónico chileno "+56 9 1234 5678" (el input
    // lo formatea al escribir; aquí solo se valida que esté completo o vacío).
    telefono: z
      .string()
      .trim()
      .optional()
      .default("")
      .refine((v) => v === "" || /^\+56 \d \d{4} \d{4}$/.test(v), {
        error: "Completa el teléfono (+56 9 1234 5678) o déjalo vacío",
      }),
    nivel: z.enum(formNivelOptions, { error: "Selecciona tu nivel de responsabilidad" }),
    // Texto libre cuando nivel === NIVEL_OTRO (validado en el refine de abajo).
    nivelOtro: z.string().trim().max(200).optional().default(""),
    area: z.enum(formAreaOptions, { error: "Selecciona el área a la que perteneces" }),
    // Texto libre cuando area === AREA_OTRO (validado en el refine de abajo).
    areaOtro: z.string().trim().max(200).optional().default(""),
    motivacion: z.string().trim().max(1000).optional().default(""),
    interes: z.enum(formInteresOptions),
    // Días de asistencia — solo aplican a interés "Asistente" (refine abajo).
    diaSep2: z.boolean().optional().default(false),
    diaSep3: z.boolean().optional().default(false),
    consent: z.literal(true, {
      error: "Necesitamos tu consentimiento para procesar tu inscripción.",
    }),
    // Opt-in OPCIONAL: compartir nombre y correo con sponsors oficiales.
    consentSponsors: z.boolean().optional().default(false),
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
  })
  .refine((d) => d.interes !== "Asistente" || d.diaSep2 || d.diaSep3, {
    error: "Selecciona al menos un día de asistencia",
    path: ["diaSep2"],
  });

export type PreRegistrationInput = z.infer<typeof preRegistrationSchema>;

/**
 * Resultado de la inscripción, del que dependen el correo enviado y la
 * pantalla de éxito:
 *  - confirmed_full:    ejecutivo confirmado en todos los días que marcó.
 *  - confirmed_partial: confirmado en al menos uno; el resto en lista de espera.
 *  - waitlisted:        ejecutivo sin cupo en ninguno de sus días.
 *  - generic:           no ejecutivo u otros intereses (flujo actual).
 */
export type RegistrationOutcome = "confirmed_full" | "confirmed_partial" | "waitlisted" | "generic";

export type FormResult =
  | {
      ok: true;
      outcome: RegistrationOutcome;
      confirmedDays: EventDayKey[];
      waitlistedDays: EventDayKey[];
    }
  | { ok: false; error: string; field?: keyof PreRegistrationInput };
