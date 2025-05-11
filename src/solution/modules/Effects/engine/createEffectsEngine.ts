import { EffectAction, EffectCondition, EffectsConfig, EffectsToolbox } from "../types";
import { ActionFunction } from "./createActions";
import { OperatorFunction } from "./operators";

export function createEffectsEngine(
  config: EffectsConfig,
  toolbox: EffectsToolbox,
  operators: Record<string, OperatorFunction>,
  actions: Record<string, ActionFunction>,
) {
  // Utility: Selective Init Actions

  function shouldRunOnInit(action: EffectAction) {
    const conditionalInitActions = ['setValue', 'setFieldProps', 'setRegisterProps'];
    if (conditionalInitActions.includes(action.type)) {
      return action.runOnInit;
    }
    return true;
  }

  // Ulitity: Collect Fields (for dependencies)

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

  // Condition Evaluator (supports async + nested)

  async function evaluateCondition(condition: EffectCondition, formValues: Record<string, unknown>): Promise<boolean> {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND': {
          const results = await Promise.all(condition.conditions.map(c => evaluateCondition(c, formValues)));
          const result = results.every(Boolean);
          return result;
        }
        case 'OR': {
          const results = await Promise.all(condition.conditions.map(c => evaluateCondition(c, formValues)));
          const result = results.some(Boolean);
          return result;
        }
        case 'NOT': {
          const result = !(await evaluateCondition(condition.condition, formValues));
          return result;
        }
      }
    } else {
      const fieldValue = formValues[condition.field];
      const operatorFn = operators[condition.operator];

      if (!operatorFn) {
        console.error(`Unsupported operator: ${condition.operator}`);
        return false;
      }

      const result = await operatorFn(fieldValue, condition.value);
      return result;
    }
  }

  // Action Executor

  const executeAction = (action: EffectAction) => {
    const actionFn = actions[action.type];
    if (!actionFn) {
      console.error(`Unknown action: ${JSON.stringify(action)}`);
      return;
    }
    actionFn(action);
  };

  // Queue action

  let actionQueue: EffectAction[] = [];
  let flushing = false;

  function queueAction(action: EffectAction) {
    actionQueue.push(action);

    if (!flushing) {
      flushing = true;
      queueMicrotask(() => {
        const queue = [...actionQueue];
        actionQueue = [];
        flushing = false;
        queue.forEach(executeAction);
      });
    }
  }

  // Init function

  const init = async () => {
    const formValues = toolbox.getValues();

    for (const rule of config) {
      const allConditionsMet = await evaluateCondition(rule.when, formValues);
      if (allConditionsMet) {
        rule.actions.filter(shouldRunOnInit).forEach(queueAction);
      }
    }
  }

  // Run effects

  const runEffects = async (changedField: string) => {
    const formValues = toolbox.getValues();

    for (const rule of config) {
      const isRelated = collectFields(rule.when).includes(changedField);
      if (!isRelated) continue;

      const allConditionsMet = await evaluateCondition(rule.when, formValues);
      if (!allConditionsMet) continue;

      rule.actions.forEach(queueAction);
    }
  };

  // Dependency collector (for broadcasting changes)

  const getDependencies = (): string[] => {
    const dependencies = config.flatMap(rule => collectFields(rule.when));
    return Array.from(new Set(dependencies));
  };

  return {
    init,
    getDependencies,
    runEffects,
  }
}