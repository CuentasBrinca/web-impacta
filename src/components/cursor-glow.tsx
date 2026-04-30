"use client";

import { useEffect, useRef } from "react";

/**
 * Soft blue glow that trails the mouse on dark sections.
 * Pure DOM/RAF — no React state. Disabled on touch devices.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(hover: none)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = -200;
    let ty = -200;
    let x = -200;
    let y = -200;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none z-[1] -ml-60 -mt-60"
      style={{
        width: 480,
        height: 480,
        background: "radial-gradient(circle, rgba(0,0,255,0.10) 0%, rgba(0,0,255,0) 60%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
