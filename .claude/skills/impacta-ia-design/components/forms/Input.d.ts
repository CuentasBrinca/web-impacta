import * as React from "react";

/** Text input with label + magenta focus ring (pre-registration form). */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
}

export function Input(props: InputProps): JSX.Element;
