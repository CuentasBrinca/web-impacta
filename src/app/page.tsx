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
import { Numeros } from "@/components/numeros";
import { QueVasAVivir } from "@/components/que-vas-a-vivir";
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
        <ParaQuien />
        <Numeros />
        <QueVasAVivir />
        <FormSection />
      </main>
      <Footer />
    </>
  );
}
