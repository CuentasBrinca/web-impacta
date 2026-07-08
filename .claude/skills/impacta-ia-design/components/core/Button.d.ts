import * as React from "react";

/**
 * Primary call-to-action button for Impacta IA.
 *
 * @startingPoint section="Core" subtitle="Pill CTA in the four brand variants" viewport="700x150"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Append a → arrow glyph. @default false */
  arrow?: boolean;
  disabled?: boolean;
  /** Render as another element, e.g. "a". @default "button" */
  as?: keyof JSX.IntrinsicElements;
}

export function Button(props: ButtonProps): JSX.Element;
