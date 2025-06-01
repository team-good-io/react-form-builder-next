export function oneNumber(value: unknown) {
  if (typeof value !== 'string') {
    return false;
  }
  return /\d/.test(value);
}