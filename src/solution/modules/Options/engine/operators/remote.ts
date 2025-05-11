import { OptionsConfig, OptionsSourceType, OptionsState } from "../../types";
import { fetchOptionsFromRemote } from "../utils/fetchOptionsFromRemote";

export const remoteOptions = async (
  config: OptionsConfig,
  sourceName: string,
  notify: (sourceName: string, data: OptionsState) => void,
) => {
  const source = config[sourceName];
  if (source.type !== OptionsSourceType.REMOTE) return;
  notify(sourceName, { loading: true });
  try {
    const options = await fetchOptionsFromRemote(source.path, source.labelKey, source.valueKey);
    notify(sourceName, { loading: false, data: options });
  } catch (error) {
    notify(sourceName, { loading: false, error });
  }
}