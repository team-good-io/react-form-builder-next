import { ValidationToolbox } from "./ValidationToolbox";
import { ValidationOperatorRegistry } from "./ValidationOperatorRegistry";
import { ValidationRule, ValidatorFn } from "../types";

/**
 * The `ValidationEngine` is a core component of the validation system.
 * It’s responsible for compiling declarative validation rules into executable functions.
 * It uses a registry of validation operators to resolve each rule into a specific validator function.
 */

interface ValidationEngine {
  compile(rules: ValidationRule[]): Record<string, ValidatorFn>;
  compileToSingleValidator(rules: ValidationRule[]): ValidatorFn;
}

export class DefaultValidationEngine implements ValidationEngine {
  private readonly toolbox: ValidationToolbox;

  private readonly operatorRegistry: ValidationOperatorRegistry;

  private readonly logger: Console;

  constructor(
    toolbox: ValidationToolbox,
    operatorRegistry: ValidationOperatorRegistry,
    logger: Console = console,
  ) {
    this.toolbox = toolbox;
    this.operatorRegistry = operatorRegistry;
    this.logger = logger;
  }

  /**
   * Compiles an array of validation rules into a map of validation functions,
   * where each key corresponds to the rule name.
   */

  public compile(rules: ValidationRule[]): Record<string, ValidatorFn> {
    const result: Record<string, ValidatorFn> = {};

    rules.forEach(([fn, params = {}]) => {
      const action = this.operatorRegistry.get(fn);
      if (!action) {
        result[fn] = () => true; // Default to a no-op function
        this.logger.warn(`ValidationEngine: Unknown validate function: ${fn}`);
        return;
      }
      result[fn] = action.create(this.toolbox, params);
    });

    return result;
  }

  /**
   * Compiles a single validation function that runs all provided rules in order,
   * stopping at the first failing rule.
   */

  public compileToSingleValidator(rules: ValidationRule[]): ValidatorFn {
    const compiled = this.compile(rules);

    return (value: unknown): boolean | string | Promise<boolean | string> => {
      for (const [name, validator] of Object.entries(compiled)) {
        try {
          const result = validator(value);
          if (result !== true) {
            return result; // Return the first failure
          }
        } catch (error) {
          this.logger.error(`ValidationEngine: Validation error in ${name}:`, error);
          return name; // Return the name of the failed validation
        }
      }

      return true; // All passed
    }
  }
}