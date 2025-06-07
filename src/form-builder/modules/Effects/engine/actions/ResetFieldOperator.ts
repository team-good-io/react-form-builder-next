import { EffectAction, EffectOperator } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class ResetFieldOperator implements EffectOperator {
  public readonly toolbox: EffectsToolbox;

  constructor(toolbox: EffectsToolbox) {
    this.toolbox = toolbox;
  }

  async execute(action: EffectAction) {
    if (action.type !== "resetField") return;

    if (action.targets.length === 0) {
      console.warn("resetField action has no targets specified.");
      return;
    }
    
    action.targets.forEach(target => {
      this.toolbox.form.resetField(target);
    })
  }
}