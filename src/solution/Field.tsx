import { Suspense, ComponentType, lazy } from "react";
import { useFormContext } from "react-hook-form";
import { useFieldEffects, useFieldOptions } from "./providers";
import { FieldConfig } from "./types";
import { getFieldErrorType } from "./utils";

const fieldMap: Record<string, ComponentType<FieldConfig>> = {
  select: lazy(() => import('../ui/SelectField/SelectField')),
  radio: lazy(() => import('../ui/RadioField/RadioField')),
  text: lazy(() => import('../ui/TextField/TextField')),
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

  const field = register(name, registerProps);
  const inputProps = {...fieldProps, ...field, id: name, options, type }

  const error = errors[name];
  const errorType = getFieldErrorType(error);

  const FieldComponent = fieldMap[type] || fieldMap.text;

  // temp
  if(!inputProps.visible === false) {
    return <input {...inputProps} type="hidden" />
  }

  return (
    <Suspense fallback={null}>
      <FieldComponent {...inputProps} error={errorType} />
    </Suspense>
  )
}