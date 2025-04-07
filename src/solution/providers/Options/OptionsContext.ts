import { createContext } from 'react';

import type { OptionsState } from './types';

export type OptionsContextProps<TState> = {
  getValues: () => Map<string, TState>;
  subscribe: (name: string, callback: (data: TState) => void) => { unsubscribe: () => void };
}

export const OptionsContext = createContext<OptionsContextProps<OptionsState>>({
  getValues: () => (new Map()),
  subscribe: () => ({ unsubscribe: () => { } }),
});
