
export function getFieldErrorType(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;

  if('message' in error && typeof error.message === 'string' && error.message.length) {
    return error.message;
  }

  if ('type' in error && typeof error.type === 'string') {
    return error.type;
  }

  return undefined;
}