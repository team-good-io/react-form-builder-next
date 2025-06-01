import { useEffect, useState } from 'react';

import type { EffectState } from '../types';

import { useEffectsContext } from './useEffectsContext';

export const useFieldEffects = (name: string): EffectState => {
  const { subscribe } = useEffectsContext();
  const [state, setState] = useState<EffectState>({});

  useEffect(() => {
    const subscription = subscribe(name, setState);
    return () => subscription.unsubscribe();
  }, [name, subscribe]);

  return state;
};
