import type {
  ValidationFactoryFn, ValidationFn, ValidationRuleConfig, ValidationToolbox,
} from '../types';

interface ValidationEngineResult {
  compile(rules: ValidationRuleConfig[]): Record<string, ValidationFn>;
}

export const createValidationEngine = (
  toolbox: ValidationToolbox,
  operators: Record<string, ValidationFactoryFn>,
): ValidationEngineResult => {
  const compile = (rules: ValidationRuleConfig[]): Record<string, ValidationFn> => {
    const result: Record<string, ValidationFn> = {};

    rules.forEach(([fn, params = {}]) => {
      const validationFn = operators[fn];
      if (!validationFn) {
        result[fn] = () => true; // Default to a no-op function
        console.error(`Unknown validate function: ${fn}`);
        return;
      }
      result[fn] = validationFn(toolbox, params);
    });
    return result;
  };

  return {
    compile,
  };
};
