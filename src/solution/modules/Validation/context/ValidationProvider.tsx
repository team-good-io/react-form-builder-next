import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import { createValidationEngine } from '../engine/createValidationEngine';
import { operators } from '../engine/operators';
import { ValidationContext } from './ValidationContext';

interface ValidationProviderProps {
  children: React.ReactNode;
}

export function ValidationProvider({ children }: ValidationProviderProps) {
  const methods = useFormContext();
  const validation = useMemo(() => createValidationEngine(methods, operators), [methods]);

  return (
    <ValidationContext.Provider value={validation}>
      {children}
    </ValidationContext.Provider>
  );
}
