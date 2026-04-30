"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { formInteresOptions, formBenefits, type FormInteres } from "@/lib/content";

type FormState = {
  nombre: string;
  email: string;
  empresa: string;
  cargo: string;
  interes: FormInteres;
  consent: boolean;
};

const INITIAL: FormState = {
  nombre: "",
  email: "",
  empresa: "",
  cargo: "",
  interes: "Asistir",
  consent: false,
};

export function FormSection() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Placeholder submit — F3 wires this to the server action.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.consent) {
      setError("Necesitamos tu consentimiento para procesar tu inscripción.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSent(true);
  };

  return (
    <section
      id="form"
      className="relative overflow-hidden bg-night text-white px-6 sm:px-10 py-24 sm:py-32"
    >
      <Image
        src="/img/bg-photo-2.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.22] mix-blend-screen pointer-events-none select-none"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: "-15%",
          bottom: "-15%",
          width: "60%",
          height: "70%",
          background: "radial-gradient(ellipse at center, rgba(0,0,255,0.22) 0%, rgba(0,0,255,0) 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-start">
          <div>
            <div className="eyebrow text-white/60">Pre-registro</div>
            <h2
              className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-6 text-white"
              style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
            >
              Sé parte de Impacta IA.
            </h2>
            <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-white/85 max-w-[460px] mb-10">
              Los cupos son limitados. Deja tus datos y serás el primero en acceder al programa, speakers y pre-venta.
            </p>
            <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
              {formBenefits.map((b) => (
                <li key={b.txt} className="flex items-center gap-3 font-[var(--font-body)] text-sm text-white/70">
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

          {sent ? <SuccessCard email={form.email} /> : (
            <FormCard
              form={form}
              update={update}
              submit={submit}
              submitting={submitting}
              error={error}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function SuccessCard({ email }: { email: string }) {
  return (
    <div className="border border-white/20 p-12 sm:p-14 rounded-2xl bg-white/[0.03]">
      <div
        className="font-[var(--font-display)] font-bold tracking-[-0.03em] mb-4"
        style={{
          fontSize: "clamp(40px, 5vw, 56px)",
          background: "linear-gradient(120deg, #1DD2B3, #6666FF)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        Listo.
      </div>
      <p className="font-[var(--font-body)] text-base sm:text-[17px] leading-[1.5] text-white/85 m-0 max-w-[440px]">
        Recibimos tu interés. Te escribiremos a <strong className="text-white">{email}</strong> con la próxima actualización del programa.
      </p>
    </div>
  );
}

function FormCard({
  form,
  update,
  submit,
  submitting,
  error,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  submit: (e: FormEvent) => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Field label="Nombre" className="sm:col-span-2">
        <input
          type="text" required placeholder="Tu nombre" autoComplete="name"
          value={form.nombre}
          onChange={(e) => update("nombre", e.target.value)}
        />
      </Field>

      <Field label="Email corporativo">
        <input
          type="email" required placeholder="nombre@empresa.cl" autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </Field>

      <Field label="Empresa">
        <input
          type="text" required placeholder="Empresa" autoComplete="organization"
          value={form.empresa}
          onChange={(e) => update("empresa", e.target.value)}
        />
      </Field>

      <Field label="Cargo" className="sm:col-span-2">
        <input
          type="text" required placeholder="CEO, CTO, Director de Innovación..." autoComplete="organization-title"
          value={form.cargo}
          onChange={(e) => update("cargo", e.target.value)}
        />
      </Field>

      <Field label="Quiero participar como" className="sm:col-span-2">
        <div className="flex flex-wrap gap-2 mt-1.5">
          {formInteresOptions.map((o) => {
            const active = form.interes === o;
            return (
              <button
                type="button"
                key={o}
                onClick={() => update("interes", o)}
                aria-pressed={active}
                className={[
                  "px-[18px] py-2.5 rounded-full font-[var(--font-body)] text-sm transition-all duration-150 border cursor-pointer",
                  active
                    ? "bg-white text-ink border-white"
                    : "bg-transparent text-white/70 border-white/25 hover:text-white hover:border-white/50",
                ].join(" ")}
              >
                {o}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Ley 21.719 / GDPR explicit consent */}
      <label className="sm:col-span-2 flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox" required
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
        />
        <span className="font-[var(--font-body)] text-xs text-white/65 leading-[1.55]">
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

      <div className="sm:col-span-2 mt-4 flex flex-wrap items-center justify-between gap-4">
        <span className="font-[var(--font-body)] text-xs text-white/50">
          Al enviar, aceptas nuestra política de privacidad.
        </span>
        <Button type="submit" variant="inverse" size="lg" disabled={submitting}>
          {submitting ? "Enviando..." : "Quiero participar →"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-[var(--font-body)] text-xs font-semibold tracking-[0.12em] uppercase text-white/60">
        {label}
      </span>
      <div className="[&_input]:w-full [&_input]:bg-transparent [&_input]:border-0 [&_input]:border-b [&_input]:border-white/25 [&_input]:text-white [&_input]:font-[var(--font-body)] [&_input]:text-base [&_input]:py-2.5 [&_input]:outline-none [&_input]:transition-colors [&_input::placeholder]:text-white/35 [&_input:focus]:border-white">
        {children}
      </div>
    </label>
  );
}
