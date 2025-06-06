import { OptionsState } from "../types";

export interface OptionsToolbox {
  getFormValues(): Record<string, unknown>;
  observeFormValues(callback: (values: Record<string, unknown>, info: { name?: string }) => void): { unsubscribe: () => void };
  publish(name: string, data: OptionsState): void;
}

export class DefaultOptionsToolbox implements OptionsToolbox {

  public readonly getFormValues: () => Record<string, unknown>;

  public readonly observeFormValues: (callback: (values: Record<string, unknown>, info: { name?: string }) => void) => { unsubscribe: () => void };

  public readonly publish: (name: string, data: OptionsState) => void;

  constructor(
    getFormValues: () => Record<string, unknown>,
    observeFormValues: (callback: (values: Record<string, unknown>, info: { name?: string }) => void) => { unsubscribe: () => void },
    publish: (name: string, data: OptionsState) => void
  ) {
    this.getFormValues = getFormValues;
    this.observeFormValues = observeFormValues;
    this.publish = publish;
  }
}