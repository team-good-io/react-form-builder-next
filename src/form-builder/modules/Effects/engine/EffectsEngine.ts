import { Registry } from "../../core/Registry";
import { CommandFactory, EffectAction, EffectCondition, EffectsConfig } from "../types";
import { EvaluatorFunction } from "./EffectsEvaluatorRegistry";
import { EffectsToolbox } from "./EffectsToolbox";

interface EffectsEngine {
  run(): Promise<void>;
  observe(): void;
}

export class DefaultEffectsEngine implements EffectsEngine {
  private readonly config: EffectsConfig;

  private readonly toolbox: EffectsToolbox;

  private readonly evaluators: Registry<EvaluatorFunction>;

  private readonly actions: Registry<CommandFactory>;

  private dependencies: string[] = [];
  private actionQueue: EffectAction[] = [];
  private flushing = false;

  constructor(
    config: EffectsConfig,
    toolbox: EffectsToolbox,
    evaluators: Registry<EvaluatorFunction>,
    actions: Registry<CommandFactory>
  ) {
    this.config = config;
    this.toolbox = toolbox;
    this.evaluators = evaluators;
    this.actions = actions;

    this.dependencies = this.getDependencies();
  }

  public async run() {
    const formValues = this.toolbox.form.getValues();

    for (const rule of this.config) {
      const allConditionsMet = await this.evaluateCondition(rule.when, formValues);
      if (allConditionsMet) {
        rule.actions.filter(this.shouldRunOnInit).forEach(this.queueAction.bind(this));
      }
    }
  }

  public observe() {
    const { unsubscribe } = this.toolbox.form.watch((values, { name }) => {
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
    return action.skipOnInit !== true;
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
      const operatorFn = this.evaluators.get(condition.operator);

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

  private async executeAction(action: EffectAction) {
    try {
      const factory = this.actions.get(action.type);
      if (!factory) {
        console.error(`Unknown action: ${JSON.stringify(action)}`);
        return;
      }
      const command = factory(this.toolbox, action);
      await command.execute();
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
    }
  };
}