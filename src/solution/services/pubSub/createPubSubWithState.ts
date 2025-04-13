import { deepMerge } from "../../utils";
import createPubSub from "./createPubSub";

type Callback<T> = (payload: T) => void

export interface CreatePubSubStateProps<TValue = unknown> {
  subscribe: (name: string, callback: Callback<TValue>) => { unsubscribe: () => void };
  publish: (name: string, payload: TValue) => void;
  getSnapshot: () => Map<string, TValue>;
  get: (name: string) => TValue | undefined;
}

export const createPubSubState = <TValue = unknown>(
  initialValues: Iterable<readonly [string, TValue]>,
  pubsub: ReturnType<typeof createPubSub<TValue>>,
) => {
  const state = new Map<string, TValue>(initialValues);

  const subscribe = (name: string, callback: Callback<TValue>): {
    unsubscribe: () => void;
  } => {
    if (state.has(name)) {
      callback(state.get(name)!);
    }
    return pubsub.subscribe(name, callback);
  };

  const publish = (name: string, payload: TValue): void => {
    state.set(name, payload);
    return pubsub.publish(name, payload);
  };

  const merge = (name: string, payload: Partial<TValue>): void => {
    const current = state.get(name);
    if (current) {
      const merged = deepMerge( current, payload);
      state.set(name, merged as TValue);
      pubsub.publish(name, merged as TValue);
    }
  };

  const getSnapshot = (): Map<string, TValue> => new Map(state);
  const get = (name: string): TValue | undefined => state.get(name);

  return {
    subscribe,
    publish,
    merge,
    getSnapshot,
    get,
  };
}

export const createPubSubWithState = <TValue = unknown>(
  initialValues: Iterable<readonly [string, TValue]>,
): CreatePubSubStateProps<TValue> => createPubSubState<TValue>(
  initialValues,
  createPubSub<TValue>(),
);