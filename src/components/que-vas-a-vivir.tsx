import { programa } from "@/lib/content";
import { ShareButton } from "@/components/share-button";

export function QueVasAVivir() {
  return (
    <section className="bg-paper-soft px-6 sm:px-10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="max-w-[760px]">
            <div className="eyebrow">El formato</div>
            <h2
              className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-4"
              style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
            >
              Dos días de
              <br />
              inmersión en IA aplicada.
            </h2>
          </div>
          <div className="flex flex-col gap-4 max-w-[360px]">
            <p className="font-[var(--font-body)] text-[15px] leading-[1.5] text-ink-soft m-0">
              Programa completo en junio. Pre-regístrate para recibirlo primero — y para asegurar tu cupo en la primera ola de invitaciones.
            </p>
            <ShareButton />
          </div>
        </div>

        {/* Grid de programa: bg de la grilla actúa como líneas (gap-px), cada celda en bg-paper. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-faint border border-ink overflow-hidden">
          {programa.map((it) => (
            <div
              key={it.title}
              className="bg-paper p-8 sm:p-10 flex flex-col gap-3 min-h-[220px]"
            >
              <div className="font-[var(--font-body)] text-[11px] font-bold tracking-[0.18em] uppercase text-blue-500">
                {it.tag}
              </div>
              <h3 className="font-[var(--font-display)] text-2xl sm:text-[28px] font-bold tracking-[-0.02em] m-0 text-ink">
                {it.title}
              </h3>
              <p className="font-[var(--font-body)] text-[15px] leading-[1.5] text-ink-soft m-0">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
