import { forwardRef } from "react"
import { Field } from "../Field/Field"

interface PasswordFieldProps {
  error?: string
}

function PasswordField(
  props: PasswordFieldProps & React.InputHTMLAttributes<HTMLInputElement>,
  forwardRef: React.ForwardedRef<HTMLInputElement>
) {
  const { error, ...inputProps } = props;

  return (
    <Field id={inputProps.id} name={inputProps.name} error={error}>
      <input {...inputProps} ref={forwardRef} />
    </Field>
  )
}

export default forwardRef<
  HTMLInputElement, PasswordFieldProps &
  React.InputHTMLAttributes<HTMLInputElement>
>(PasswordField)