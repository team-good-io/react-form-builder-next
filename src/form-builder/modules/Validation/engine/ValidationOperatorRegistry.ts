import { AvailabilityOperator, IsEmailOperator, MatchValueOperator, NotContainValueOperator, OneLetterOperator, OneNumberOperator, PatternOperator, RangeOperator } from "./operators";
import { ValidationOperator } from "../types";

export class ValidationOperatorRegistry {
  private registry: Map<string, ValidationOperator> = new Map();

  register(name: string, operator: ValidationOperator, override = false): void {
    if(!override && this.registry.has(name)) {
      console.error(`Operator with name "${name}" is already registered. Use 'override' to replace it.`);
      return;
    }
    this.registry.set(name, operator);
  }

  get(name: string): ValidationOperator | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }
}

export class DefaultValidationOperatorRegistry extends ValidationOperatorRegistry {
  constructor(customOperators: Record<string, ValidationOperator> = {}) {
    super();
    this.registerDefaults();
    this.registerCustomOperators(customOperators);
  }

  private registerDefaults(): void {
    this.register('email', new IsEmailOperator());
    this.register('matchValue', new MatchValueOperator());
    this.register('availability', new AvailabilityOperator());
    this.register('notContainValue', new NotContainValueOperator());
    this.register('oneLetter', new OneLetterOperator());
    this.register('oneNumber', new OneNumberOperator());
    this.register('pattern', new PatternOperator())
    this.register('range', new RangeOperator());
  }

  private registerCustomOperators(custom: Record<string, ValidationOperator>): void {
    for (const [name, operator] of Object.entries(custom)) {
      this.register(name, operator);
    }
  }
}
