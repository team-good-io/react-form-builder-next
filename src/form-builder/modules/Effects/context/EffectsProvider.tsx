import { useEffect, useMemo } from "react";
import { CommandFactory, EffectsConfig, EffectState } from "../types";
import { DefaultEffectsToolbox } from "../engine/EffectsToolbox";
import { useFormContext } from "react-hook-form";
import { bindMethods } from "../../../utils/bindMethods";
import { PubSubState } from "../../../services/pubSub/PubSubState";
import { useOptionsContext } from "../../Options";
import { EffectsContext, EffectsContextProps } from "./EffectsContext";
import { DefaultEffectsActionsRegistry } from "../engine/EffectsActionsRegistry";
import { DefaultEffectEvaluatorRegistry, EvaluatorFunction } from "../engine/EffectsEvaluatorRegistry";
import { DefaultEffectsEngine } from "../engine/EffectsEngine";

interface EffectsProviderProps {
  config: EffectsConfig;
  customEvaluators?: Record<string, EvaluatorFunction>;
  customActions?: Record<string, CommandFactory>;
  children: React.ReactNode;
}

export function EffectsProvider({ config, customEvaluators, customActions, children }: EffectsProviderProps) {
  const methods = useFormContext();
  const { getSnapshot: getOptions } = useOptionsContext();
  const pubsub = useMemo(
    () => bindMethods(new PubSubState<EffectState>(new Map())),
    []
  );
  const toolbox = useMemo(
    () => new DefaultEffectsToolbox(methods, { getOptions }, pubsub),
    [getOptions, methods, pubsub]
  );
  const evaluators = useMemo(
    () => new DefaultEffectEvaluatorRegistry(customEvaluators),
    [customEvaluators]
  );
  const actions = useMemo(
    () => new DefaultEffectsActionsRegistry(customActions),
    [customActions]
  );
  const engine = useMemo(
    () => new DefaultEffectsEngine(config, toolbox, evaluators, actions),
    [config, toolbox, evaluators, actions]
  );

  useEffect(() => {
    engine.run();
    const unobserve = engine.observe();
    return () => unobserve();
  }, [engine]);

  const ctxValue: EffectsContextProps<EffectState> = useMemo(
    () => ({ subscribe: pubsub.subscribe }),
    [pubsub]
  );

  return (
    <EffectsContext.Provider value={ctxValue}>
      {children}
    </EffectsContext.Provider>
  )
}