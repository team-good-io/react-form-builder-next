import { forwardRef, JSX } from "react";
import { Field } from "../Field/Field";

interface SelectFieldProps {
  error?: string;
  options?: Array<{ value: string | number | boolean; label: string }>;
}

function SelectField(
  props: SelectFieldProps & React.SelectHTMLAttributes<HTMLSelectElement>,
  ref: React.ForwardedRef<HTMLSelectElement>
): JSX.Element {
  const { error, options, ...selectProps } = props;

  return (
    <Field id={selectProps.id} name={selectProps.name} error={error}>
      <select {...selectProps} ref={ref}>
        <option></option>
        {options?.map(({ label, value }) => (
          <option key={value.toString()} value={value.toString()}>
            {label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export default forwardRef<
  HTMLSelectElement, SelectFieldProps &
  React.SelectHTMLAttributes<HTMLSelectElement>
>(SelectField)