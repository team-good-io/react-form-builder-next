import { ValidationOperator } from "../../types";
import { ValidationToolbox } from "../ValidationToolbox";

/**
 * PatternOperator operator checks if the value matches a given regular expression pattern.
 */

export class PatternOperator implements ValidationOperator {
  create(_toolbox: ValidationToolbox, params: Record<string, unknown>) {
    return (value: unknown) => {
      const patternString = params.pattern as string;
      if (typeof patternString !== 'string') {
        console.warn("Invalid parameter: 'pattern' must be a string");
      }

      // Build the RegExp from string
      const regex = new RegExp(patternString);

      if (typeof value !== 'string') {
        return false;
      }

      return regex.test(value);
    };
  }
}