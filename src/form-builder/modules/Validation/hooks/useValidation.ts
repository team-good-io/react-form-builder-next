import { useMemo } from "react";
import { ValidationRuleConfig } from "../types";
import { useValidationContext } from "./useValidationContext";

export function useValidation(rules: ValidationRuleConfig[]) {
  const context = useValidationContext();
  const { compile } = context;

  const compiledValidations = useMemo(() => compile(rules), [compile, rules]);

  return compiledValidations;
}