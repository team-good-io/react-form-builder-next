import optionsService from "../../../../services/options/OptionsService";
import { OptionsCommand, OptionsConfig, OptionsSourceType, OptionsToolbox } from "../../types";

export class RemoteCommand implements OptionsCommand {
  private readonly sourceName: string;
  private readonly config: OptionsConfig;
  private readonly toolbox: OptionsToolbox;

  constructor(
    sourceName: string,
    config: OptionsConfig,
    toolbox: OptionsToolbox
  ) {
    this.sourceName = sourceName;
    this.config = config;
    this.toolbox = toolbox;
  }

  async execute() {
    const source = this.config[this.sourceName];
    if (source.type !== OptionsSourceType.REMOTE) return;

    this.toolbox.publish(this.sourceName, { loading: true });
    try {
      const options = await optionsService.fetch(source.path, source.labelKey, source.valueKey);
      this.toolbox.publish(this.sourceName, { loading: false, data: options });
    } catch (error) {
      this.toolbox.publish(this.sourceName, { loading: false, error });
    }
  }
}