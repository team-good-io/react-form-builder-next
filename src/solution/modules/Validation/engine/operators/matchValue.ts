import { ValidationToolbox } from "../../types";

export function matchValue(
  value: unknown,
  params: Record<string, unknown>,
  toolbox: ValidationToolbox
)  {
  const fieldName = params.name as string;
  if (typeof fieldName !== 'string') {
    console.warn("Invalid parameter: 'name' must be a string");
    return true;
  }
  const fieldValue = toolbox.getValues()[fieldName];
  return value === fieldValue;
}