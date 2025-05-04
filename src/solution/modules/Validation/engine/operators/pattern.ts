export function pattern(value: unknown, params: Record<string, unknown>) {
  const patternString = params.pattern as string;
  if (typeof patternString !== 'string') {
    console.warn("Invalid parameter: 'pattern' must be a string");
  }

  // Build the RegExp from string
  const regex = new RegExp(patternString);

  if (typeof value !== 'string') {
    return false;
  }

  return regex.test(value);
}