import { interpolateUrl } from '../../../services/httpClient/utils/interpolateUrl';
import { CreatePubSubStateProps } from '../../../services/pubSub/createPubSubWithState';
import { OptionsSourceType, type OptionsConfig, type OptionsState } from '../types';

import { fetchOptionsFromRemote } from './utils/fetchRemoteOptions';

export function createOptionsHandlerMap(
  config: OptionsConfig,
  pubsub: CreatePubSubStateProps<OptionsState>,
): Record<OptionsSourceType, (
  sourceName: string, formValues?: Record<string, unknown>
) => void | Promise<void>> {
  return {
    [OptionsSourceType.STATIC]: (sourceName: string) => {
      const source = config[sourceName];
      if (source.type !== OptionsSourceType.STATIC) return;
      pubsub.publish(sourceName, {
        loading: false,
        data: source.options,
      });
    },

    [OptionsSourceType.REMOTE]: async (sourceName: string) => {
      const source = config[sourceName];
      if (source.type !== OptionsSourceType.REMOTE) return;
      pubsub.publish(sourceName, { loading: true });
      try {
        const options = await fetchOptionsFromRemote(source.path, source.labelKey, source.valueKey);
        pubsub.publish(sourceName, { loading: false, data: options });
      } catch (error) {
        pubsub.publish(sourceName, { loading: false, error });
      }
    },

    [OptionsSourceType.REMOTE_DYNAMIC]: async (
      sourceName: string,
      formValues?: Record<string, unknown>,
    ) => {
      if (!formValues) return;

      const source = config[sourceName];
      if (source.type !== OptionsSourceType.REMOTE_DYNAMIC) return;

      const hasAllDeps = source.dependencies.every((dep) => {
        const value = formValues[dep];
        return value !== undefined && value !== null && value !== '';
      });

      if (!hasAllDeps) return;

      const interpolatedPath = interpolateUrl(source.path, formValues);
      pubsub.publish(sourceName, { loading: true });

      try {
        const options = await fetchOptionsFromRemote(
          interpolatedPath,
          source.labelKey,
          source.valueKey,
        );
        pubsub.publish(sourceName, { loading: false, data: options });
      } catch (error) {
        pubsub.publish(sourceName, { loading: false, error });
      }
    },
  };
}
