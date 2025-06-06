import availabilityService from "../../../../services/availability/AvailabilityService";
import { ValidationOperator } from "../../types";
import { ValidationToolbox } from '../ValidationToolbox';

/**
 * AvailabilityOperator checks if the value is available based on a specific type.
 * It is used to validate that a value (like a username or email) is not already taken.
 */

export class AvailabilityOperator implements ValidationOperator {
  create(_toolbox: ValidationToolbox, params: Record<string, unknown>) {
    return (value: unknown) => {
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
      return availabilityService.fetch(params.type, value);
    }
  }
}