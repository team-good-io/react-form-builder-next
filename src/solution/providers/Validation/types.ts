export type ValidationRuleConfig = [fn: string] | [fn: string, params: Record<string, unknown>];

export type ValidationConfig = Record<string, ValidationRuleConfig[]>;

export type ValidationFn = (value: unknown) => boolean | Promise<boolean>;
export type ValidationFactory = (params: Record<string, unknown>) => ValidationFn;
