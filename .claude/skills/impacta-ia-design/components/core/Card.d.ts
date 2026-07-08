import * as React from "react";

/**
 * Dark surface panel — base for eje / speaker / format / audience cards.
 *
 * @startingPoint section="Core" subtitle="Dark surface card with hover lift + accent bar" viewport="700x220"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Lift + brighten border on hover. @default false */
  hover?: boolean;
  /** Colored top bar. @default null */
  accent?: null | "pink" | "teal" | "blue";
  /** CSS padding. @default var(--space-6) */
  padding?: string;
}

export function Card(props: CardProps): JSX.Element;
