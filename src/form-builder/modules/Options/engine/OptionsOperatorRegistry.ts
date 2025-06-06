import { OptionsOperator } from "../types";
import { RemoteDynamicOperator } from "./operators/RemoteDynamicOperator";
import { RemoteOperator } from "./operators/RemoteOperator";
import { StaticOperator } from "./operators/StaticOperator";

export class OptionsOperatorRegistry {
  private registry: Map<string, OptionsOperator> = new Map();

  register(name: string, operator: OptionsOperator, override = false): void {
    if (!override && this.registry.has(name)) {
      console.error(`Operator with name "${name}" is already registered. Use 'override' to replace it.`);
      return;
    }
    this.registry.set(name, operator);
  }

  get(name: string): OptionsOperator | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }
}

export class DefaultOptionsOperatorRegistry extends OptionsOperatorRegistry {
  constructor(customOperators: Record<string, OptionsOperator> = {}) {
    super();
    this.registerDefaults();
    this.registerCustomOperators(customOperators);
  }

  private registerDefaults(): void {
    this.register('static', new StaticOperator());
    this.register('remote', new RemoteOperator());
    this.register('remote-dynamic', new RemoteDynamicOperator())
  }

  private registerCustomOperators(custom: Record<string, OptionsOperator>): void {
    for (const [name, operator] of Object.entries(custom)) {
      this.register(name, operator);
    }
  }
}