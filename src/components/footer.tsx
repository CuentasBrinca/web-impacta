import Image from "next/image";
import { footerColumns, event } from "@/lib/content";
import { FooterIntentLink } from "@/components/footer-link";

export function Footer() {
  return (
    <footer
      id="partners"
      className="relative overflow-hidden bg-ink text-white px-6 sm:px-10 pt-20 pb-8"
    >
      <Image
        src="/img/bg-photo-5.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.18] mix-blend-screen pointer-events-none select-none"
      />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Big closing statement */}
        <div className="pb-16 mb-12 border-b border-white/10">
          <h2
            className="font-[var(--font-display)] font-bold leading-[0.95] tracking-[-0.04em] m-0 max-w-[12ch] text-white"
            style={{ fontSize: "clamp(48px, 7vw, 112px)" }}
          >
            Santiago.
            <br />
            <span className="text-white/45">{event.monthYear}.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 pb-10 border-b border-white/10">
          <div>
            <Image
              src="/img/logo-horizontal-white.png"
              alt="Impacta IA Chile"
              width={160}
              height={32}
              className="h-8 w-auto"
            />
            <p className="font-[var(--font-body)] text-sm text-white/65 leading-[1.6] mt-4 max-w-[360px]">
              La conferencia de IA para quienes toman decisiones. Un evento de Brinca, con el respaldo de CORFO.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.h}>
              <div className="font-[var(--font-body)] text-[11px] font-bold tracking-[0.18em] uppercase text-white/65 mb-4">
                {col.h}
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {col.l.map((li) => (
                  <li key={li.t}>
                    {li.intent ? (
                      <FooterIntentLink intent={li.intent}>{li.t}</FooterIntentLink>
                    ) : (
                      <a
                        href={li.a}
                        className="font-[var(--font-body)] text-sm text-white no-underline transition-colors duration-150 hover:text-mint-500"
                      >
                        {li.t}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-7 flex flex-wrap justify-between items-center gap-4 font-[var(--font-body)] text-xs text-ink-soft">
          <div>© {new Date().getFullYear()} Impacta IA · Un evento de Brinca</div>
          <div className="flex gap-6">
            <a href="/terminos" className="text-white/65 hover:text-white">Términos</a>
            <a href="/privacidad" className="text-white/65 hover:text-white">Privacidad</a>
            <a href="/codigo-etica" className="text-white/65 hover:text-white">Código de ética</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
