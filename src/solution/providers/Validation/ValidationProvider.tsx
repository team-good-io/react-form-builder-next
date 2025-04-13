import { JSX, useMemo } from "react";
import { ValidationContext } from "./ValidationContext";
import { createValidationEngine } from "./engine/createValidationEngine";
import { useFormContext } from "react-hook-form";
import { ValidationConfig } from "./types";

interface ValidationProviderProps {
  config: ValidationConfig;
  children: React.ReactNode;
}

export const ValidationProvider = ({ children}: ValidationProviderProps): JSX.Element => {
  const methods = useFormContext();
  const validation = useMemo(() => createValidationEngine(methods), [methods]);

  return (
    <ValidationContext.Provider value={validation}>
      {children}
      </ValidationContext.Provider>
  )
}