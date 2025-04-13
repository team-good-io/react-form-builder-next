import { useEffect, useMemo } from "react";
import { EffectsContext } from "./EffectsContext";
import { EffectsConfig, EffectState } from "./types";
import { createEffectsEngine } from "./engine/createEffectsEngine";
import { useFormContext } from "react-hook-form";
import { useOptionsContext } from "../Options";
import { createPubSubWithState } from "../../services/pubSub/createPubSubWithState";
// import { EffectsDevtoolsPanel } from "./engine/tools/EffectsDevToolsPanel";

interface EffectsProviderProps {
  config: EffectsConfig;
  children: React.ReactNode;
}

export function EffectsProvider({ config, children }: EffectsProviderProps) {
  const { watch, ...methods } = useFormContext();
  const { getSnapshot: getOptions } = useOptionsContext();
  const { publish, merge, subscribe } = useMemo(() => createPubSubWithState<EffectState>(new Map()), []);
  const toolbox = useMemo(() => ({ ...methods, publish, merge, getOptions }), [methods, getOptions, publish, merge]);
  const engine = useMemo(() => createEffectsEngine(config, toolbox), [config, toolbox]);
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
      {/* <EffectsDevtoolsPanel subscribe={engine.onDevtoolsEvent} /> */}
    </EffectsContext.Provider>
  )
}