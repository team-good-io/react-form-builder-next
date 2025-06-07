import { EffectAction, EffectOperator } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class SetRegisterPropsOperator implements EffectOperator {
  public readonly toolbox: EffectsToolbox;

  constructor(toolbox: EffectsToolbox) {
    this.toolbox = toolbox;
  }

  async execute(action: EffectAction) {
    if (action.type !== "setRegisterProps") return;

    if (action.targets.length === 0) {
      console.warn("setRegisterProps action has no targets specified.");
      return;
    }
    
    action.targets.forEach(target => {
      this.toolbox.state.merge(target, {registerProps: action.value });
    })
  }
}