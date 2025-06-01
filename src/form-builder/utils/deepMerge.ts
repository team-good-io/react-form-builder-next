import { isObject } from "./isObject";

/**
 * Deep merge two objects
 * - Arrays are replaced, not merged (can be adjusted)
 */
export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(target: T, source: U): T & U {
  if (!isObject(target) || !isObject(source)) {
    return source as T & U;
  }

  const result: Record<string, unknown> = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }

  return result as T & U;
}
