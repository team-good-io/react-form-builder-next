import { useContext } from 'react';

import type { EffectState } from '../types';
import { EffectsContext, EffectsContextProps } from '../context/EffectsContext';

export const useEffectsContext = (): EffectsContextProps<EffectState> => {
  const context = useContext(EffectsContext);

  if (!context) {
    console.warn('useEffectsContext must be used within an EffectsProvider');
  }

  return context;
};
