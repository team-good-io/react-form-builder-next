export type EvaluatorFunction = (fieldValue: unknown, conditionValue: unknown) => boolean | Promise<boolean>;

function getLength(value: unknown): number | null {
  if (typeof value === "string" || Array.isArray(value)) return value.length;
  return null;
}

export class EffectEvaluatorRegistry {
  private registry: Map<string, EvaluatorFunction> = new Map();

  register(name: string, fn: EvaluatorFunction, override = false): void {
    if (!override && this.registry.has(name)) {
      console.error(`Evaluator "${name}" already registered. Use 'override' to replace.`);
      return;
    }
    this.registry.set(name, fn);
  }

  get(name: string): EvaluatorFunction | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }
}

export class DefaultEffectEvaluatorRegistry extends EffectEvaluatorRegistry {
  constructor(customEvaluators: Record<string, EvaluatorFunction> = {}) {
    super();
    this.registerDefaults();
    this.registerCustomEvaluators(customEvaluators);
  }

  private registerDefaults(): void {
    this.register("===", (a = "", b) => a === b);
    this.register("!==", (a = "", b) => a !== b);
    this.register(">", (a, b) => typeof a === "number" && a > (b as number));
    this.register("<", (a, b) => typeof a === "number" && a < (b as number));
    this.register("in", (a, b) => Array.isArray(b) && b.includes(a));
    this.register("length>", (a, b) => getLength(a) !== null && getLength(a)! > (b as number));
    this.register("length<", (a, b) => getLength(a) !== null && getLength(a)! < (b as number));
    this.register("length===", (a, b) => getLength(a) !== null && getLength(a)! === (b as number));
  }

  private registerCustomEvaluators(custom: Record<string, EvaluatorFunction>): void {
    for (const [name, fn] of Object.entries(custom)) {
      this.register(name, fn);
    }
  }
}
