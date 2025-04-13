
import { CreatePubSubStateProps } from '../../../services/pubSub/createPubSubWithState';
import type { OptionsConfig, OptionsState } from '../types';
import { OptionsSourceType } from '../types';
import { createOptionsHandlerMap } from './createOptionsHandlerMap';

interface OptionEngineReturns {
  init: (formValues: Record<string, unknown>) => void;
  getDependencies: () => string[];
  onDepsChange: (changedFields: string[], formValues: Record<string, unknown>) => void;
}

export function createOptionsEngine(
  config: OptionsConfig,
  pubsub: CreatePubSubStateProps<OptionsState>,
): OptionEngineReturns {
  const handlers = createOptionsHandlerMap(config, pubsub);

  const init = (formValues: Record<string, unknown>): void => {
    Object.entries(config).forEach(([sourceName, sourceConfig]) => {
      const { type } = sourceConfig;
      handlers[type](sourceName, formValues);
    });
  };

  const getDependencies = (): string[] => Array.from(new Set(
    Object.values(config)
      .filter((s) => s.type === OptionsSourceType.REMOTE_DYNAMIC)
      .flatMap((s) => s.dependencies),
  ));

  const onDepsChange = (changedFields: string[], formValues: Record<string, unknown>): void => {
    Object.entries(config).forEach(([sourceName, sourceConfig]) => {
      if (sourceConfig.type !== OptionsSourceType.REMOTE_DYNAMIC) return;

      const isImpacted = sourceConfig.dependencies.some((dep) => changedFields.includes(dep));
      if (!isImpacted) return;

      handlers[OptionsSourceType.REMOTE_DYNAMIC](sourceName, formValues);
    });
  };

  return {
    init,
    getDependencies,
    onDepsChange,
  };
}