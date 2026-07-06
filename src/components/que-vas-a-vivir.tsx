import Image from "next/image";
import { programa } from "@/lib/content";
import { ShareButton } from "@/components/share-button";

export function QueVasAVivir() {
  return (
    <>
      {/* Cabecera — sobre superficie clara */}
      <section id="formatos" className="bg-paper-soft px-6 sm:px-10 pt-24 sm:pt-32 pb-16 sm:pb-20 scroll-mt-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[760px]">
              <div className="eyebrow">El formato</div>
              <h2
                className="font-[family-name:var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 mb-4"
                style={{ fontSize: "clamp(44px, 6.5vw, 96px)" }}
              >
                Dos días de inmersión
                <br />
                en IA aplicada.
              </h2>
            </div>
            <div className="flex flex-col gap-4 max-w-[360px]">
              <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.5] text-ink-soft m-0">
                Programa completo en junio. Pre-regístrate para recibirlo primero — y para asegurar tu cupo en la primera ola de invitaciones.
              </p>
              <ShareButton />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de programa — banda oscura full-bleed con textura de líneas */}
      <section className="relative overflow-hidden bg-night px-6 sm:px-10 py-16 sm:py-24">
        {/* Textura de fondo (líneas azules) */}
        <Image
          src="/img/Mask group (1).png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right pointer-events-none select-none opacity-70"
        />

        <div className="relative z-10 mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {programa.map((it) => (
              <article
                key={it.title}
                className="group flex flex-col overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors duration-300 hover:border-white/25"
              >
                {/* Imagen */}
                <div className="relative aspect-[5/1] overflow-hidden">
                  <Image
                    src={it.img}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105"
                  />
                </div>

                {/* Contenido */}
                <div className="flex flex-col gap-3 p-8 sm:p-9">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-[26px] font-bold tracking-[-0.02em] m-0 text-white">
                    {it.title}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.5] text-white/55 m-0">
                    {it.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
