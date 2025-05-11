import { useFormContext } from "react-hook-form";
import { EffectsConfig, EffectState } from "../types";
import { useOptionsContext } from "../../Options";
import { createPubSubWithState } from "../../../services/pubSub/createPubSubWithState";
import { useEffect, useMemo } from "react";
import { createEffectsEngine } from "../engine/createEffectsEngine";
import { operators } from "../engine/operators";
import { createActions } from "../engine/createActions";
import { EffectsContext } from "./EffectsContext";

interface EffectsProviderProps {
  config: EffectsConfig;
  children: React.ReactNode;
}

export function EffectsProvider({ config, children}: EffectsProviderProps) {
  const { watch, ...methods } = useFormContext();
  const { getSnapshot: getOptions } = useOptionsContext();
  const { publish, merge, subscribe } = useMemo(() => createPubSubWithState<EffectState>(new Map()), []); 
  const toolbox = useMemo(() => ({ ...methods, publish, merge, getOptions }), [methods, getOptions, publish, merge]);
  const actions = useMemo(() => createActions(toolbox), [toolbox]);
  const engine = useMemo(() => createEffectsEngine(config, toolbox, operators, actions), [config, actions, toolbox]);
  const dependencies = useMemo(() => engine.getDependencies(), [engine]);

  useEffect(() => {
      engine.init();
    }, [engine]);
  
    useEffect(() => {
      const { unsubscribe } = watch((_, { name }) => {
        if (name && dependencies.includes(name)) {
          engine.runEffects(name);
        }
      });
      return () => unsubscribe();
    }, [watch, dependencies, engine]);
  
    const contextValue = useMemo(() => ({subscribe}), [subscribe])
  
    return (
      <EffectsContext.Provider value={contextValue}>
        {children}
      </EffectsContext.Provider>
    )
}