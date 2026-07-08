import * as React from "react";

/** Oversized statistic with caption (context + organizer sections). */
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The number/headline, e.g. "37%" or "+15". */
  value: React.ReactNode;
  /** Supporting caption. */
  label: React.ReactNode;
  /** Number color. @default "pink" */
  accent?: "pink" | "teal" | "blue" | "white";
}

export function Stat(props: StatProps): JSX.Element;
