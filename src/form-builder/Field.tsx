import { Suspense, ComponentType, lazy } from "react";
import { useFormContext } from "react-hook-form";
import { FieldConfig } from "./types";
import { getFieldErrorType } from "./utils";
import { ValidationCheckList } from "./components/ValidationCheckList";
import { useResolvedFieldConfig } from "./hooks/useResolvedFieldConfig";

const fieldMap: Record<string, ComponentType<FieldConfig & {error?: string}>> = {
  select: lazy(() => import('../ui/SelectField/SelectField')),
  radio: lazy(() => import('../ui/RadioField/RadioField')),
  text: lazy(() => import('../ui/TextField/TextField')),
  password: lazy(() => import('../ui/PasswordField/PasswordField')),
};

export function Field(props: FieldConfig) {
  const {type, name } = props;
  const { formState: { errors } } = useFormContext();
  const { inputProps, validate} = useResolvedFieldConfig(props)

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