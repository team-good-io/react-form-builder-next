import { EffectAction, EffectOperator } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class HideFieldOperator implements EffectOperator {
  public readonly toolbox: EffectsToolbox;

  constructor(toolbox: EffectsToolbox) {
    this.toolbox = toolbox;
  }

  async execute(action: EffectAction) {
    if (action.type !== "hideField") return;

    if (action.targets.length === 0) {
      console.warn("hideField action has no targets specified.");
      return;
    }

    action.targets.forEach(target => {
      this.toolbox.state.merge(target, { fieldProps: { hidden: true } });
    })
  }
}