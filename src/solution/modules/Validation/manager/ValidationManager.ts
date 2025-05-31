import { ValidationFn, ValidationRuleConfig, ValidationToolbox } from "../types";
import { ValidationOperatorRegistry } from "./ValidationOperatorRegistry";

export interface ValidationManager {
  compile(rules: ValidationRuleConfig[]): Record<string, ValidationFn>;
  compileToSingleValidator(rules: ValidationRuleConfig[]): ValidationFn;
}

export class DefaultValidationManager implements ValidationManager {
  private readonly toolbox: ValidationToolbox;
  private readonly operators: ValidationOperatorRegistry;
  private readonly logger: Console;

  constructor(
    toolbox: ValidationToolbox,
    operators: ValidationOperatorRegistry,
    logger: Console = console,
  ) {
    this.toolbox = toolbox;
    this.operators = operators;
    console.log(this.operators);
    this.logger = logger;
  }

  public compile(rules: ValidationRuleConfig[]): Record<string, ValidationFn> {
    const result: Record<string, ValidationFn> = {};
    console.log(this);

    rules.forEach(([fn, params = {}]) => {
      const operator = this.operators.getOperator(fn);
      if (!operator) {
        result[fn] = () => true; // Default to a no-op function
        this.logger.warn(`ValidationManager: Unknown validate function: ${fn}`);
        return;
      }
      result[fn] = operator(this.toolbox, params);
    });
    return result;
  }

  public compileToSingleValidator(rules: ValidationRuleConfig[]): ValidationFn {
    const compiled = this.compile(rules);
    
    return (value: unknown): boolean | string | Promise<boolean | string> => {
      for (const [name, validator] of Object.entries(compiled)) {
        try {
        const result = validator(value);
        if (result !== true) {
          return result; // Return the first failure
        }
        } catch (error) {
          this.logger.error(`ValidationManager: Validation error in ${name}:`, error);
          return name; // Return the name of the failed validation
        }
      }
      return true; // All passed
    }
  }
}