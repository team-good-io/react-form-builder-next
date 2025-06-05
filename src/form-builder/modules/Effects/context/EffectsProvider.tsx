import { useFormContext } from "react-hook-form";
import { EffectsConfig, EffectState } from "../types";
import { useOptionsContext } from "../../Options";
import { PubSubState } from "../../../services/pubSub/PubSubState";
import { useEffect, useMemo } from "react";
import { operators } from "../engine/operators";
import { createActions } from "../engine/createActions";
import { EffectsContext, EffectsContextProps } from "./EffectsContext";
import { DefaultEffectsEngine } from "../engine/EffectsEngine";
import { bindMethods } from "../../../utils/bindMethods";

interface EffectsProviderProps {
  config: EffectsConfig;
  children: React.ReactNode;
}

export function EffectsProvider({ config, children }: EffectsProviderProps) {
  const methods = useFormContext();
  const { getSnapshot: getOptions } = useOptionsContext();
  const { publish, merge, subscribe } = useMemo(() => bindMethods(new PubSubState<EffectState>(new Map())), []);
  const toolbox = useMemo(
    () => ({ ...methods, publish, merge, getOptions }),
    [methods, publish, merge, getOptions]
  );
  const actions = useMemo(() => createActions(toolbox), [toolbox]);
  const engine = useMemo(
    () => new DefaultEffectsEngine(config, toolbox, operators, actions),
    [config, actions, toolbox]
  );

  useEffect(() => {
    engine.init();
    const unobserve = engine.observe();
    return () => unobserve();
  }, [engine]);

  const ctxValue: EffectsContextProps<EffectState> = useMemo(() => ({ subscribe }), [subscribe])

  return (
    <EffectsContext.Provider value={ctxValue}>
      {children}
    </EffectsContext.Provider>
  )
}