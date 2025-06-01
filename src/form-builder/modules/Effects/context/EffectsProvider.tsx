import { useFormContext } from "react-hook-form";
import { EffectsConfig, EffectState } from "../types";
import { useOptionsContext } from "../../Options";
import { createPubSubWithState } from "../../../services/pubSub/createPubSubWithState";
import { useEffect, useMemo } from "react";
import { operators } from "../engine/operators";
import { createActions } from "../engine/createActions";
import { EffectsContext } from "./EffectsContext";
import { DefaultEffectsManager } from "../manager/EffectsManager";

interface EffectsProviderProps {
  config: EffectsConfig;
  children: React.ReactNode;
}

export function EffectsProvider({ config, children }: EffectsProviderProps) {
  const methods = useFormContext();
  const { getSnapshot: getOptions } = useOptionsContext();
  const { publish, merge, subscribe } = useMemo(() => createPubSubWithState<EffectState>(new Map()), []);
  const toolbox = useMemo(
    () => ({ ...methods, publish, merge, getOptions }),
    [methods, publish, merge, getOptions]
  );
  const actions = useMemo(() => createActions(toolbox), [toolbox]);
  const manager = useMemo(
    () => new DefaultEffectsManager(config, toolbox, operators, actions),
    [config, actions, toolbox]
  );

  useEffect(() => {
    manager.init();
    const unobserve = manager.observe();
    return () => unobserve();
  }, [manager]);

  const ctxValue = useMemo(() => ({ subscribe }), [subscribe])

  return (
    <EffectsContext.Provider value={ctxValue}>
      {children}
    </EffectsContext.Provider>
  )
}