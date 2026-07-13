import { Reveal } from "@/components/reveal";
import { problemaStats } from "@/lib/content";

export function Problema() {
  return (
    <section id="evento" className="bg-paper px-6 sm:px-10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <div className="eyebrow">El contexto</div>
            <h2
              className="font-[family-name:var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              La IA está transformando todas las industrias.
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-ink-soft max-w-[540px] text-pretty mb-6">
              Pero en Chile, la adopción empresarial apenas comienza.
              <br />
              Impacta IA reúne a quienes están liderando el cambio.
            </p>
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
                    className="font-[family-name:var(--font-display)] font-bold leading-none tracking-[-0.04em] sm:min-w-[180px]"
                    style={{ fontSize: "clamp(48px, 6vw, 80px)", color: s.color }}
                  >
                    {s.num}
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-base leading-[1.4] text-ink">
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
