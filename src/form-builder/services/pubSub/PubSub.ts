type Callback<T> = (payload: T) => void;

export interface PubSubProps<TValue = unknown> {
  subscribe(name: string, callback: Callback<TValue>): { unsubscribe: () => void };
  publish(name: string, payload: TValue): void;
}

export class PubSub<TValue = unknown> implements PubSubProps<TValue> {
  private subscribers = new Map<string, Set<Callback<TValue>>>();

  subscribe(name: string, callback: Callback<TValue>): { unsubscribe: () => void } {
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, new Set());
    }

    const callbacks = this.subscribers.get(name)!;
    callbacks.add(callback);

    return {
      unsubscribe: () => {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(name);
        }
      },
    };
  }

  publish(name: string, payload: TValue): void {
    const callbacks = this.subscribers.get(name);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(payload);
      }
    }
  }
}
