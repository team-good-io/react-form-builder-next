import { OptionsConfig, OptionsFn, OptionsSourceType } from "../types";

export interface OptionsEngine {
  init: () => void;
  observe: () => () => void;
}

export class DefaultOptionsEngine implements OptionsEngine {
  private readonly config: OptionsConfig;

  private readonly operators: Record<OptionsSourceType, OptionsFn>;

  private readonly watch: (callback: (values: Record<string, unknown>, info: { name?: string }) => void) => { unsubscribe: () => void };

  private readonly getValues: () => Record<string, unknown>;

  private dependencies: string[] = [];

  constructor(
    config: OptionsConfig,
    operators: Record<OptionsSourceType, OptionsFn>,
    watch: (callback: (values: Record<string, unknown>, info: { name?: string }) => void) => { unsubscribe: () => void },
    getValues: () => Record<string, unknown>,
  ) {
    this.config = config;
    this.operators = operators;
    this.watch = watch;
    this.getValues = getValues;

    this.dependencies = this.getDependencies();
  }

  public init(): void {
    const formValues = this.getValues();

    Object.entries(this.config).forEach(([sourceName, sourceConfig]) => {
      const { type } = sourceConfig;
      this.operators[type](sourceName, formValues);
    });
  }

  public observe(): () => void {
    const { unsubscribe } = this.watch((formValues, { name }) => {
      if (name && this.dependencies.includes(name)) {
        this.onDepsChange([name], formValues);
      }
    });

    return () => unsubscribe();
  }

  private onDepsChange(changedFields: string[], formValues: Record<string, unknown>) {
    Object.entries(this.config).forEach(([sourceName, sourceConfig]) => {
      if (!sourceConfig.dependencies?.length) return;

      const isImpacted = sourceConfig.dependencies.some((dep) => changedFields.includes(dep));
      if (!isImpacted) return;

      this.operators[OptionsSourceType.REMOTE_DYNAMIC](sourceName, formValues);
    });
  }

  private getDependencies(): string[] {
    return Array.from(new Set(
      Object.values(this.config)
        .filter((source) => source.dependencies && source.dependencies.length > 0)
        .flatMap((source) => source.dependencies)
        .filter((dep): dep is string => typeof dep === "string"),
    ));
  }
}