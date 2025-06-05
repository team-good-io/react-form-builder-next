
import { useFormContext } from "react-hook-form";
import { FieldConfig } from "../types";
import { useFieldOptions } from "../modules/Options";
import { useFieldEffects } from "../modules/Effects";
import { useValidation } from "../modules/Validation";

export function useResolvedFieldConfig(config: FieldConfig) {
  const { name, options: baseOptions = [], fieldProps: baseFieldProps = {}, registerProps: baseRegisterProps = {} } = config;
  const { register } = useFormContext();

  const fieldOptions = useFieldOptions(name);
  const fieldEffects = useFieldEffects(name);

  const options = fieldEffects.options?.data || [...baseOptions, ...(fieldOptions.data || [])];
  const fieldProps = { ...baseFieldProps, ...(fieldEffects.fieldProps || {}) };
  const registerProps = { ...baseRegisterProps, ...(fieldEffects.registerProps || {}) };

  const validate = useValidation(Array.isArray(registerProps.validate) ? registerProps.validate : []);
  const field = register(name, { ...registerProps, validate });

  const inputProps = { ...fieldProps, ...field, id: name, options, type: config.type };

  return {
    inputProps,
    validate,
  };
}
