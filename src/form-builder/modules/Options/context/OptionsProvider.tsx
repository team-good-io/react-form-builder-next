import { JSX, useEffect, useMemo } from "react";
import { createPubSubWithState } from "../../../services/pubSub/createPubSubWithState";
import { OptionsConfig, OptionsState } from "../types";
import { useFormContext } from "react-hook-form";
import { OptionsContext } from "./OptionsContext";
import { createOptionsEngine } from "../engine/createOptionsEngine";
import { createOperators } from "../engine/createOperators";

interface OptionsProviderProps {
  config: OptionsConfig;
  children: React.ReactNode;
}

export function OptionsProvider({ config, children }: OptionsProviderProps): JSX.Element {
  const { watch, getValues } = useFormContext();
  const pubsub = useMemo(() => createPubSubWithState<OptionsState>(new Map()), []);
  const operators = useMemo(() => createOperators(config, pubsub.publish), [config, pubsub]);
  const engine = useMemo(() => createOptionsEngine(config, operators), [config, operators]);
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