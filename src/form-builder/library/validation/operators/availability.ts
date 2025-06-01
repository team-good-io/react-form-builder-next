import availabilityService from "../../../services/availability/AvailabilityService";

export const availability = async (value: unknown, params: Record<string, unknown>) => {
  if (typeof value !== 'string' || typeof params.type !== 'string') {
      // Invalid input; skip validation
      return true;
    }

    // Check cache first
    const cached = availabilityService.getCached(params.type, value);
    if (cached !== undefined) {
      return cached;
    }

    // Fetch from service (and cache the result)
    return await availabilityService.fetch(params.type, value);
}