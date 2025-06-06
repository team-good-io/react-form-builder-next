import { ValidationOperator } from "../../types";

/**
 * OneNumberOperator operator checks if the value is a number that contains at least one digit.
 */

export class OneNumberOperator implements ValidationOperator {
  create() {
    return (value: unknown) => {
      if (typeof value !== 'number' || typeof value !== 'string') {
        return false;
      }
      return /\d/.test(value);
    };
  }
}