"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  formInteresOptions,
  formNivelOptions,
  formAreaOptions,
  formBenefits,
  eventDays,
  NIVEL_OTRO,
  AREA_OTRO,
  type FormInteres,
  type EventDayKey,
} from "@/lib/content";
import { googleCalendarUrl, outlookCalendarUrl, icsDownloadPath } from "@/lib/calendar";
import { preRegister } from "@/app/actions/pre-register";
import type { FormResult } from "@/lib/schema";
import { FORM_INTENT_EVENT, takePendingFormIntent, type FormIntentDetail } from "@/lib/form-intent";

type FormState = {
  nombre: string;
  email: string;
  empresa: string;
  nivel: string;
  nivelOtro: string;
  area: string;
  areaOtro: string;
  interes: FormInteres;
  diaSep2: boolean;
  diaSep3: boolean;
  motivacion: string;
  consent: boolean;
  website: string; // honeypot
};

const INITIAL: FormState = {
  nombre: "",
  email: "",
  empresa: "",
  nivel: "",
  nivelOtro: "",
  area: "",
  areaOtro: "",
  interes: "Asistente",
  diaSep2: false,
  diaSep3: false,
  motivacion: "",
  consent: false,
  website: "",
};

/** Resultado exitoso del server action — define la variante de la pantalla de éxito. */
type SuccessResult = Extract<FormResult, { ok: true }>;

export function FormSection() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [result, setResult] = useState<SuccessResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // pulseKey changes whenever an external "set-form-intent" event fires —
  // remounting the chip's highlight ring re-triggers its animation.
  const [pulseKey, setPulseKey] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Apply an intent stashed before navigating here from a page without the
  // form (e.g. footer "Quiero ser sponsor" on /terminos). The browser already
  // scrolls to #form via the hash; we just preselect + pulse the chip.
  useEffect(() => {
    const pending = takePendingFormIntent();
    if (!pending) return;
    setForm((f) => ({ ...f, interes: pending }));
    setPulseKey((k) => k + 1);
  }, []);

  // Listen for clicks from the hero / footer that pre-select an interest.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<FormIntentDetail>).detail;
      if (!detail?.interes) return;
      setForm((f) => ({ ...f, interes: detail.interes }));
      setPulseKey((k) => k + 1);
      // Smooth-scroll the form into view, with a small offset so the heading is visible
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    window.addEventListener(FORM_INTENT_EVENT, handler);
    return () => window.removeEventListener(FORM_INTENT_EVENT, handler);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    // Los checkboxes de día no pueden expresar "al menos uno" con `required`
    // nativo — se valida aquí (y de nuevo en el server via zod).
    if (form.interes === "Asistente" && !form.diaSep2 && !form.diaSep3) {
      setError("Selecciona al menos un día de asistencia.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const res = await preRegister(form);
    setSubmitting(false);
    if (res.ok) {
      setResult(res);
    } else {
      setError(res.error);
    }
  };

  return (
    <section
      id="form"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#18181A] text-white px-6 sm:px-10 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-start">
          <div>
            <div className="eyebrow text-white/60">Pre-inscripción evento</div>
            <div className="w-fit">
              <h2
                className="font-[family-name:var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-4 text-white"
                style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
              >
                Sé parte de
              </h2>
              <div className="relative w-full aspect-[959/188] mb-6">
                <Image
                  src="/img/logo-imparta-ia-formulario.png"
                  alt="Impacta IA"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="font-[family-name:var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-white/85 max-w-[460px] mb-10">
              Los cupos son limitados. La organización revisará las postulaciones y comunicará posteriormente la confirmación de participación. Completa tu registro y sé de los primeros en conocer el programa, los speakers y las novedades de Impacta IA.
            </p>
            <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
              {formBenefits.map((b) => (
                <li key={b.txt} className="flex items-center gap-3 font-[family-name:var(--font-body)] text-sm text-white/70">
                  <span
                    aria-hidden
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: b.dot, boxShadow: `0 0 0 5px ${b.dot}22` }}
                  />
                  <span>{b.txt}</span>
                </li>
              ))}
            </ul>
          </div>

          {result ? <SuccessCard email={form.email} result={result} /> : (
            <FormCard
              form={form}
              update={update}
              submit={submit}
              submitting={submitting}
              error={error}
              pulseKey={pulseKey}
            />
          )}
        </div>
      </div>
    </section>
  );
}

