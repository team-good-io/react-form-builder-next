import { EffectAction, EffectsToolbox } from "../types";
import { deduplicateOptions } from "./actions/deduplicateOptions";

export type ActionFunction = (action: EffectAction) => void;

export function createActions(toolbox: EffectsToolbox): Record<string, ActionFunction> {
  return {
    setValue: (action) => toolbox.setValue(action.target, action.value),
    resetField: (action) => toolbox.resetField(action.target),
    clearErrors: (action) => toolbox.clearErrors(action.target),
    setFieldProps: (action) => toolbox.merge(action.target, { fieldProps: action.value }),
    setRegisterProps: (action) => toolbox.merge(action.target, { registerProps: action.value }),
    showField: (action) => toolbox.merge(action.target, { fieldProps: { hidden: false} }),
    hideField: (action) => toolbox.merge(action.target, { fieldProps: { hidden: true} }),
    deduplicateOptions: (action) => deduplicateOptions(action, toolbox),
  }
}
