import { JSX, useEffect, useMemo } from "react";
import { createPubSubWithState } from "../../../services/pubSub/createPubSubWithState";
import { OptionsConfig, OptionsState } from "../types";
import { useFormContext } from "react-hook-form";
import { OptionsContext } from "./OptionsContext";
import { createOperators } from "../engine/createOperators";
import { DefaultOptionsEngine } from "../engine/OptionsEngine";

interface OptionsProviderProps {
  config: OptionsConfig;
  children: React.ReactNode;
}

export function OptionsProvider({ config, children }: OptionsProviderProps): JSX.Element {
  const { watch, getValues } = useFormContext();
  const pubsub = useMemo(() => createPubSubWithState<OptionsState>(new Map()), []);
  const operators = useMemo(() => createOperators(config, pubsub.publish), [config, pubsub]);

  const engine = useMemo(
    () => new DefaultOptionsEngine(config, operators, watch, getValues),
    [config, getValues, operators, watch]
  );
  
  useEffect(() => {
    engine.init();
    const unobserve = engine.observe();
    return () => unobserve();
  }, [engine]);

  return (
    <OptionsContext.Provider value={pubsub}>
      {children}
    </OptionsContext.Provider>
  );
}