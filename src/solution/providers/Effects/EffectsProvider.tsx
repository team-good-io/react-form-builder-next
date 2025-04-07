import { useEffect, useMemo } from "react";
import createPubSub from "../../services/pubSub/createPubSub";
import { EffectsContext } from "./EffectsContext";
import { EffectsConfig, EffectState } from "./types";
import { createEffectsEngine } from "./engine/createEffectsEngine";
import { useFormContext } from "react-hook-form";
import { useOptionsContext } from "../Options";
// import { EffectsDevtoolsPanel } from "./engine/tools/EffectsDevToolsPanel";

interface EffectsProviderProps {
  config: EffectsConfig;
  children: React.ReactNode;
}

export function EffectsProvider({ config, children }: EffectsProviderProps) {
  const { watch, ...methods } = useFormContext();
  const { getValues: getOptions } = useOptionsContext();
  const { publish, subscribe } = useMemo(() => createPubSub<EffectState>(), []);
  const toolbox = useMemo(() => ({ ...methods, publish, getOptions }), [methods, getOptions, publish]);
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