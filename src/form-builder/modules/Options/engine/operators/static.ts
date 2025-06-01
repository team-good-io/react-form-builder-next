import { OptionsConfig, OptionsSourceType, OptionsState } from "../../types";

export const staticOptions = (
  config: OptionsConfig,
  sourceName: string,
  notify: (sourceName: string, data: OptionsState) => void,
) => {
  const source = config[sourceName];
  if (source.type !== OptionsSourceType.STATIC) return;

  notify(sourceName, {
    loading: false,
    data: source.options,
  });
}