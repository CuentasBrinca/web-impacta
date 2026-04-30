import { partners } from "@/lib/content";

export function BackedBy() {
  return (
    <section className="bg-night text-white px-6 sm:px-10 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-center">
          <div className="eyebrow text-white/60">Con el respaldo de</div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:border-l md:border-white/10">
            {partners.map((p, i) => (
              <div
                key={p.name}
                className={[
                  "px-5 py-5 flex flex-col gap-1.5 min-w-0",
                  "border-r border-white/10",
                  // Hide trailing border on each row's last cell at each breakpoint
                  i === partners.length - 1 ? "lg:border-r-0" : "",
                ].join(" ")}
              >
                <div className="font-[var(--font-display)] font-bold text-xl tracking-[-0.02em] text-white whitespace-nowrap">
                  {p.name}
                </div>
                <div className="font-[var(--font-body)] text-[11px] text-white/50 tracking-wide">
                  {p.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
