import { EffectAction, EffectOperator } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class ShowFieldOperator implements EffectOperator {
  public readonly toolbox: EffectsToolbox;

  constructor(toolbox: EffectsToolbox) {
    this.toolbox = toolbox;
  }

  async execute(action: EffectAction) {
    if (action.type !== "showField") return;

    if (action.targets.length === 0) {
      console.warn("showField action has no targets specified.");
      return;
    }

    action.targets.forEach(target => {
      this.toolbox.state.merge(target, { fieldProps: { hidden: false } });
    })
  }
}