import { createContext } from "react";
import { ValidationFn, ValidationRuleConfig } from "../types";

export type ValidationContextProps = {
  compile: (rules: ValidationRuleConfig[]) => Record<string, ValidationFn>;
}

export const ValidationContext = createContext<ValidationContextProps>({
  compile: () => ({}),
});