import { OptionsConfig, OptionsOperator, OptionsSourceType, OptionsState } from "../../types";

export class StaticOperator implements OptionsOperator {
  execute(
    sourceName: string,
    _values: Record<string, unknown>,
    config: OptionsConfig,
    publish: (name: string, data: OptionsState) => void
  ) {
    
      const source = config[sourceName];
        if (source.type !== OptionsSourceType.STATIC) return;
      
        publish(sourceName, {
          loading: false,
          data: source.options,
        });
    
  }
}