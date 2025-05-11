import { OptionsConfig, OptionsFn, OptionsSourceType, OptionsState } from "../types";
import { staticOptions } from "./operators/static";
import { remoteOptions } from "./operators/remote";
import { remoteDynamic } from "./operators/remote-dynamic";

export const createOperators = (
  config: OptionsConfig,
  notify: (name: string, payload: OptionsState) => void
): Record<OptionsSourceType, OptionsFn> => {
  return {
    [OptionsSourceType.STATIC]: (sourceName) => staticOptions(config, sourceName, notify),
    [OptionsSourceType.REMOTE]: (sourceName) => remoteOptions(config, sourceName, notify),
    [OptionsSourceType.REMOTE_DYNAMIC]: (sourceName, values) => remoteDynamic(config, sourceName, values || {}, notify),
  }
}