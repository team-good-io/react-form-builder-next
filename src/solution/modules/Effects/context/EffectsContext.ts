import { createContext  } from "react";

import type { EffectState } from "../types";

export type EffectsContextProps<TState> = {
  subscribe: (name: string, callback: (data: TState) => void) => { unsubscribe: () => void };
}

export const EffectsContext = createContext<EffectsContextProps<EffectState>>({
  subscribe: () => ({ unsubscribe: () => { } }),
})