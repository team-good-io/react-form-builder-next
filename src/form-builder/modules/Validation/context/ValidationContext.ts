import { createContext } from "react";
import { ValidatorFn, ValidationRule } from "../types";

export type ValidationContextProps = {
  compile: (rules: ValidationRule[]) => Record<string, ValidatorFn>;
}

export const ValidationContext = createContext<ValidationContextProps>({
  compile: () => ({}),
});