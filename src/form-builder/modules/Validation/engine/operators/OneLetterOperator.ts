import { ValidationOperator } from "../../types";

/**
 * OneLetterOperator operator checks if the value is a string that contains at least one letter.
 */

export class OneLetterOperator implements ValidationOperator {
  create() {
    return (value: unknown) => {
      if (typeof value !== 'string') {
        return false;
      }
      return /[a-zA-Z]/.test(value);
    };
  }
}