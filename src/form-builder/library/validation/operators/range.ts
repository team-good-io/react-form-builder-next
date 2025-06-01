export function range(value: unknown, params: Record<string, unknown>) {
  const { min, max } = params;
  if (typeof min !== 'number' || typeof max !== 'number') {
    console.warn("Invalid parameters: 'min' and 'max' must be numbers");
    return true;
  }
  if (typeof value === 'string') {
    return value.length >= min && value.length <= max;
  }
  if (typeof value === 'number') {
    return value >= min && value <= max;
  }
  return false;
}