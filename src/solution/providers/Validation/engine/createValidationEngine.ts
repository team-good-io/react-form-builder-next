import { debounce } from "../../../utils";
import { ValidationFactory, ValidationFn, ValidationRuleConfig } from "../types"

interface ValidationToolbox {
  getValues: () => Record<string, unknown>
}

export function createValidationEngine(
  toolbox: ValidationToolbox,
) {
  const validationRegistry: Record<string, ValidationFactory> = {
    email: () => (value: unknown) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    emailAvailability: () => {
      const checkEmail = async (value: unknown): Promise<boolean> => {
        const email = value as string;
        if (typeof email !== 'string') {
          console.warn("Invalid email format");
          return false;
        }

        try {
          // Simulate an API call to check email availability
          const response = await fetch('/api/check-email.json')
          const data = await response.json()
          return data?.isAvailable ?? false;
        } catch (e) {
          console.error("Error checking email availability", e);
          return false;
        }
      }

      return debounce(checkEmail, 500);
    },
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
    pattern: (params: Record<string, unknown>) => {
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
    console.log(rules);
    rules.forEach(([fn, params = {}]) => {
      const validationFn = validationRegistry[fn];
      if (validationFn) {
        result[fn] = validationFn(params);
      } else {
        console.warn(`Unknown validate function: ${fn}`);
      }
    });

    return result;
  }

  return {
    compileValidations,
  }
}