import { OptionsConfig } from "./modules/Options";
import { EffectsConfig } from "./modules/Effects";
import { templateMap } from "./templates";
import { ValidationFactoryFn } from "./modules/Validation";

export interface Option<T = unknown> {
  label: string;
  value: string;
  ref?: T; // Optional reference to original data
}

export interface FieldConfig {
  type: string;
  name: string;
  options?: Option[];
  fieldProps?: Record<string, unknown>;
  registerProps?: Record<string, unknown>;
}

export type FormConfig = {
  type?: "form" | "promo";
  template: { name: keyof typeof templateMap, params?: Record<string, unknown> };
  meta?: Record<string, unknown>;
  fields: FieldConfig[];
  defaultValues?: Record<string, unknown>;
  optionsConfig?: OptionsConfig;
  effectsConfig?: EffectsConfig;
  validationOperators?:  Record<string, ValidationFactoryFn>;
  onValid?(values?: Record<string, unknown>): void;
  onInvalid?(): void;
}