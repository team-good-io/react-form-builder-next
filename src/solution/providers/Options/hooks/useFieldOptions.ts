import { useEffect, useState } from 'react';

import type { OptionsState } from '../types';

import { useOptionsContext } from './useOptionsContext';

export const useFieldOptions = (name: string): OptionsState => {
  const { subscribe } = useOptionsContext();
  const [state, setState] = useState<OptionsState>({ loading: false });

  useEffect(() => {
    const subscription = subscribe(name, setState);
    return () => subscription.unsubscribe();
  }, [name, subscribe]);

  return state;
};
