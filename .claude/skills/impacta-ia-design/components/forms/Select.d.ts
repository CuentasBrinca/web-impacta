import * as React from "react";

/** Native select with custom chevron, matching Input styling. */
export interface SelectOption { value: string; label: string; }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  required?: boolean;
  /** Options as strings or {value,label}. */
  options?: (string | SelectOption)[];
  placeholder?: string;
}

export function Select(props: SelectProps): JSX.Element;
