import { createContext } from "react";
import { OptionsState } from "../types";

export type OptionsContextProps<TState> = {
  getSnapshot: () => Map<string, TState>;
  subscribe: (name: string, callback: (data: TState) => void) => { unsubscribe: () => void };
}

export const OptionsContext = createContext<OptionsContextProps<OptionsState>>({
  getSnapshot: () => (new Map()),
  subscribe: () => ({ unsubscribe: () => { } }),
});
