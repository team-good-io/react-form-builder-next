import { useContext } from 'react';

import type { EffectsContextProps } from '../EffectsContext';
import { EffectsContext } from '../EffectsContext';
import type { EffectState } from '../types';

export const useEffectsContext = (): EffectsContextProps<EffectState> => {
  const context = useContext(EffectsContext);

  if (!context) {
    console.warn('useEffectsContext must be used within an EffectsProvider');
  }

  return context;
};
