import { useContext } from 'react';


import type { OptionsState } from '../types';
import { OptionsContext, OptionsContextProps } from '../context/OptionsContext';

export const useOptionsContext = (): OptionsContextProps<OptionsState> => {
  const context = useContext(OptionsContext);

  if (!context) {
    console.warn('useOptionsContext must be used within an OptionsProvider');
  }

  return context;
};
