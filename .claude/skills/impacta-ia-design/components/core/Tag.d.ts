import * as React from "react";

/**
 * Small pill chip: country/track labels and metadata.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Accent tone. @default "neutral" */
  tone?: "neutral" | "pink" | "teal" | "blue";
  /** Filled instead of tinted outline. @default false */
  solid?: boolean;
}

export function Tag(props: TagProps): JSX.Element;
