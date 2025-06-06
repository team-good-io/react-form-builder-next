import { ValidationToolbox } from "../engine/ValidationToolbox";

export type ValidatorFn = (value: unknown) => boolean | string | Promise<boolean | string>;

export interface ValidationOperator {
  create(toolbox: ValidationToolbox, params: Record<string, unknown>): ValidatorFn;
}

export type ValidationRule = [fn: string] | [fn: string, params: Record<string, unknown>];