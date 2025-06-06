import { ValidationOperator } from "../../types";

/**
 * IsEmailOperator operator checks if the value is a valid email address.
 */

export class IsEmailOperator implements ValidationOperator {
  create() {
    return (value: unknown) => {
      // Implementation for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof value === 'string' && emailRegex.test(value);
    };
  }
}