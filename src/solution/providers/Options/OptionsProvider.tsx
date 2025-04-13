import { JSX, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { OptionsContext } from './OptionsContext';
import type { OptionsConfig, OptionsState } from './types';
import { createOptionsEngine } from './engine/createOptionsEngine';
import { createPubSubWithState } from '../../services/pubSub/createPubSubWithState';

interface OptionsProviderProps {
  config: OptionsConfig;
  children: React.ReactNode;
}

export function OptionsProvider({ config, children }: OptionsProviderProps): JSX.Element {
  const { watch, getValues } = useFormContext();
  const pubsub = useMemo(() => createPubSubWithState<OptionsState>(new Map()), []);
  const engine = useMemo(() => createOptionsEngine(config, pubsub), [config, pubsub]);
  const dependencies = useMemo(() => engine.getDependencies(), [engine]);

  useEffect(() => {
    engine.init(getValues());
  }, [engine, getValues]);

  useEffect(() => {
    const { unsubscribe } = watch((values, { name }) => {
      if (name && dependencies.includes(name)) {
        engine.onDepsChange([name], values);
      }
    });
    return () => unsubscribe();
  }, [watch, dependencies, engine]);

  return (
    <OptionsContext.Provider value={pubsub}>
      {children}
    </OptionsContext.Provider>
  );
}
