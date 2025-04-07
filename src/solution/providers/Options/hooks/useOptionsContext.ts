import { useContext } from 'react';

import type { OptionsContextProps } from '../OptionsContext';
import { OptionsContext } from '../OptionsContext';
import type { OptionsState } from '../types';

export const useOptionsContext = (): OptionsContextProps<OptionsState> => {
  const context = useContext(OptionsContext);

  if (!context) {
    console.warn('useOptionsContext must be used within an OptionsProvider');
  }

  return context;
};
