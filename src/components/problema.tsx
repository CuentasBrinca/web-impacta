import { Reveal } from "@/components/reveal";
import { problemaStats } from "@/lib/content";

export function Problema() {
  return (
    <section id="evento" className="bg-paper px-6 sm:px-10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <div className="eyebrow">El contexto</div>
            <h2
              className="font-[var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              La IA está transformando todas las industrias.
            </h2>
            <p className="font-[var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-ink-soft max-w-[460px] mb-6">
              Pero en Chile, la adopción empresarial apenas comienza.
              <br />
              Impacta IA reúne a quienes están cerrando esa brecha.
            </p>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-paper-soft border border-ink-faint">
              <span
                className="w-2 h-2 rounded-full bg-mint-500"
                style={{ boxShadow: "0 0 0 4px rgba(29,210,179,0.2)" }}
              />
              <span className="font-[var(--font-body)] text-[13px] font-medium text-ink">
                Datos preliminares — informe completo en mayo
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border border-ink rounded-none">
              {problemaStats.map((s, i) => (
                <div
                  key={s.num}
                  className={[
                    "p-8 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:gap-8 items-center",
                    i < problemaStats.length - 1 ? "border-b border-ink-faint" : "",
                  ].join(" ")}
                >
                  <div
                    className="font-[var(--font-display)] font-bold leading-none tracking-[-0.04em] sm:min-w-[180px]"
                    style={{ fontSize: "clamp(48px, 6vw, 80px)", color: s.color }}
                  >
                    {s.num}
                  </div>
                  <div className="font-[var(--font-body)] text-base leading-[1.4] text-ink">
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
