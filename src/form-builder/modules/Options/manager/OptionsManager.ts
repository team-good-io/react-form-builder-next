import { OptionsConfig, OptionsFn, OptionsSourceType } from "../types";

export interface OptionsManager {
  init: () => void;
  observe: () => () => void;
}

export class DefaultOptionsManager implements OptionsManager {
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

  private getDependencies(): string[] {
    return Array.from(new Set(
      Object.values(this.config)
        .filter((source) => source.type === OptionsSourceType.REMOTE_DYNAMIC)
        .flatMap((source) => source.dependencies),
    ));
  }

  private onDepsChange(changedFields: string[], values: Record<string, unknown>) {
    Object.entries(this.config).forEach(([sourceName, sourceConfig]) => {
      if (sourceConfig.type !== OptionsSourceType.REMOTE_DYNAMIC) return;

      const isImpacted = sourceConfig.dependencies.some((dep) => changedFields.includes(dep));
      if (!isImpacted) return;

      this.operators[OptionsSourceType.REMOTE_DYNAMIC](sourceName, values);
    });
  }

  public init(): void {
    const values = this.getValues();

    Object.entries(this.config).forEach(([sourceName, sourceConfig]) => {
      const { type } = sourceConfig;
      this.operators[type](sourceName, values);
    });
  }

  public observe(): () => void {
    const { unsubscribe } = this.watch((values, { name }) => {
      if (name && this.dependencies.includes(name)) {
        this.onDepsChange([name], values);
      }
    });

    return () => {
      unsubscribe();
    };
  }
}