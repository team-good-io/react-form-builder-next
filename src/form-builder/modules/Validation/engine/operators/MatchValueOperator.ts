import { ValidationOperator } from "../../types";
import { ValidationToolbox } from '../ValidationToolbox';

/**
 * MatchValueOperator operator checks if the value of a field matches the value of another field.
 * It is used to validate that two fields have the same value, such as password confirmation.
 */

export class MatchValueOperator implements ValidationOperator {
  create(toolbox: ValidationToolbox, params: Record<string, unknown>) {
    return (value: unknown) => {
      const fieldName = params.name as string;
      if (typeof fieldName !== 'string') {
        console.warn("Invalid parameter: 'name' must be a string");
        return true;
      }
      const fieldValue = toolbox.getFormValues()[fieldName];
      return value === fieldValue;
    }
  }
}
