import { ValidationOperator } from "../../types";
import { ValidationToolbox } from '../ValidationToolbox';

/**
 * NotContainValueOperator checks if the value of a field does not contain 
 * the values of other specified fields.
 */

export class NotContainValueOperator implements ValidationOperator {
  create(toolbox: ValidationToolbox, params: Record<string, unknown>) {
    return (value: unknown) => {
      if (typeof value !== 'string') {
        return false;
      }

      const { fields } = params;
      if (!Array.isArray(fields)) {
        console.warn("Invalid parameter: 'fields' must be an array");
        return true;
      }

      const formValues = toolbox.getValues();

      return fields.every((fieldName) => {
        const fieldValue = formValues[fieldName];
        if (typeof fieldValue !== 'string' || fieldValue.length === 0) {
          return true; // skip empty or non-string fields
        }
        return !value.includes(fieldValue);
      });
    }
  }
}
