import optionsService from "../../../../services/options/OptionsService";
import { OptionsConfig, OptionsOperator, OptionsSourceType, OptionsState } from "../../types";

export class RemoteOperator implements OptionsOperator {
  async execute(
    sourceName: string,
    _values: Record<string, unknown>,
    config: OptionsConfig,
    publish: (name: string, data: OptionsState) => void
  ) {
    const source = config[sourceName];
    if (source.type !== OptionsSourceType.REMOTE) return;
    publish(sourceName, { loading: true });
    try {
      const options = await optionsService.fetch(source.path, source.labelKey, source.valueKey);
      publish(sourceName, { loading: false, data: options });
    } catch (error) {
      publish(sourceName, { loading: false, error });
    }
  }
}