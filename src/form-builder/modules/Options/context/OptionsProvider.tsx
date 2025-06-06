import { JSX, useEffect, useMemo } from "react";
import { OptionsConfig, OptionsOperator, OptionsState } from "../types";
import { OptionsContext, OptionsContextProps } from "./OptionsContext";
import { bindMethods } from "../../../utils/bindMethods";
import { PubSubState } from "../../../services/pubSub/PubSubState";
import { DefaultOptionsEngine } from "../engine/OptionsEngine";
import { DefaultOptionsToolbox } from "../engine/OptionsToolbox";
import { DefaultOptionsOperatorRegistry } from "../engine/OptionsOperatorRegistry";
import { useFormContext } from "react-hook-form";

interface OptionsProviderProps {
  config: OptionsConfig;
  customOperators?: Record<string, OptionsOperator>;
  children: React.ReactNode;
}

export function OptionsProvider({ config, customOperators, children }: OptionsProviderProps): JSX.Element {
  const { watch, getValues } = useFormContext();
  const { publish, subscribe, getSnapshot } = useMemo(() => bindMethods(new PubSubState<OptionsState>(new Map())), []);
  const toolbox = useMemo(() => new DefaultOptionsToolbox(getValues, watch, publish), [watch, getValues, publish]);
  const operators = useMemo(() => new DefaultOptionsOperatorRegistry(customOperators), [customOperators]);
  const engine = useMemo(() => new DefaultOptionsEngine(config, toolbox, operators), [config, operators, toolbox])

  useEffect(() => {
    engine.run();
    const unobserve = engine.observe();
    return () => unobserve();
  }, [engine]);

  const ctxValue: OptionsContextProps<OptionsState> = useMemo(
    () => ({ subscribe, getSnapshot }),
    [getSnapshot, subscribe]
  );

  return (
    <OptionsContext.Provider value={ctxValue}>
      {children}
    </OptionsContext.Provider>
  )
}