const DAY_LABEL = Object.fromEntries(eventDays.map((d) => [d.key, d.label])) as Record<EventDayKey, string>;

/** "el miércoles 2 de septiembre" / "el miércoles 2 y el jueves 3 de septiembre" */
function dayPhrase(keys: EventDayKey[]): string {
  const lower = keys.map((k) => DAY_LABEL[k].charAt(0).toLowerCase() + DAY_LABEL[k].slice(1));
  if (lower.length === 1) return `el ${lower[0]}`;
  return `el ${lower[0].replace(" de septiembre", "")} y el ${lower[1]}`;
}

function SuccessCard({ email, result }: { email: string; result: SuccessResult }) {
  const { outcome, confirmedDays, waitlistedDays } = result;
  const confirmed = outcome === "confirmed_full" || outcome === "confirmed_partial";

  const heading = confirmed ? "Confirmado." : outcome === "waitlisted" ? "En lista de espera." : "Listo.";

  return (
    <div className="border border-white/20 p-12 sm:p-14 rounded-2xl bg-white/[0.03]">
      <div
        className="font-[family-name:var(--font-display)] font-bold tracking-[-0.03em] mb-4"
        style={{
          fontSize: "clamp(40px, 5vw, 56px)",
          background: "linear-gradient(120deg, #1DD2B3, #6666FF)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        {heading}
      </div>

      {confirmed ? (
        <>
          <p className="font-[family-name:var(--font-body)] text-base sm:text-[17px] leading-[1.5] text-white/85 m-0 max-w-[440px]">
            Tu cupo está confirmado para <strong className="text-white">{dayPhrase(confirmedDays)}</strong>.
            {outcome === "confirmed_partial" && (
              <>
                {" "}Para {dayPhrase(waitlistedDays)} los cupos están completos: quedaste en lista de espera
                y te avisaremos si se libera un lugar.
              </>
            )}
            {" "}Te enviamos los detalles a <strong className="text-white">{email}</strong>.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {confirmedDays.map((k) => (
              <div key={k}>
                <div className="font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.12em] uppercase text-white/60 mb-2.5">
                  {DAY_LABEL[k]} · 09:00–18:00
                </div>
                <div className="flex flex-wrap gap-2">
                  <CalendarButton href={googleCalendarUrl(k)} external label="Google Calendar" />
                  <CalendarButton href={outlookCalendarUrl(k)} external label="Outlook" />
                  <CalendarButton href={icsDownloadPath(k)} label="Apple / .ics" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : outcome === "waitlisted" ? (
        <p className="font-[family-name:var(--font-body)] text-base sm:text-[17px] leading-[1.5] text-white/85 m-0 max-w-[440px]">
          Los cupos para {dayPhrase(waitlistedDays)} están completos, así que quedaste en{" "}
          <strong className="text-white">lista de espera</strong>. Si se libera un lugar, te escribiremos
          de inmediato a <strong className="text-white">{email}</strong>.
        </p>
      ) : (
        <p className="font-[family-name:var(--font-body)] text-base sm:text-[17px] leading-[1.5] text-white/85 m-0 max-w-[440px]">
          Recibimos tu interés. Te escribiremos a <strong className="text-white">{email}</strong> para
          confirmar tu invitación.
        </p>
      )}
    </div>
  );
}

function CalendarButton({ href, label, external = false }: { href: string; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full font-[family-name:var(--font-body)] text-sm border border-white/25 text-white/85 hover:text-white hover:border-white/60 transition-colors duration-150"
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4.5" width="14" height="12" rx="2" />
        <path d="M3 8.5h14M7 3v3M13 3v3" strokeLinecap="round" />
      </svg>
      {label}
    </a>
  );
}

function FormCard({
  form,
  update,
  submit,
  submitting,
  error,
  pulseKey,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  submit: (e: FormEvent) => void;
  submitting: boolean;
  error: string | null;
  pulseKey: number;
}) {
  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Honeypot — hidden from humans (a11y + visual). Bots fill it; server rejects. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" tabIndex={-1}>
        <label>
          Sitio web (no rellenar)
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>

      <Field label="Nombre" required className="sm:col-span-2">
        <input
          type="text" required placeholder="Nombre y Apellido" autoComplete="name"
          value={form.nombre}
          onChange={(e) => update("nombre", e.target.value)}
        />
      </Field>

      <Field label="Email corporativo" required>
        <input
          type="email" required placeholder="nombre@empresa.cl" autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </Field>

      <Field label="Organización" required>
        <input
          type="text" required placeholder="Empresa" autoComplete="organization"
          value={form.empresa}
          onChange={(e) => update("empresa", e.target.value)}
        />
      </Field>

      <SelectField
        label="Nivel de responsabilidad" required
        value={form.nivel}
        onChange={(v) => update("nivel", v)}
        options={formNivelOptions}
      />

      <SelectField
        label="Área a la que pertenece" required
        value={form.area}
        onChange={(v) => update("area", v)}
        options={formAreaOptions}
      />

      {form.nivel === NIVEL_OTRO && (
        <Field label="Especifica tu cargo" required className="sm:col-span-2">
          <input
            type="text" required placeholder="Tu cargo" maxLength={200}
            value={form.nivelOtro}
            onChange={(e) => update("nivelOtro", e.target.value)}
          />
        </Field>
      )}

      {form.area === AREA_OTRO && (
        <Field label="Especifica tu área" required className="sm:col-span-2">
          <input
            type="text" required placeholder="Tu área" maxLength={200}
            value={form.areaOtro}
            onChange={(e) => update("areaOtro", e.target.value)}
          />
        </Field>
      )}

      <Field label="Quiero participar como" required className="sm:col-span-2">
        <div className="flex flex-wrap gap-2 mt-1.5">
          {formInteresOptions.map((o) => {
            const active = form.interes === o;
            const pulsing = active && pulseKey > 0;
            return (
              <motion.button
                type="button"
                key={o}
                onClick={() => update("interes", o)}
                aria-pressed={active}
                // 3-cycle bounce, slightly larger, slow ease in-out — feels deliberate
                animate={
                  pulsing
                    ? { scale: [1, 1.09, 1, 1.06, 1, 1.04, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1], times: [0, 0.18, 0.36, 0.54, 0.72, 0.86, 1] }}
                className={[
                  "relative px-[18px] py-2.5 rounded-full font-[family-name:var(--font-body)] text-sm transition-colors duration-150 border cursor-pointer",
                  active
                    ? "bg-white text-ink border-white"
                    : "bg-transparent text-white/70 border-white/25 hover:text-white hover:border-white/50",
                ].join(" ")}
              >
                {/* Soft glow halo behind the chip during the pulse */}
                <AnimatePresence>
                  {pulsing && (
                    <motion.span
                      key={`glow-${pulseKey}`}
                      aria-hidden
                      className="absolute inset-[-4px] rounded-full pointer-events-none"
                      style={{
                        boxShadow: "0 0 0 0 rgba(255,255,255,0.5)",
                      }}
                      initial={{ boxShadow: "0 0 0 0 rgba(255,255,255,0.55)" }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.55)",
                          "0 0 0 12px rgba(255,255,255,0.25)",
                          "0 0 0 6px rgba(255,255,255,0.35)",
                          "0 0 0 14px rgba(255,255,255,0.18)",
                          "0 0 0 8px rgba(255,255,255,0.22)",
                          "0 0 0 0 rgba(255,255,255,0)",
                        ],
                      }}
                      exit={{ boxShadow: "0 0 0 0 rgba(255,255,255,0)" }}
                      transition={{ duration: 2.4, ease: "easeOut", times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10">{o}</span>

                {/* 3 staggered pulse rings — give the moment air to breathe */}
                <AnimatePresence>
                  {pulsing && [0, 1, 2].map((i) => (
                    <motion.span
                      key={`ring-${pulseKey}-${i}`}
                      aria-hidden
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ border: "1.5px solid rgba(255,255,255,0.7)" }}
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.85, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.4, ease: [0.2, 0, 0, 1], delay: i * 0.32 }}
                    />
                  ))}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </Field>

      {form.interes === "Asistente" && (
        <Field label="Día(s) de asistencia" required className="sm:col-span-2">
          <div className="flex flex-wrap gap-2 mt-1.5">
            {eventDays.map((d) => {
              const checked = d.key === "sep2" ? form.diaSep2 : form.diaSep3;
              return (
                <button
                  type="button"
                  key={d.key}
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => update(d.key === "sep2" ? "diaSep2" : "diaSep3", !checked)}
                  className={[
                    "flex items-center gap-2.5 px-[18px] py-2.5 rounded-full font-[family-name:var(--font-body)] text-sm transition-colors duration-150 border cursor-pointer",
                    checked
                      ? "bg-white text-ink border-white"
                      : "bg-transparent text-white/70 border-white/25 hover:text-white hover:border-white/50",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "flex items-center justify-center w-4 h-4 rounded border transition-colors",
                      checked ? "bg-ink border-ink" : "border-white/40",
                    ].join(" ")}
                  >
                    {checked && (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {d.label}
                </button>
              );
            })}
          </div>
          <p className="font-[family-name:var(--font-body)] text-xs text-white/45 mt-2 mb-0">
            Puedes marcar ambos días.
          </p>
        </Field>
      )}

      <Field label="Motivación para asistir" className="sm:col-span-2">
        <input
          type="text" placeholder="Respuesta abierta" maxLength={1000}
          value={form.motivacion}
          onChange={(e) => update("motivacion", e.target.value)}
        />
      </Field>

      {/* Ley 21.719 / GDPR explicit consent */}
      <label className="sm:col-span-2 flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox" required
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
        />
        <span className="font-[family-name:var(--font-body)] text-xs text-white/65 leading-[1.55]">
          Acepto que Brinca trate mis datos para enviarme información sobre Impacta IA, conforme a la
          {" "}
          <a href="/privacidad" className="text-white underline underline-offset-2 hover:text-mint-500">
            política de privacidad
          </a>
          {" "}
          (Ley 21.719). Puedo darme de baja en cualquier momento.
        </span>
      </label>

      {error && (
        <div role="alert" className="sm:col-span-2 text-sm text-pink-400 bg-pink-500/10 border border-pink-500/30 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="sm:col-span-2 mt-4 flex justify-end">
        <Button type="submit" variant="inverse" size="lg" disabled={submitting}>
          {submitting ? "Enviando..." : "Quiero participar →"}
        </Button>
      </div>

      <p className="sm:col-span-2 font-[family-name:var(--font-body)] text-xs text-white/50 leading-[1.55]">
        Completar este formulario no garantiza la participación en el evento. Debido a la disponibilidad limitada de cupos, todas las postulaciones serán revisadas por la organización y los resultados serán comunicados posteriormente por correo electrónico.
      </p>
    </form>
  );
}

function Field({
  label,
  children,
  required = false,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.12em] uppercase text-white/60">
        {label}
        {required && <span className="text-pink-500 ml-0.5">*</span>}
      </span>
      <div className="[&_input]:w-full [&_input]:bg-transparent [&_input]:border-0 [&_input]:border-b [&_input]:border-white/25 [&_input]:text-white [&_input]:font-[family-name:var(--font-body)] [&_input]:text-base [&_input]:py-2.5 [&_input]:outline-none [&_input]:transition-colors [&_input::placeholder]:text-white/35 [&_input:focus]:border-white">
        {children}
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
  className?: string;
}) {
  const empty = value === "";
  return (
    <Field label={label} required={required} className={className}>
      <div className="relative">
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full appearance-none cursor-pointer bg-transparent border-0 border-b border-white/25",
            "font-[family-name:var(--font-body)] text-base py-2.5 pr-8 outline-none transition-colors",
            "focus:border-white [&>option]:text-ink",
            empty ? "text-white/35" : "text-white",
          ].join(" ")}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-white/55"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Field>
  );
}
