type Callback<T> = (payload: T) => void

export interface CreatePubSubProps<TValue = unknown> {
  subscribe: (name: string, callback: Callback<TValue>) => { unsubscribe: () => void };
  publish: (name: string, payload: TValue) => void;
}

function createPubSub<TValue = unknown>(): CreatePubSubProps<TValue> {
  const subscribers = new Map<string, Set<Callback<TValue>>>();

  const subscribe = (name: string, callback: Callback<TValue>): {
    unsubscribe: () => void;
  } => {
    if (!subscribers.has(name)) {
      subscribers.set(name, new Set());
    }
    const callbacks = subscribers.get(name)!;
    callbacks.add(callback);

    return {
      unsubscribe: () => {
        if (callbacks.has(callback)) {
          callbacks.delete(callback);

          if (callbacks.size === 0) {
            subscribers.delete(name);
          }
        }
      },
    };
  };

  const publish = (name: string, payload: TValue): void => {
    const callbacks = subscribers.get(name);
    if (callbacks) {
      callbacks.forEach((callback) => callback(payload));
    }
  };

  return {
    subscribe,
    publish,
  };
}

export default createPubSub;
