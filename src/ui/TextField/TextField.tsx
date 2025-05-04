import { forwardRef } from "react";
import { Field } from "../Field/Field";

interface TextFieldProps {
  error?: string;
}

const TextField = (
  props: TextFieldProps & React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const { error, ...inputProps } = props;
  return (
    <Field id={props.id} name={inputProps.name} error={error}>
      <input {...inputProps} ref={ref} />
    </Field>
  )
}

export default forwardRef<
  HTMLInputElement,
  TextFieldProps & React.InputHTMLAttributes<HTMLInputElement>
>(TextField)