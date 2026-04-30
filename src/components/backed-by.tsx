import Image from "next/image";
import { partners } from "@/lib/content";

export function BackedBy() {
  return (
    <section className="bg-paper text-ink px-6 sm:px-10 py-16 sm:py-20 border-y border-ink-faint">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-center">
          <div>
            <div className="eyebrow">Con el respaldo de</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-10 items-center">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-center"
                title={`${p.name} — ${p.note}`}
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  className="h-10 sm:h-12 w-auto object-contain max-w-full opacity-80 hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
