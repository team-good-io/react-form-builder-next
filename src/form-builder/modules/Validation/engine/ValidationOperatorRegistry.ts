import { AvailabilityOperator, IsEmailOperator, MatchValueOperator, NotContainValueOperator, OneLetterOperator, OneNumberOperator, PatternOperator, RangeOperator } from "./operators";
import { ValidationOperator } from "../types";
import { Registry } from "../../core/Registry";

export class DefaultValidationOperatorRegistry extends Registry<ValidationOperator> {
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
