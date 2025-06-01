import { OptionsConfig, OptionsFn, OptionsSource, OptionsSourceRemoteDynamic, OptionsSourceType } from "../types";

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
      if (sourceConfig.type !== OptionsSourceType.REMOTE_DYNAMIC) return;

      const isImpacted = sourceConfig.dependencies.some((dep) => changedFields.includes(dep));
      if (!isImpacted) return;

      this.operators[OptionsSourceType.REMOTE_DYNAMIC](sourceName, formValues);
    });
  }

  private hasDependencies(source: OptionsSource): source is OptionsSourceRemoteDynamic {
    return 'dependencies' in source && source.dependencies.length > 0;
  }

  private getDependencies(): string[] {
    return Array.from(new Set(
      Object.values(this.config)
        .filter(this.hasDependencies)
        .flatMap((source) => source.dependencies),
    ));
  }
}