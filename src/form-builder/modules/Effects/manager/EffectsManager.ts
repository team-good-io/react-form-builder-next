import { ActionFunction } from "../engine/createActions";
import { OperatorFunction } from "../engine/operators";
import { EffectAction, EffectCondition, EffectsConfig, EffectsToolbox } from "../types";

export interface EffectsManager {
  init(): Promise<void>;
  observe(): void;
}

export class DefaultEffectsManager implements EffectsManager {
  private readonly config: EffectsConfig;

  private readonly toolbox: EffectsToolbox;

  private readonly operators: Record<string, OperatorFunction>;

  private readonly actions: Record<EffectAction["type"], ActionFunction>;

  private dependencies: string[] = [];
  private actionQueue: EffectAction[] = [];
  private flushing = false;

  constructor(
    config: EffectsConfig,
    toolbox: EffectsToolbox,
    operators: Record<string, OperatorFunction>,
    actions: Record<string, ActionFunction>,
  ) {
    this.config = config;
    this.toolbox = toolbox;
    this.operators = operators;
    this.actions = actions;

    this.dependencies = this.getDependencies();
  }

  public async init() {
    const formValues = this.toolbox.getValues();

    for (const rule of this.config) {
      const allConditionsMet = await this.evaluateCondition(rule.when, formValues);
      if (allConditionsMet) {
        rule.actions.filter(this.shouldRunOnInit).forEach(this.queueAction.bind(this));
      }
    }
  }

  public observe() {
    const { unsubscribe } = this.toolbox.watch((values, { name }) => {
      if (name && this.dependencies.includes(name)) {
        this.onDepsChange(name, values);
      }
    });

    return () => unsubscribe();
  }

  onDepsChange = async (changedField: string, values: Record<string, unknown>) => {
    for (const rule of this.config) {
      const isRelated = this.collectFields(rule.when).includes(changedField);
      if (!isRelated) continue;

      const allConditionsMet = await this.evaluateCondition(rule.when, values);
      if (!allConditionsMet) continue;

      rule.actions.forEach(this.queueAction.bind(this));
    }
  };

  private getDependencies(): string[] {
    return Array.from(new Set(
      this.config.flatMap(rule => this.collectFields(rule.when)),
    ));
  }

  private collectFields(condition: EffectCondition): string[] {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND':
        case 'OR':
          return condition.conditions.flatMap(this.collectFields);
        case 'NOT':
          return this.collectFields(condition.condition);
      }
    } else {
      return [condition.field];
    }
  }

  private shouldRunOnInit(action: EffectAction) {
    const conditionalInitActions = ['setValue', 'setFieldProps', 'setRegisterProps'];
    if (conditionalInitActions.includes(action.type)) {
      return action.runOnInit;
    }
    return true;
  }

  private async evaluateCondition(condition: EffectCondition, formValues: Record<string, unknown>): Promise<boolean> {
    if ('type' in condition) {
      switch (condition.type) {
        case 'AND': {
          const results = await Promise.all(condition.conditions.map(c => this.evaluateCondition(c, formValues)));
          const result = results.every(Boolean);
          return result;
        }
        case 'OR': {
          const results = await Promise.all(condition.conditions.map(c => this.evaluateCondition(c, formValues)));
          const result = results.some(Boolean);
          return result;
        }
        case 'NOT': {
          const result = !(await this.evaluateCondition(condition.condition, formValues));
          return result;
        }
      }
    } else {
      const fieldValue = formValues[condition.field];
      const operatorFn = this.operators[condition.operator];

      if (!operatorFn) {
        console.error(`Unsupported operator: ${condition.operator}`);
        return false;
      }

      const result = await operatorFn(fieldValue, condition.value);
      return result;
    }
  }

  private queueAction(action: EffectAction) {
    this.actionQueue.push(action);

    if (!this.flushing) {
      this.flushing = true;
      queueMicrotask(() => {
        const queue = [...this.actionQueue];
        this.actionQueue = [];
        this.flushing = false;
        queue.forEach(this.executeAction.bind(this));
      });
    }
  }

  private executeAction(action: EffectAction) {
    const actionFn = this.actions[action.type];
    if (!actionFn) {
      console.error(`Unknown action: ${JSON.stringify(action)}`);
      return;
    }
    actionFn(action);
  };
}