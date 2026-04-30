import { programa } from "@/lib/content";

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
          <p className="font-[var(--font-body)] text-[15px] leading-[1.5] text-ink-soft m-0 max-w-[360px]">
            Programa completo en junio. Pre-regístrate para recibirlo primero — y para acceder a la pre-venta de cupos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-ink bg-paper">
          {programa.map((it, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <div
                key={it.title}
                className={[
                  "p-8 sm:p-10 flex flex-col gap-3 min-h-[220px]",
                  // Right border (md/lg only)
                  col < 2 ? "lg:border-r lg:border-ink-faint" : "",
                  // 2-col grid borders
                  i % 2 === 0 ? "md:border-r md:border-ink-faint lg:border-r-0" : "",
                  // Bottom border for first row(s) - keep simple: border-b on every cell, then remove on last
                  i < programa.length - 1 ? "border-b border-ink-faint" : "",
                  // On lg, remove bottom border for last row (i.e. last 3 cells)
                  i >= programa.length - 3 ? "lg:border-b-0" : "",
                  // Restore lg right border based on col index
                  col < 2 ? "lg:border-r lg:border-ink-faint" : "lg:border-r-0",
                  row < Math.floor((programa.length - 1) / 3) ? "lg:border-b lg:border-ink-faint" : "",
                ].join(" ")}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
