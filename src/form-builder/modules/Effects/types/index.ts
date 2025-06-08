/**
 * Effect state published to consumers (PubSub)
 */

import { OptionsState } from "../../Options/types";
import { EffectsToolbox } from "../engine/EffectsToolbox";


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
 * EffectAction
 * - `skipOnInit`: skip actions on init to avoid overriding initial values
 */

export type EffectAction = {
  type: string;
  targets: string[];
  value?: unknown;
  skipOnInit?: boolean;
}

export interface EffectCommand {
  execute(): Promise<void>;
}

export type CommandFactory = (toolbox: EffectsToolbox, action: EffectAction) => EffectCommand;

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
