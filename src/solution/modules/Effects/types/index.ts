/**
 * Effect state published to consumers (PubSub)
 */

import { OptionsState } from "../Options/types";

export interface EffectState {
  fieldProps?: Record<string, unknown>;
  registerProps?: Record<string, unknown>;
  options?: OptionsState;
}

/**
 * Simple field-based condition
 */
export type SimpleCondition = {
  field: string;
  operator: '===' | '!==' | '>' | '<' | 'in' | 'length>' | 'length<' | 'length===';
  value: unknown;
};

/**
 * Composite condition types for logical operators
 */
export type CompositeCondition =
  | { type: 'AND'; conditions: EffectCondition[] }
  | { type: 'OR'; conditions: EffectCondition[] }
  | { type: 'NOT'; condition: EffectCondition };

/**
 * Unified EffectCondition type
 */
export type EffectCondition = SimpleCondition | CompositeCondition;

/**
 * EffectAction types
 * - `runOnInit`: some actions skip init by default to avoid overriding initial values
 */

export type EffectAction =
  | { type: 'setValue'; target: string; value: unknown; runOnInit?: boolean }
  | { type: 'setRegisterProps'; target: string; value: Record<string, unknown> }
  | { type: 'resetField'; target: string; runOnInit?: boolean }
  | { type: 'showField'; target: string }
  | { type: 'hideField'; target: string }
  | { type: 'clearErrors'; target: string }
  | { type: 'setFieldProps'; target: string; value: Record<string, unknown> }
  | { type: 'deduplicateOptions'; targets: string[]; runOnInit?: boolean }

/**
 * Single effect rule
 * - `when`: conditions to trigger
 * - `actions`: actions to execute when conditions are met
 */
export type EffectRule = {
  id?: string;
  when: EffectCondition;
  actions: EffectAction[];
};

/**
 * Full effects configuration array
 */
export type EffectsConfig = EffectRule[];

/**
 * Toolbox provided to effect engine for performing actions
 */
export interface EffectsToolbox {
  getValues: () => Record<string, unknown>;
  getOptions: () => Map<string, OptionsState>;
  setValue: (name: string, value: unknown) => void;
  resetField: (name: string) => void;
  clearErrors: (name: string) => void;
  publish: (name: string, state: EffectState) => void;
  merge: (name: string, state: EffectState) => void;
  // Future: add showField / hideField hooks here for full future-proofing
}