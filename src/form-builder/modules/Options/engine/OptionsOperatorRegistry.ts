import { OptionsCommandFactory } from "../types";
import { RemoteCommand, RemoteDynamicCommand, StaticCommand } from "./operators";


export class OptionsOperatorRegistry {
  private registry: Map<string, OptionsCommandFactory> = new Map();

  register(name: string, operator: OptionsCommandFactory, override = false): void {
    if (!override && this.registry.has(name)) {
      console.error(`Operator with name "${name}" is already registered. Use 'override' to replace it.`);
      return;
    }
    this.registry.set(name, operator);
  }

  get(name: string): OptionsCommandFactory | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }
}

export class DefaultOptionsOperatorRegistry extends OptionsOperatorRegistry {
  constructor(customOperators: Record<string, OptionsCommandFactory> = {}) {
    super();
    this.registerDefaults();
    this.registerCustomOperators(customOperators);
  }

  private registerDefaults(): void {
    this.register('static', (sourceName, _values, config, toolbox) => new StaticCommand(sourceName, config, toolbox));
    this.register('remote', (sourceName, _values, config, toolbox) => new RemoteCommand(sourceName, config, toolbox));
    this.register('remote-dynamic', (sourceName, values, config, toolbox) => new RemoteDynamicCommand(sourceName, values, config, toolbox));
  }

  private registerCustomOperators(custom: Record<string, OptionsCommandFactory>): void {
    for (const [name, operator] of Object.entries(custom)) {
      this.register(name, operator);
    }
  }
}