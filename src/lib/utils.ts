/** Conditional className join. Lightweight; avoids pulling in clsx/twmerge. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
