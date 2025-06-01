export type OperatorFunction = (fieldValue: unknown, conditionValue: unknown) => boolean | Promise<boolean>;

function getLength(value: unknown): number | null {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length;
  }
  return null;
}

export const operators: Record<string, OperatorFunction> = {
  '===': (a = '', b) => a === b,
  '!==': (a = '', b) => a !== b,
  '>': (a, b) => typeof a === 'number' && a > (b as number),
  '<': (a, b) => typeof a === 'number' && a < (b as number),
  'in': (a, b) => Array.isArray(b) && b.includes(a),
  'length>': (a, b) => getLength(a) !== null && getLength(a)! > (b as number),
  'length<': (a, b) => getLength(a) !== null && getLength(a)! < (b as number),
  'length===': (a, b) => getLength(a) !== null && getLength(a)! === (b as number),
}