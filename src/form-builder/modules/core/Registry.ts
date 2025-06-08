export class Registry<T> {
  private registry: Map<string, T> = new Map();

  register(name: string, item: T, override = false): void {
    if (!override && this.registry.has(name)) {
      console.error(`Item with name "${name}" is already registered. Use 'override' to replace it.`);
      return;
    }
    this.registry.set(name, item);
  }

  get(name: string): T | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }

  list(): string[] {
    return Array.from(this.registry.keys());
  }
}
