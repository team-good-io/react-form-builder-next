import createPubSub from './createPubSub';

type Callback<T> = (payload: T) => void

export interface CreatePubSubCacheProps<TValue = unknown> {
  subscribe: (name: string, callback: Callback<TValue>) => { unsubscribe: () => void };
  publish: (name: string, payload: TValue) => void;
  getValues: () => Map<string, TValue>;
}

export const createPubSubCache = <TValue = unknown>(
  initialValues: Iterable<readonly [string, TValue]>,
  pubsub: ReturnType<typeof createPubSub<TValue>>,
): CreatePubSubCacheProps<TValue> => {
  const cache = new Map<string, TValue>(initialValues);

  const subscribe = (name: string, callback: Callback<TValue>): {
    unsubscribe: () => void;
  } => {
    if (cache.has(name)) {
      callback(cache.get(name)!);
    }
    return pubsub.subscribe(name, callback);
  };

  const publish = (name: string, payload: TValue): void => {
    cache.set(name, payload);
    return pubsub.publish(name, payload);
  };

  const getValues = (): Map<string, TValue> => new Map(cache);

  return {
    subscribe,
    publish,
    getValues,
  };
};

export const createPubSubWithCache = <TValue = unknown>(
  initialValues: Iterable<readonly [string, TValue]>,
): CreatePubSubCacheProps<TValue> => createPubSubCache<TValue>(
  initialValues,
  createPubSub<TValue>(),
);
