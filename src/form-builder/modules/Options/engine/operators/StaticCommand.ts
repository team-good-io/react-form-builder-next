import { OptionsCommand, OptionsConfig, OptionsSourceType, OptionsToolbox } from "../../types";

export class StaticCommand implements OptionsCommand {
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

  execute() {
    const source = this.config[this.sourceName];
    if (source.type !== OptionsSourceType.STATIC) return;

    this.toolbox.publish(this.sourceName, {
      loading: false,
      data: source.options,
    });
  }
}