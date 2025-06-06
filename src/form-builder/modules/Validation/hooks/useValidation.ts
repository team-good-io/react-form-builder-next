import { useMemo } from "react";
import { ValidationRule } from "../types";
import { useValidationContext } from "./useValidationContext";

export function useValidation(rules: ValidationRule[]) {
  const context = useValidationContext();
  const { compile } = context;

  const compiledValidations = useMemo(() => compile(rules), [compile, rules]);

  return compiledValidations;
}