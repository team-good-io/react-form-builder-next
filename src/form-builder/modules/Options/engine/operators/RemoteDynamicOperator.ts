import { interpolateUrl } from "../../../../services/httpClient/utils/interpolateUrl";
import optionsService from "../../../../services/options/OptionsService";
import { OptionsConfig, OptionsOperator, OptionsSourceType, OptionsState } from "../../types";

export class RemoteDynamicOperator implements OptionsOperator {
  async execute(
    sourceName: string,
    values: Record<string, unknown>,
    config: OptionsConfig,
    publish: (name: string, data: OptionsState) => void
  ) {
    if (!values) return;
    
      const source = config[sourceName];
      if (source.type !== OptionsSourceType.REMOTE_DYNAMIC) return;
    
      const hasAllDeps = source.dependencies.every((dep) => {
        const value = values[dep];
        return value !== undefined && value !== null && value !== '';
      });
    
      if (!hasAllDeps) return;
    
      const interpolatedPath = interpolateUrl(source.path, values);
      publish(sourceName, { loading: true });
    
      try {
        const options = await optionsService.fetch(
          interpolatedPath,
          source.labelKey,
          source.valueKey,
        );
        publish(sourceName, { loading: false, data: options });
      } catch (error) {
        publish(sourceName, { loading: false, error });
      }
  }
}