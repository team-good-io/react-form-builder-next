import { EffectAction, EffectCommand } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class ResetFieldCommand implements EffectCommand {
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
      console.warn("resetField action has no targets specified.");
      return;
    }
    
    this.action.targets.forEach(target => {
      this.toolbox.form.resetField(target);
    })
  }
}