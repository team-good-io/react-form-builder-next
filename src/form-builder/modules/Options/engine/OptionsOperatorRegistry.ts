import { Registry } from "../../core/Registry";
import { OptionsCommandFactory } from "../types";
import { RemoteCommand, RemoteDynamicCommand, StaticCommand } from "./operators";

export class DefaultOptionsOperatorRegistry extends Registry<OptionsCommandFactory> {
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