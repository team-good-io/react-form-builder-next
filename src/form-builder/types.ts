import { OptionsConfig } from "./modules/Options";
import { EffectsConfig } from "./modules/Effects";

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
  template?: React.ComponentType<{ config?: Record<string, unknown>; children: React.ReactNode; }>;
  templateConfig?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  fields: FieldConfig[];
  defaultValues?: Record<string, unknown>;
  optionsConfig?: OptionsConfig;
  effectsConfig?: EffectsConfig;
  onValid?(values?: Record<string, unknown>): void;
  onInvalid?(): void;
}