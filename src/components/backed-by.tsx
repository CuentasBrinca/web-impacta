import Image from "next/image";
import { partners, type Partner } from "@/lib/content";

export function BackedBy() {
  return (
    <section className="bg-paper text-ink px-6 sm:px-10 py-16 sm:py-20 border-y border-ink-faint">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-center">
          <div>
            <div className="eyebrow">Con el respaldo de</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 sm:gap-x-8 items-center">
            {partners.map((p) => (
              <PartnerSlot key={p.name} partner={p} />
            ))}
          </div>
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
