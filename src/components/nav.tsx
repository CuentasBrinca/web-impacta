"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { navItems } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between",
        "transition-all duration-200 ease-[var(--ease-standard)]",
        scrolled
          ? "px-8 py-3 bg-night/85 backdrop-blur-xl border-b border-white/10"
          : "px-8 py-5 bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <a href="#top" className="flex items-center gap-2.5 no-underline" aria-label="Impacta IA Chile · Inicio">
        <Image
          src="/img/logo-horizontal-white.png"
          alt="Impacta IA Chile"
          width={140}
          height={28}
          priority
          className="h-7 w-auto"
        />
      </a>

      <div className="hidden md:flex items-center gap-7">
        {navItems.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className="text-white/80 text-sm font-medium no-underline transition-colors duration-150 hover:text-white relative nav-link-anim"
          >
            {it.label}
          </a>
        ))}
        <ButtonLink href="#form" variant="inverse" size="sm">
          Quiero participar →
        </ButtonLink>
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden">
        <ButtonLink href="#form" variant="inverse" size="sm">
          Participar →
        </ButtonLink>
      </div>

      <style jsx>{`
        .nav-link-anim::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 360ms cubic-bezier(0.2, 0, 0, 1);
        }
        .nav-link-anim:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}</style>
    </nav>
  );
}
