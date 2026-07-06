import Image from "next/image";
import { partnerGroups, type PartnerGroup } from "@/lib/content";

export function BackedBy() {
  return (
    <section className="bg-paper text-ink px-6 sm:px-10 py-14 sm:py-16 border-y border-ink-faint">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
          {partnerGroups.map((group) => (
            <PartnerGroupBlock key={group.label} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerGroupBlock({ group }: { group: PartnerGroup }) {
  const attribution = group.variant === "attribution";
  return (
    <div className={`flex flex-col gap-5 ${attribution ? "items-center" : "items-start"}`}>
      {!group.hideLabel && (
        <div
          className={
            attribution
              ? "font-[family-name:var(--font-body)] text-[11px] font-medium tracking-[0.02em] text-ink-soft text-center"
              : "eyebrow"
          }
        >
          {group.label}
        </div>
      )}
      <div className="flex items-center gap-8 sm:gap-10">
        {group.logos.map((l) => (
          <Image
            key={l.name}
            src={l.logo}
            alt={l.name}
            width={l.width}
            height={l.height}
            title={l.name}
            className={`${l.sizeClass ?? "h-9 sm:h-11"} w-auto object-contain`}
          />
        ))}
      </div>
    </div>
  );
}
