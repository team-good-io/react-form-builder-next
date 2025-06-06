import { OptionsConfig } from "../types";
import { OptionsOperatorRegistry } from "./OptionsOperatorRegistry";
import { OptionsToolbox } from "./OptionsToolbox";

interface OptionsEngine {
  run: () => void;
  observe: () => () => void
}

export class DefaultOptionsEngine implements OptionsEngine {
  private readonly config: OptionsConfig;

  private readonly toolbox: OptionsToolbox;

  private readonly operators: OptionsOperatorRegistry;

  private dependencies: string[] = [];
  
  constructor(
    config: OptionsConfig,
    toolbox: OptionsToolbox,
    operators: OptionsOperatorRegistry,
  ) {
    this.config = config;
    this.toolbox = toolbox;
    this.operators = operators;

    this.dependencies = this.getDependencies();
  }

  public run(): void {
    const formValues = this.toolbox.getFormValues();
    
    Object.entries(this.config).forEach(([sourceName, sourceConfig]) => {
      const { type } = sourceConfig;
      const operator = this.operators.get(type);
      if(!operator) {
        console.warn(`No operator found for type: ${type}`);
        return;
      }
      operator.execute(sourceName, formValues, this.config, this.toolbox.publish);
      // this.operators[type](sourceName, formValues);
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
  
        const operator = this.operators.get(sourceConfig.type);
        if (!operator) {
          console.warn(`No operator found for type: ${sourceConfig.type}`);
          return;
        }
        operator.execute(sourceName, formValues, this.config, this.toolbox.publish);
        // this.operators[OptionsSourceType.REMOTE_DYNAMIC](sourceName, formValues);
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