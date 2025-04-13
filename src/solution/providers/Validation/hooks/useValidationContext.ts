import { useContext } from "react";
import { ValidationContext } from "../ValidationContext";

export function useValidationContext() {
  const context = useContext(ValidationContext);

  if (!context) {
    console.warn('useValidationContext must be used within a ValidationProvider');
  }

  return context;
}