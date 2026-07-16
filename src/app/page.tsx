import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { CursorGlow } from "@/components/cursor-glow";
import { EventJsonLd } from "@/components/event-json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
import { BackedBy } from "@/components/backed-by";
import { Problema } from "@/components/problema";
import { Ejes } from "@/components/ejes";
import { ParaQuien } from "@/components/para-quien";
import { Jornadas } from "@/components/jornadas";
import { Speakers } from "@/components/speakers";
import { QueVasAVivir } from "@/components/que-vas-a-vivir";
import { Organizador } from "@/components/organizador";
import { FormSection } from "@/components/form-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <EventJsonLd />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <BackedBy />
        <Problema />
        <Ejes />
        <Jornadas />
        <Speakers />
        <ParaQuien />
        <QueVasAVivir />
        <Organizador />
        <FormSection />
      </main>
      <Footer />
    </>
  );
}
