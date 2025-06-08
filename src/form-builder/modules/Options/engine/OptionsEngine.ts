import { Registry } from "../../core/Registry";
import { OptionsCommandFactory, OptionsConfig } from "../types";
import { OptionsToolbox } from "./OptionsToolbox";

interface OptionsEngine {
  run: () => void;
  observe: () => () => void
}

export class DefaultOptionsEngine implements OptionsEngine {
  private readonly config: OptionsConfig;

  private readonly toolbox: OptionsToolbox;

  private readonly operators: Registry<OptionsCommandFactory>;

  private dependencies: string[] = [];

  constructor(
    config: OptionsConfig,
    toolbox: OptionsToolbox,
    operators: Registry<OptionsCommandFactory>,
  ) {
    this.config = config;
    this.toolbox = toolbox;
    this.operators = operators;

    this.dependencies = this.getDependencies();
  }

  public run(): void {
    const formValues = this.toolbox.getFormValues();

    Object.keys(this.config).forEach(sourceName => {
      this.runCommandForSource(sourceName, formValues);
    });
  }

  public observe(): () => void {
    const { unsubscribe } = this.toolbox.observeFormValues((formValues, { name }) => {
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

      this.runCommandForSource(sourceName, formValues);
    });
  }

  private runCommandForSource(sourceName: string, formValues: Record<string, unknown>) {
    const sourceConfig = this.config[sourceName];

    try {
      const factory = this.operators.get(sourceConfig.type);
      if (!factory) {
        console.warn(`No operator found for type: ${sourceConfig.type}`);
        return;
      }

      const command = factory(sourceName, formValues, this.config, this.toolbox);
      command.execute();
    } catch (error) {
      console.error(`Error executing operator for source "${sourceName}":`, error);
    }
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