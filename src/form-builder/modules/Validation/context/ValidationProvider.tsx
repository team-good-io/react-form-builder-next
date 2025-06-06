import { useMemo } from "react";
import { ValidationContext, ValidationContextProps } from "./ValidationContext";
import { useFormContext } from "react-hook-form";
import { DefaultValidationToolbox } from "../engine/ValidationToolbox";
import { DefaultValidationEngine } from "../engine/ValidationEngine";
import { ValidationOperator } from "../types";
import { DefaultValidationOperatorRegistry } from "../engine/ValidationOperatorRegistry";

interface ValidationProviderProps {
  customOperators: Record<string, ValidationOperator>;
  children: React.ReactNode;
}

export function ValidationProvider({ children, customOperators }: ValidationProviderProps) {
  const { getValues } = useFormContext();
  const toolbox = useMemo(() => new DefaultValidationToolbox(getValues), [getValues])
  const operators = useMemo(() => new DefaultValidationOperatorRegistry(customOperators), [customOperators]);
  const engine = useMemo(() => new DefaultValidationEngine(toolbox, operators), [toolbox, operators]);

  const ctxValue: ValidationContextProps = useMemo(() => ({
    compile: (rules) => engine.compile(rules),
  }), [engine]);

  return (
    <ValidationContext.Provider value={ctxValue}>
      {children}
    </ValidationContext.Provider>
  )
}