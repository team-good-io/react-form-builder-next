import { EffectAction, EffectsToolbox } from "../types";
import { deduplicateOptions } from "./actions/deduplicateOptions";

export type ActionFunction = (action: EffectAction) => void;

export function createActions(toolbox: EffectsToolbox): Record<string, ActionFunction> {
  return {
    setValue: (action) => action.type === 'setValue' && toolbox.setValue(action.target, action.value),
    resetField: (action) => action.type === 'resetField' && toolbox.resetField(action.target),
    clearErrors: (action) => action.type === 'clearErrors' && toolbox.clearErrors(action.target),
    setFieldProps: (action) => action.type === 'setFieldProps' && toolbox.merge(action.target, { fieldProps: action.value }),
    setRegisterProps: (action) => action.type === 'setRegisterProps' && toolbox.merge(action.target, { registerProps: action.value }),
    showField: (action) => action.type === 'showField' && toolbox.merge(action.target, { fieldProps: { hidden: false} }),
    hideField: (action) => action.type === 'hideField' && toolbox.merge(action.target, { fieldProps: { hidden: true} }),
    deduplicateOptions: (action) => action.type === 'deduplicateOptions' && deduplicateOptions(action, toolbox),
  }
}
