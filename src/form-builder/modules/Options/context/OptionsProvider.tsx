import { JSX, useEffect, useMemo } from "react";
import { PubSubState } from "../../../services/pubSub/PubSubState";
import { OptionsConfig, OptionsState } from "../types";
import { useFormContext } from "react-hook-form";
import { OptionsContext, OptionsContextProps } from "./OptionsContext";
import { createOperators } from "../engine/createOperators";
import { DefaultOptionsEngine } from "../engine/OptionsEngine";
import { bindMethods } from "../../../utils/bindMethods";

interface OptionsProviderProps {
  config: OptionsConfig;
  children: React.ReactNode;
}

export function OptionsProvider({ config, children }: OptionsProviderProps): JSX.Element {
  const { watch, getValues } = useFormContext();
  const { publish, subscribe, getSnapshot } = useMemo(() => bindMethods(new PubSubState<OptionsState>(new Map())), []);
  const operators = useMemo(() => createOperators(config, publish), [config, publish]);

  const engine = useMemo(
    () => new DefaultOptionsEngine(config, operators, watch, getValues),
    [config, getValues, operators, watch]
  );
  
  useEffect(() => {
    engine.init();
    const unobserve = engine.observe();
    return () => unobserve();
  }, [engine]);

  const ctxValue: OptionsContextProps<OptionsState> = useMemo(
    () => ({ subscribe, getSnapshot }),
    [subscribe, getSnapshot]
  );

  return (
    <OptionsContext.Provider value={ctxValue}>
      {children}
    </OptionsContext.Provider>
  );
}