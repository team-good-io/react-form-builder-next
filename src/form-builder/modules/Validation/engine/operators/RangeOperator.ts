import { ValidationOperator } from "../../types";
import { ValidationToolbox } from "../ValidationToolbox";

/**
 * RangeOperator operator checks if the value is within a specified range.
 */

export class RangeOperator implements ValidationOperator {
  create(_toolbox: ValidationToolbox, params: Record<string, unknown>) {
    return (value: unknown) => {
      const { min, max } = params;
      if (typeof min !== 'number' || typeof max !== 'number') {
        console.warn("Invalid parameters: 'min' and 'max' must be numbers");
        return true;
      }
      if (typeof value === 'string') {
        return value.length >= min && value.length <= max;
      }
      if (typeof value === 'number') {
        return value >= min && value <= max;
      }
      return false;
    };
  }
}