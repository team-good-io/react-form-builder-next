import { EffectOperator } from "../types";
import { SetValueOperator, ClearErrorsOperator, DeduplicateOptionsOperator, HideFieldOperator, ResetFieldOperator, SetFieldPropsOperator, SetRegisterPropsOperator, ShowFieldOperator } from "./actions";
import { EffectsToolbox } from "./EffectsToolbox";

export class EffectsActionsRegistry {
  private registry: Map<string, EffectOperator> = new Map();

  register(name: string, fn: EffectOperator, override = false): void {
    if (!override && this.registry.has(name)) {
      console.error(`EffectAction "${name}" already registered. Use 'override' to replace.`);
      return;
    }
    this.registry.set(name, fn);
  }

  get(name: string): EffectOperator | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }
}

export class DefaultEffectsActionsRegistry extends EffectsActionsRegistry {
  constructor(toolbox: EffectsToolbox, customActions: Record<string, EffectOperator> = {}) {
    super();
    this.registerDefaults(toolbox);
    this.registerCustomActions(customActions);
  }

  private registerDefaults(toolbox: EffectsToolbox): void {
    this.register("setValue", new SetValueOperator(toolbox));
    this.register("resetField", new ResetFieldOperator(toolbox));
    this.register("clearErrors", new ClearErrorsOperator(toolbox));
    this.register("setFieldProps", new SetFieldPropsOperator(toolbox));
    this.register("setRegisterProps", new SetRegisterPropsOperator(toolbox));
    this.register("showField", new ShowFieldOperator(toolbox));
    this.register("hideField", new HideFieldOperator(toolbox));
    this.register("deduplicateOptions", new DeduplicateOptionsOperator(toolbox));
  }

  private registerCustomActions(custom: Record<string, EffectOperator>): void {
    for (const [name, fn] of Object.entries(custom)) {
      this.register(name, fn);
    }
  }
}