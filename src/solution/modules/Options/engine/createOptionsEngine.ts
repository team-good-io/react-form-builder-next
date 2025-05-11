import { OptionsConfig, OptionsFn, OptionsSourceType } from "../types";

interface OptionsEngine {
  init: (formValues: Record<string, unknown>) => void;
  getDependencies: () => string[];
  onDepsChange: (changedFields: string[], formValues: Record<string, unknown>) => void;
}

export function createOptionsEngine(
  config: OptionsConfig,
  operators: Record<OptionsSourceType, OptionsFn>,
): OptionsEngine {

  const init = (formValues: Record<string, unknown>): void => {
    Object.entries(config).forEach(([sourceName, sourceConfig]) => {
      const { type } = sourceConfig;
      operators[type](sourceName, formValues);
    });
  }

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

      operators[OptionsSourceType.REMOTE_DYNAMIC](sourceName, formValues);
    });
  };

  return {
    init,
    getDependencies,
    onDepsChange
  }
}