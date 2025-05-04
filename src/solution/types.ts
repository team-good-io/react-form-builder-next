import { OptionsConfig } from "./providers/Options/types";
import { EffectsConfig } from "./providers/Effects/types";
import { templateMap } from "./templates";
import { ValidationConfig } from "./providers";

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
  template: { name: keyof typeof templateMap, params?: Record<string, unknown> };
  meta?: Record<string, unknown>;
  fields: FieldConfig[];
  defaultValues?: Record<string, unknown>;
  optionsConfig?: OptionsConfig;
  effectsConfig?: EffectsConfig;
  validationConfig?: ValidationConfig;
  onValid?(values?: Record<string, unknown>): void;
  onInvalid?(): void;
}