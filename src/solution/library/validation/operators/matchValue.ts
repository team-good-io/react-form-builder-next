export function matchValue(
  value: unknown,
  params: Record<string, unknown>,
  { getValues }: { getValues: () => Record<string, unknown> }
)  {
  const fieldName = params.name as string;
  if (typeof fieldName !== 'string') {
    console.warn("Invalid parameter: 'name' must be a string");
    return true;
  }
  const fieldValue = getValues()[fieldName];
  return value === fieldValue;
}