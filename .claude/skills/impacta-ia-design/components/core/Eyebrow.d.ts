import * as React from "react";

/** Uppercase eyebrow label above section titles. */
export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Magenta text + leading rule. Set false for muted neutral. @default true */
  accent?: boolean;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;
