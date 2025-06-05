import { deepMerge } from "../../utils";
import { PubSub } from "./PubSub";

type Callback<T> = (payload: T) => void;

export interface PubSubStateProps<TValue = unknown> {
  subscribe(name: string, callback: Callback<TValue>): { unsubscribe: () => void };
  publish(name: string, payload: TValue): void;
  getSnapshot(): Map<string, TValue>;
  get(name: string): TValue | undefined;
  merge(name: string, payload: Partial<TValue>): void;
}

export class PubSubState<TValue = unknown> implements PubSubStateProps<TValue> {
  private state: Map<string, TValue>;
  private pubsub: PubSub<TValue>;

  constructor(initialValues: Iterable<readonly [string, TValue]> = [], pubsub?: PubSub<TValue>) {
    this.state = new Map(initialValues);
    this.pubsub = pubsub ?? new PubSub<TValue>();
  }

  subscribe(name: string, callback: Callback<TValue>): { unsubscribe: () => void } {
    if (this.state.has(name)) {
      callback(this.state.get(name)!);
    }
    return this.pubsub.subscribe(name, callback);
  }

  publish(name: string, payload: TValue): void {
    this.state.set(name, payload);
    this.pubsub.publish(name, payload);
  }

  merge(name: string, payload: Partial<TValue>): void {
    const current = this.state.get(name);
    if (!current) {
      this.publish(name, payload as TValue);
      return;
    }
    const merged = deepMerge(current, payload);
    this.state.set(name, merged as TValue);
    this.pubsub.publish(name, merged as TValue);
  }

  getSnapshot(): Map<string, TValue> {
    return new Map(this.state);
  }

  get(name: string): TValue | undefined {
    return this.state.get(name);
  }
}
