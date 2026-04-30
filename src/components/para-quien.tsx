import { profiles } from "@/lib/content";

export function ParaQuien() {
  return (
    <section id="para-quien" className="bg-paper px-6 sm:px-10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start mb-14">
          <div>
            <div className="eyebrow">Para quién</div>
            <h2
              className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5"
              style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
            >
              Diseñado para quienes lideran la transformación.
            </h2>
          </div>
          <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-ink-soft lg:mt-16">
            400 cupos curados — un piso de seniority y una mezcla intencional de industrias. Networking entre pares reales.
          </p>
        </div>

        <div className="border-t border-ink">
          {profiles.map((p, i) => (
            <div
              key={p.role}
              className="grid grid-cols-1 md:grid-cols-[80px_1.4fr_1fr_1fr] gap-4 md:gap-8 items-center py-6 md:py-8 border-b border-ink-faint transition-colors duration-150 hover:bg-paper-soft"
            >
              <div className="hidden md:block font-[var(--font-display)] text-2xl font-bold text-ink-faint tracking-tight">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-[var(--font-display)] text-2xl md:text-[32px] font-bold tracking-[-0.02em] text-ink">
                {p.role}
              </div>
              <div className="font-[var(--font-body)] text-[13px] font-semibold tracking-[0.14em] uppercase text-blue-500">
                {p.what}
              </div>
              <div className="font-[var(--font-body)] text-[15px] leading-[1.5] text-ink-soft">
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
