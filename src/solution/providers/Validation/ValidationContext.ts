import { createContext } from "react";
import { ValidationFn, ValidationRuleConfig } from "./types";

export type ValidationContextProps = {
  compileValidations: (rules: ValidationRuleConfig[]) => Record<string, ValidationFn>;
}

export const ValidationContext = createContext<ValidationContextProps>({
  compileValidations: () => ({}),
});