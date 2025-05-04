export function oneLetter(value: unknown) {
  if (typeof value !== 'string') {
    return false;
  }
  return /[a-zA-Z]/.test(value);
}