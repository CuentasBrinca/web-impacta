import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { ReactNode } from "react";

export function LegalShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      {/* Spacer below nav, since nav is fixed and overlapping the page header */}
      <div className="bg-night text-white pt-32 pb-16 px-6 sm:px-10">
        <div className="mx-auto max-w-[860px]">
          <div className="eyebrow text-white/60">{eyebrow}</div>
          <h1
            className="font-[var(--font-display)] font-bold leading-[1] tracking-[-0.035em] mt-5 text-white"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            {title}
          </h1>
        </div>
      </div>
      <main className="bg-paper text-ink px-6 sm:px-10 py-16 sm:py-24">
        <article className="mx-auto max-w-[760px] prose-legal">
          <div className="rounded-2xl border border-pink-300 bg-pink-100/50 px-5 py-4 mb-10 text-sm text-pink-500">
            <strong className="font-semibold">PLACEHOLDER pre-launch:</strong> el copy de esta página debe ser
            reemplazado por texto legal real revisado por asesoría jurídica antes de lanzar el sitio. No publicar al
            público hasta entonces.
          </div>
          {children}
        </article>
      </main>
      <Footer />

      {/* Minimal typography for legal copy */}
      <style>{`
        .prose-legal h2 {
          font-family: var(--font-display);
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .prose-legal h3 {
          font-family: var(--font-display);
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 700;
          letter-spacing: -0.01em;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose-legal p, .prose-legal li {
          font-family: var(--font-body);
          font-size: 16px;
          line-height: 1.65;
          color: var(--color-ink);
        }
        .prose-legal p { margin-bottom: 1rem; }
        .prose-legal ul { padding-left: 1.25rem; margin-bottom: 1rem; }
        .prose-legal li { margin-bottom: 0.4rem; }
        .prose-legal a { color: var(--color-blue-500); text-decoration: underline; }
        .prose-legal strong { font-weight: 600; }
      `}</style>
    </>
  );
}
