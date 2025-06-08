import { CommandFactory, EffectAction } from "../types";
import { SetValueCommand, ClearErrorsCommand, DeduplicateOptionsCommand, HideFieldCommand, ResetFieldCommand, SetFieldPropsCommand, SetRegisterPropsCommand, ShowFieldCommand } from "./actions";
import { EffectsToolbox } from "./EffectsToolbox";

export class EffectsActionsRegistry {
  private registry: Map<string, CommandFactory> = new Map();

  register(name: string, fn: CommandFactory, override = false): void {
    if (!override && this.registry.has(name)) {
      console.error(`EffectAction "${name}" already registered. Use 'override' to replace.`);
      return;
    }
    this.registry.set(name, fn);
  }

  get(name: string): CommandFactory | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }
}

export class DefaultEffectsActionsRegistry extends EffectsActionsRegistry {
  constructor(customActions: Record<string, CommandFactory> = {}) {
    super();
    this.registerDefaults();
    this.registerCustomActions(customActions);
  }

  private registerDefaults(): void {
    this.register("setValue", (toolbox, action) => new SetValueCommand(toolbox, action));
    this.register("resetField", (toolbox, action) => new ResetFieldCommand(toolbox, action));
    this.register("clearErrors", (toolbox, action) => new ClearErrorsCommand(toolbox, action));
    this.register("setFieldProps", (toolbox, action) => new SetFieldPropsCommand(toolbox, action));
    this.register("setRegisterProps", (toolbox, action) => new SetRegisterPropsCommand(toolbox, action));
    this.register("showField", (toolbox, action) => new ShowFieldCommand(toolbox, action));
    this.register("hideField", (toolbox, action) => new HideFieldCommand(toolbox, action));
    this.register("deduplicateOptions", (toolbox, action) => new DeduplicateOptionsCommand(toolbox, action));
  }

  private registerCustomActions(custom: Record<string, CommandFactory>): void {
    for (const [name, fn] of Object.entries(custom)) {
      this.register(name, fn);
    }
  }
}