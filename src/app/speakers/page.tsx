import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SpeakersDayGrid } from "@/components/speakers-day-grid";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Speakers · Impacta IA",
  description:
    "Conoce a los más de 80 oradores de Impacta IA — líderes y expertos en inteligencia artificial aplicada.",
  alternates: { canonical: "/speakers" },
};

export default function SpeakersPage() {
  return (
    <>
      <Nav />
      <main className="bg-night text-white">
        {/* Encabezado */}
        <div className="px-6 sm:px-10 pt-32 pb-12 sm:pb-16">
          <div className="mx-auto max-w-[1280px]">
            <div className="eyebrow text-white/60">El line-up</div>
            <h1
              className="font-[family-name:var(--font-display)] font-bold leading-[0.96] tracking-[-0.035em] mt-5 text-white max-w-[18ch]"
              style={{ fontSize: "clamp(44px, 7vw, 104px)" }}
            >
              Todos los Speakers.
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[clamp(17px,1.4vw,22px)] leading-[1.45] text-white/75 max-w-[620px] mt-6">
              Más de 80 oradores — líderes globales y referentes en IA aplicada — durante dos días de programa.
            </p>
          </div>
        </div>

        {/* Grilla completa */}
        <div className="px-6 sm:px-10 pb-24 sm:pb-32">
          <div className="mx-auto max-w-[1280px]">
            <SpeakersDayGrid />

            {/* Volver al inicio */}
            <div className="mt-16 flex justify-center">
              <ButtonLink href="/#speakers" variant="ghost-dark" size="lg">
                ← Volver al inicio
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
