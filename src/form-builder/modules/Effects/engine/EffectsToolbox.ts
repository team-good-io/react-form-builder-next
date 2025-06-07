import { OptionsState } from "../../Options/types";
import { EffectState } from "../types";

export interface EffectsFormToolbox {
  getValues(): Record<string, unknown>;
  setValue(name: string, value: unknown): void;
  resetField(name: string): void;
  clearErrors(name: string): void;
  watch(callback: (values: Record<string, unknown>, info: { name?: string }) => void): { unsubscribe: () => void };
}

export interface EffectsOptionsToolbox {
  getOptions: () => Map<string, OptionsState>;
}

export interface EffectsStateToolbox {
  publish(name: string, data: EffectState): void;
  merge: (name: string, state: EffectState) => void;
}

export interface EffectsToolbox {
  form: EffectsFormToolbox;
  options: EffectsOptionsToolbox;
  state: EffectsStateToolbox;
}

export class DefaultEffectsToolbox implements EffectsToolbox {

  public readonly form: EffectsFormToolbox;

  public readonly options: EffectsOptionsToolbox;

  public readonly state: EffectsStateToolbox;

  constructor(
    form: EffectsFormToolbox,
    options: EffectsOptionsToolbox,
    state: EffectsStateToolbox
  ) {
    this.form = form;
    this.options = options;
    this.state = state;
  }
}