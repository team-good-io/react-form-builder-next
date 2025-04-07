import { forwardRef } from "react";
import { Field } from "../Field/Field";

interface RadioFieldProps {
  error?: string;
  options?: Array<{ value: string | number | boolean; label: string }>;
}

function RadioField(
  props: RadioFieldProps & React.InputHTMLAttributes<HTMLInputElement>,
  forwardRef: React.ForwardedRef<HTMLInputElement>
): React.ReactNode {
  const { error, options, ...inputProps } = props;
  return (
    <Field id={inputProps.id} name={inputProps.name} error={error}>
      {options?.map(({ label, value }) => (
        <label key={value.toString()}>
          <input
            type="radio"
            value={value.toString()}
            {...inputProps}
            id={`${inputProps.id}_${value}`}
            ref={forwardRef}
          />
          {label}
        </label>
      ))}
    </Field>
  )
}

export default forwardRef<
  HTMLInputElement, RadioFieldProps &
  React.InputHTMLAttributes<HTMLInputElement>
>(RadioField)