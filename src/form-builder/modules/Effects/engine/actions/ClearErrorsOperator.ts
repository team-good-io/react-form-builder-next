import { EffectAction, EffectOperator } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class ClearErrorsOperator implements EffectOperator {
  public readonly toolbox: EffectsToolbox;

  constructor(toolbox: EffectsToolbox) {
    this.toolbox = toolbox;
  }

  async execute(action: EffectAction) {
    if (action.type !== "clearErrors") return;

    if (action.targets.length === 0) {
      console.warn("clearErrors action has no targets specified.");
      return;
    }
    
    action.targets.forEach(target => {
      this.toolbox.form.clearErrors(target);
    })
  }
}