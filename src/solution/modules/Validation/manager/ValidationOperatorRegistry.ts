import { ValidationFactoryFn } from "../types";

export interface ValidationOperatorRegistry {
  register(name: string, factory: ValidationFactoryFn): void;
  unregister(name: string): void;
  getOperator(name: string): ValidationFactoryFn | undefined;
  getAll(): Record<string, ValidationFactoryFn>;
}

export class DefaultValidationOperatorRegistry implements ValidationOperatorRegistry {
  private operators: Map<string, ValidationFactoryFn> = new Map();

  constructor(initialOperators: Record<string, ValidationFactoryFn> = {}) {
    Object.entries(initialOperators).forEach(([name, factory]) =>
      this.operators.set(name, factory)
    );
  }

  public register(name: string, factory: ValidationFactoryFn) {
    this.operators.set(name, factory);
  }

  public unregister(name: string) {
    this.operators.delete(name);
  }

  public getOperator(name: string): ValidationFactoryFn | undefined {
    return this.operators.get(name);
  }

  public getAll(): Record<string, ValidationFactoryFn> {
    return Object.fromEntries(this.operators.entries());
  }
}