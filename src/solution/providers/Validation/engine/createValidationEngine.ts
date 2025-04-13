import { ValidationFactory, ValidationFn, ValidationRuleConfig } from "../types"

interface ValidationToolbox {
  getValues: () => Record<string, unknown>
}

export function createValidationEngine(
  toolbox: ValidationToolbox,
) {
  const validationRegistry: Record<string, ValidationFactory> = {
    email: () => (value: unknown) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    matchValue: (params: Record<string, unknown>) => (value: unknown) => {
      const fieldName = params.name as string;
      if (typeof fieldName !== 'string') {
        console.warn("Invalid parameter: 'name' must be a string");
        return true;
      }
      const fieldValue = toolbox.getValues()[fieldName];
      return value === fieldValue;
    },
    range: (params: Record<string, unknown>) => (value: unknown) => {
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
    },
    oneNumber: () => (value: unknown) => {
      if (typeof value !== 'string') {
        return false;
      }
      return /\d/.test(value);
    },
    oneLetter: () => (value: unknown) => {
      if (typeof value !== 'string') {
        return false;
      }
      return /[a-zA-Z]/.test(value);
    },
    notContainValue: (params: Record<string, unknown>) => (value: unknown) => {
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
    },
    pattern: (params: Record<string, unknown>) =>  {
      const patternString = params.pattern as string;
      if (typeof patternString !== 'string') {
        console.warn("Invalid parameter: 'pattern' must be a string");
      }
    
      // Build the RegExp from string
      const regex = new RegExp(patternString);
    
      return (value: unknown) => {
        if (typeof value !== 'string') {
          return false;
        }
        return regex.test(value);
      };
    },
  }

  const compileValidations = (rules: ValidationRuleConfig[]) => {
    const result: Record<string, ValidationFn> = {};

    rules.forEach((rule) => {
      if (typeof rule === 'string') {
        const validationFn = validationRegistry[rule];
        if (validationFn) {
          result[rule] = validationFn({});
        } else {
          console.warn(`Unknown validate function: ${rule}`);
        }
      } else if (typeof rule === 'object' && rule.fn) {
        const validationFn = validationRegistry[rule.fn];
        if (validationFn) {
          result[rule.fn] = validationFn(rule.params);
        } else {
          console.warn(`Unknown validate function: ${rule.fn}`);
        }
      }
    });

    return result;
  }

  return {
    compileValidations,
  }
}