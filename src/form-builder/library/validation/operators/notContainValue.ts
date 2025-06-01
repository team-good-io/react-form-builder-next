export function notContainValue(
  value: unknown,
  params: Record<string, unknown>,
  { getValues }: { getValues: () => Record<string, unknown> }
) {
  if (typeof value !== 'string') {
    return false;
  }

  const { fields } = params;
  if (!Array.isArray(fields)) {
    console.warn("Invalid parameter: 'fields' must be an array");
    return true;
  }

  const formValues = getValues();

  return fields.every((fieldName) => {
    const fieldValue = formValues[fieldName];
    if (typeof fieldValue !== 'string' || fieldValue.length === 0) {
      return true; // skip empty or non-string fields
    }
    return !value.includes(fieldValue);
  });
}