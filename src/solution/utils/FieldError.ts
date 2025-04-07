import { FieldError } from "react-hook-form";

export function getFieldErrorType(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;

  if ('type' in error && typeof (error as FieldError).type === 'string') {
    return (error as FieldError).type;
  }

  return undefined;
}