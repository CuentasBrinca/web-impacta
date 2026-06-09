import Image from "next/image";
import { organizer, partners, type Partner } from "@/lib/content";

export function BackedBy() {
  const visible = partners.filter((p) => !p.hidden);
  const hasSupporters = visible.length > 0;
  return (
    <section className="bg-paper text-ink px-6 sm:px-10 py-16 sm:py-20 border-y border-ink-faint">
      <div className="mx-auto max-w-[1280px]">
        <div
          className={
            hasSupporters
              ? "grid grid-cols-1 md:grid-cols-[minmax(200px,260px)_1fr] gap-10 md:gap-14 items-start"
              : "grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12 items-center"
          }
        >
          {/* Organizador — rol jerárquico superior, a la izquierda. */}
          <div>
            <div className="eyebrow">Producido por</div>
            <a
              href={organizer.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${organizer.name} — organizador de Impacta IA`}
              className="inline-flex items-center group mt-6"
            >
              <Image
                src={organizer.logoDark}
                alt={organizer.name}
                width={organizer.width}
                height={organizer.height}
                className="h-11 sm:h-14 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200"
              />
            </a>
          </div>

          {/* Respaldos — a la derecha, a la misma altura que el organizador. */}
          {hasSupporters && (
            <div className="pt-10 border-t border-ink-faint md:pt-0 md:border-t-0 md:border-l md:border-ink-faint md:pl-10 lg:pl-14">
              <div className="eyebrow">Con el respaldo de</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 sm:gap-x-8 items-center mt-6">
                {visible.map((p) => (
                  <PartnerSlot key={p.name} partner={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PartnerSlot({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return (
      <div className="flex items-center justify-center" title={`${partner.name} — ${partner.note}`}>
        <Image
          src={partner.logo}
          alt={partner.name}
          width={partner.width ?? 240}
          height={partner.height ?? 80}
          className="h-9 sm:h-10 w-auto object-contain max-w-full opacity-80 hover:opacity-100 transition-opacity duration-200"
        />
      </div>
    );
  }
  // Wordmark fallback: pending logo
  return (
    <div
      className="flex items-center justify-center h-9 sm:h-10"
      title={`${partner.name} — ${partner.note}`}
    >
      <span className="font-[var(--font-display)] font-bold text-base sm:text-lg tracking-[-0.02em] text-ink-soft whitespace-nowrap">
        {partner.name}
      </span>
    </div>
  );
}
