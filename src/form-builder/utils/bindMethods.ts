export function bindMethods<T extends object>(instance: T): T {
  const proto = Object.getPrototypeOf(instance) as Record<string, unknown>;

  const methodNames = Object.getOwnPropertyNames(proto)
    .filter((key) => typeof proto[key] === 'function' && key !== 'constructor');

  for (const key of methodNames) {
    const fn = proto[key];
    if (typeof fn === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any)[key] = fn.bind(instance);
    }
  }

  return instance;
}
