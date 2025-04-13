import { useMemo } from "react";
import { ValidationRuleConfig } from "../types";
import { useValidationContext } from "./useValidationContext";

export function useValidation(rules: ValidationRuleConfig[]) {
  const context = useValidationContext();
  const { compileValidations } = context;

  const compiledValidations = useMemo(() => compileValidations(rules), [compileValidations, rules]);

  return compiledValidations;
}