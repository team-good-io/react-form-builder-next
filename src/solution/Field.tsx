import { Suspense, ComponentType, lazy } from "react";
import { useFormContext } from "react-hook-form";
import { FieldConfig } from "./types";
import { getFieldErrorType } from "./utils";
import { ValidationCheckList } from "./components/ValidationCheckList";
import { useValidation } from "./modules/Validation";
import { useFieldOptions } from "./modules/Options";
import { useFieldEffects } from "./modules/Effects";

const fieldMap: Record<string, ComponentType<FieldConfig & {error?: string}>> = {
  select: lazy(() => import('../ui/SelectField/SelectField')),
  radio: lazy(() => import('../ui/RadioField/RadioField')),
  text: lazy(() => import('../ui/TextField/TextField')),
  password: lazy(() => import('../ui/PasswordField/PasswordField')),
};

export function Field({
  type,
  name,
  options: baseOptions = [],
  fieldProps: baseFieldProps = {},
  registerProps: baseRegisterProps = {},
}: FieldConfig) {
  const { register, formState: { errors } } = useFormContext();
  const fieldOptions = useFieldOptions(name);
  const fieldEffects = useFieldEffects(name);

  const options = fieldEffects.options?.data || [...baseOptions, ...(fieldOptions.data || [])];
  const fieldProps = { ...baseFieldProps, ...(fieldEffects.fieldProps || {}) }
  const registerProps = { ...baseRegisterProps, ...(fieldEffects.registerProps || {}) }

  const validate = useValidation(Array.isArray(registerProps.validate) ? registerProps.validate : []);

  const field = register(name, { ...registerProps, validate });
  const inputProps = { ...fieldProps, ...field, id: name, options, type }

  const error = errors[name];
  const errorType = getFieldErrorType(error);

  const FieldComponent = fieldMap[type] || fieldMap.text;

  // temp
  if (inputProps.hidden) {
    return <input {...inputProps} type="hidden" />
  }

  if(type === 'password' && fieldProps.showValidationCheckList) {
    return (
      <Suspense fallback={null}>
        <div>
          <FieldComponent {...inputProps} error={errorType} />
          <ValidationCheckList name={name} validate={validate} />
        </div>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={null}>
      <FieldComponent {...inputProps} error={errorType} />
    </Suspense>
  )
}