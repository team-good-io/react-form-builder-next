import { interpolateUrl } from "../../../../services/httpClient/utils/interpolateUrl";
import { OptionsConfig, OptionsSourceType, OptionsState } from "../../types";
import { fetchOptionsFromRemote } from "../utils/fetchOptionsFromRemote";

export const remoteDynamic = async (
  config: OptionsConfig,
  sourceName: string,
  values: Record<string, unknown>,
  notify: (name: string, payload: OptionsState) => void
) => {
  if (!values) return;

  const source = config[sourceName];
  if (source.type !== OptionsSourceType.REMOTE_DYNAMIC) return;

  const hasAllDeps = source.dependencies.every((dep) => {
    const value = values[dep];
    return value !== undefined && value !== null && value !== '';
  });

  if (!hasAllDeps) return;

  const interpolatedPath = interpolateUrl(source.path, values);
  notify(sourceName, { loading: true });

  try {
    const options = await fetchOptionsFromRemote(
      interpolatedPath,
      source.labelKey,
      source.valueKey,
    );
    notify(sourceName, { loading: false, data: options });
  } catch (error) {
    notify(sourceName, { loading: false, error });
  }
}