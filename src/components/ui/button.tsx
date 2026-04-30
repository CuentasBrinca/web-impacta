import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost-dark" | "ghost-light" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "relative overflow-hidden inline-flex items-center justify-center gap-2 " +
  "font-[var(--font-body)] font-semibold rounded-full border whitespace-nowrap " +
  "transition-all duration-200 ease-[var(--ease-standard)] cursor-pointer";

const sizes: Record<Size, string> = {
  sm: "px-[18px] py-[10px] text-[13px]",
  md: "px-6 py-[14px] text-[15px]",
  lg: "px-[30px] py-4 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-blue-500 text-white border-transparent " +
    "hover:bg-blue-400 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,255,0.35)]",
  "ghost-dark":
    "bg-transparent text-white border-white/35 " +
    "hover:bg-white/10 hover:border-white",
  "ghost-light":
    "bg-transparent text-ink border-ink " +
    "hover:bg-ink hover:text-white",
  inverse:
    "bg-white text-ink border-white " +
    "hover:bg-paper-soft hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,255,255,0.18)]",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, sizes[size], variants[variant], className)} {...rest} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn(base, sizes[size], variants[variant], "no-underline", className)} {...rest} />;
}
