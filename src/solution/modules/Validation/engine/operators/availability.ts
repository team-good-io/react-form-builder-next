import { getAvailability } from "../../../../api/getAvailability";
import { debounce } from "../../../../utils";

const availabilityCache = new Map<string, boolean | string>();

const fetchAvailability = async (value: string, type: string): Promise<boolean | string> => {
  try {
    const response = await getAvailability({ type, value });
    availabilityCache.set(`${type}:${value}`, response);
    return response;
  } catch (err) {
    console.warn("fetchAvailability: Availability check failed", err);
    return true;
  }
}

const debouncedFetchAvailability = debounce(fetchAvailability, 500);

export function availability(value: unknown, params: Record<string, unknown>): boolean | string | Promise<boolean | string> {
  if (typeof value !== 'string' || typeof params.type !== 'string') {
    return true;
  }

  const cacheKey = `${params.type}:${value}`;
  const cached = availabilityCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  return debouncedFetchAvailability(value, params.type);
}