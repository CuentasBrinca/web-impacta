import * as React from "react";

/** Custom checkbox with rich label (consent line, participation toggles). */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  children: React.ReactNode;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
