import { EffectAction, EffectCommand } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class SetRegisterPropsCommand implements EffectCommand {
  public readonly toolbox: EffectsToolbox;
  public readonly action: EffectAction;

  constructor(
    toolbox: EffectsToolbox,
    action: EffectAction
  ) {
    this.toolbox = toolbox;
    this.action = action;
  }

  async execute() {
    if (this.action.targets.length === 0) {
      console.warn("setRegisterProps action has no targets specified.");
      return;
    }
    
    this.action.targets.forEach(target => {
      this.toolbox.state.merge(target, {
        registerProps: this.action.value as Record<string, unknown>
      });
    })
  }
}