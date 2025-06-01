import { JSX, useEffect, useMemo } from "react";
import { createPubSubWithState } from "../../../services/pubSub/createPubSubWithState";
import { OptionsConfig, OptionsState } from "../types";
import { useFormContext } from "react-hook-form";
import { OptionsContext } from "./OptionsContext";
import { createOperators } from "../engine/createOperators";
import { DefaultOptionsManager } from "../manager/OptionsManager";

interface OptionsProviderProps {
  config: OptionsConfig;
  children: React.ReactNode;
}

export function OptionsProvider({ config, children }: OptionsProviderProps): JSX.Element {
  const { watch, getValues } = useFormContext();
  const pubsub = useMemo(() => createPubSubWithState<OptionsState>(new Map()), []);
  const operators = useMemo(() => createOperators(config, pubsub.publish), [config, pubsub]);

  const manager = useMemo(
    () => new DefaultOptionsManager(config, operators, watch, getValues),
    [config, getValues, operators, watch]
  );
  
  useEffect(() => {
    manager.init();
    const unobserve = manager.observe();
    return () => unobserve();
  }, [manager]);

  return (
    <OptionsContext.Provider value={pubsub}>
      {children}
    </OptionsContext.Provider>
  );
}