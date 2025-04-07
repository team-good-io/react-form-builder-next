import type { EffectAction, EffectCondition, EffectsConfig, EffectsToolbox } from '../types';
import { EffectEngineEvent } from './tools/EffectsDevToolsPanel';
import { deduplicateOptions } from './utils/deduplicateOptions';

/* ----------------------------------------------
 * Types & Helpers
 * ---------------------------------------------- */

type OperatorFunction = (fieldValue: unknown, conditionValue: unknown) => boolean | Promise<boolean>;
type ActionFunction = (action: EffectAction) => void;

type DevtoolsListener = (event: EffectEngineEvent) => void;

/* ----------------------------------------------
 * Engine Factory
 * ---------------------------------------------- */

export function createEffectsEngine(
  config: EffectsConfig,
  toolbox: EffectsToolbox,
  debug = false // optional debug mode
) {
  /* ----------------------------------------------
   * Internal registries
   * ---------------------------------------------- */

  const operators: Record<string, OperatorFunction> = {
    '===': (a = '', b) => a === b,
    '!==': (a = '', b) => a !== b,
    '>': (a, b) => typeof a === 'number' && a > (b as number),
    '<': (a, b) => typeof a === 'number' && a < (b as number),
    'in': (a, b) => Array.isArray(b) && b.includes(a),
    'length>': (a, b) => getLength(a) !== null && getLength(a)! > (b as number),
    'length<': (a, b) => getLength(a) !== null && getLength(a)! < (b as number),
    'length===': (a, b) => getLength(a) !== null && getLength(a)! === (b as number),
  };

  const actions: Record<string, ActionFunction> = {
    setValue: (action) => toolbox.setValue(action.target, action.value),
    resetField: (action) => toolbox.resetField(action.target),
    clearErrors: (action) => toolbox.clearErrors(action.target),
    setFieldProps: (action) => toolbox.publish(action.target, { fieldProps: action.value }),
    setValidation: (action) => toolbox.publish(action.target, { registerProps: action.schema }),
    showField: (action) => toolbox.publish(action.target, { fieldProps: { visible: true} }),
    hideField: (action) => toolbox.publish(action.target, { fieldProps: { visible: false} }),
    deduplicateOptions: (action) => deduplicateOptions(action, toolbox),
  };

  /* ----------------------------------------------
   * Devtools Hook System
   * ---------------------------------------------- */

  const devtoolsListeners = new Set<DevtoolsListener>();

  function emit(event: EffectEngineEvent) {
    if (debug) {
      log(`[EffectsEngine] Event:`, event);
    }
    devtoolsListeners.forEach(listener => listener(event));
  }

  function onDevtoolsEvent(listener: DevtoolsListener) {
    devtoolsListeners.add(listener);
    return () => devtoolsListeners.delete(listener);
  }

  /* ----------------------------------------------
   * Logger
   * ---------------------------------------------- */

  function log(message: string, ...args: unknown[]) {
    if (debug) {
      console.log(`[EffectsEngine] ${message}`, ...args);
    }
  }

  /* ----------------------------------------------
   * Utility: Get Length
   * ---------------------------------------------- */

  function getLength(value: unknown): number | null {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length;
    }
    return null;
  }

  /* ----------------------------------------------
   * Utility: Selective Init Actions
   * ---------------------------------------------- */

  function shouldRunOnInit(action: EffectAction) {
    const conditionalInitActions = ['setValue', 'resetField', 'deduplicateOptions'];
    if (conditionalInitActions.includes(action.type)) {
      return action.runOnInit ?? false;
    }
    return true;
  }
  

  /* ----------------------------------------------
   * Utility: Collect Fields (for dependencies)
   * ---------------------------------------------- */

  function collectFields(condition: EffectCondition): string[] {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND':
        case 'OR':
          return condition.conditions.flatMap(collectFields);
        case 'NOT':
          return collectFields(condition.condition);
      }
    } else {
      return [condition.field];
    }
  }

  /* ----------------------------------------------
   * Operator and Action Registration (Public API)
   * ---------------------------------------------- */

  function registerOperator(operator: string, fn: OperatorFunction) {
    operators[operator] = fn;
  }

  function registerAction(actionType: string, fn: ActionFunction) {
    actions[actionType] = fn;
  }

  /* ----------------------------------------------
   * Condition Evaluator (supports async + nested)
   * ---------------------------------------------- */

  async function evaluateCondition(condition: EffectCondition, formValues: Record<string, unknown>): Promise<boolean> {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND': {
          const results = await Promise.all(condition.conditions.map(c => evaluateCondition(c, formValues)));
          const result = results.every(Boolean);
          emit({ type: 'conditionEvaluated', condition, result });
          return result;
        }
        case 'OR': {
          const results = await Promise.all(condition.conditions.map(c => evaluateCondition(c, formValues)));
          const result = results.some(Boolean);
          emit({ type: 'conditionEvaluated', condition, result });
          return result;
        }
        case 'NOT': {
          const result = !(await evaluateCondition(condition.condition, formValues));
          emit({ type: 'conditionEvaluated', condition, result });
          return result;
        }
      }
    } else {
      const fieldValue = formValues[condition.field];
      const operatorFn = operators[condition.operator];

      if (!operatorFn) {
        log(`Unsupported operator: ${condition.operator}`);
        return false;
      }

      const result = await operatorFn(fieldValue, condition.value);
      emit({ type: 'conditionEvaluated', condition, result });
      return result;
    }
  }

  /* ----------------------------------------------
   * Action Executor (from registry)
   * ---------------------------------------------- */

  const executeAction = (action: EffectAction) => {
    emit({ type: 'executeAction', action });
    const actionFn = actions[action.type];

    if (!actionFn) {
      log(`Unknown action: ${JSON.stringify(action)}`);
      return;
    }

    log(`Executing action: ${JSON.stringify(action)}`);
    actionFn(action);
  };

  /* ----------------------------------------------
   * Action Queue (Batching for performance)
   * ---------------------------------------------- */

  let actionQueue: EffectAction[] = [];
  let flushing = false;

  function queueAction(action: EffectAction) {
    actionQueue.push(action);
    emit({ type: 'queueAction', action });

    if (!flushing) {
      flushing = true;
      queueMicrotask(() => {
        const queue = [...actionQueue];
        actionQueue = [];
        flushing = false;

        emit({ type: 'flushStart', queue });
        queue.forEach(executeAction);
        emit({ type: 'flushEnd' });
      });
    }
  }

  /* ----------------------------------------------
   * Effects Runner
   * ---------------------------------------------- */

  const runEffects = async (changedField: string) => {
    const formValues = toolbox.getValues();
    emit({ type: 'runEffectsStart', values: formValues, changedField });

    log(`Running effects for changed field: ${changedField}`);

    for (const rule of config) {
      const isRelated = collectFields(rule.when).includes(changedField);
      if (!isRelated) continue;

      const allConditionsMet = await evaluateCondition(rule.when, formValues);
      if (!allConditionsMet) continue;

      emit({ type: 'ruleMatched', ruleId: 'Todo' });
      rule.actions.forEach(queueAction);
    }
    emit({ type: 'runEffectsEnd', changedField });
  };

  /* ----------------------------------------------
   * Initializer
   * ---------------------------------------------- */

  const init = async () => {
    const formValues = toolbox.getValues();
    emit({ type: 'initStart', values: formValues });

    for (const rule of config) {
      const allConditionsMet = await evaluateCondition(rule.when, formValues);
      if (allConditionsMet) {
        rule.actions.filter(shouldRunOnInit).forEach(queueAction)

        emit({ type: 'ruleMatched', ruleId: 'Todo' });
      }
    }
    emit({ type: 'initEnd' });
  };

  /* ----------------------------------------------
   * Dependency Collector (for watchers)
   * ---------------------------------------------- */

  const getDependencies = (): string[] => {
    const dependencies = config.flatMap(rule => collectFields(rule.when));
    return Array.from(new Set(dependencies));
  };

  /* ----------------------------------------------
   * Engine Public API
   * ---------------------------------------------- */

  return {
    init,
    getDependencies,
    runEffects,
    registerOperator,
    registerAction,
    onDevtoolsEvent,
  };
}
