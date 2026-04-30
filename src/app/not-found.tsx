import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página no encontrada · Impacta IA",
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-night text-white px-6 py-32 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "-10%",
            right: "-10%",
            width: "60%",
            height: "70%",
            background: "radial-gradient(ellipse at center, rgba(0,0,255,0.18) 0%, rgba(0,0,255,0) 60%)",
          }}
        />

        <div className="relative text-center max-w-[640px]">
          <div
            className="font-[var(--font-display)] font-bold leading-none tracking-[-0.04em]"
            style={{ fontSize: "clamp(96px, 18vw, 240px)" }}
          >
            <span className="shimmer-text">404</span>
          </div>
          <h1
            className="font-[var(--font-display)] font-bold leading-tight tracking-[-0.02em] mt-6"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Esta página tomó un camino que no llega a ninguna parte.
          </h1>
          <p className="font-[var(--font-body)] text-base sm:text-lg leading-relaxed text-white/70 mt-6">
            Pero el evento sigue su rumbo. Volvamos al inicio.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <ButtonLink href="/" variant="primary" size="lg">
              Ir al inicio
            </ButtonLink>
            <ButtonLink href="/#form" variant="ghost-dark" size="lg">
              Pre-regístrate
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
