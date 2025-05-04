export type ValidationRuleConfig = [fn: string] | [fn: string, params: Record<string, unknown>];
export type ValidationToolbox = {
  getValues: () => Record<string, unknown>;
}
export type ValidationFn = (value: unknown) => boolean | string | Promise<boolean | string>;
export type ValidationFactoryFn = (
  toolbox: ValidationToolbox,
  params: Record<string, unknown>
) => ValidationFn;