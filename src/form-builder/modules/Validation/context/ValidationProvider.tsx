import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import { ValidationContext, ValidationContextProps } from './ValidationContext';

import { DefaultValidationManager } from '../manager/ValidationManager';
import { ValidationFactoryFn } from '../types';

interface ValidationProviderProps {
  operators: Record<string, ValidationFactoryFn>;
  children: React.ReactNode;
}

export function ValidationProvider({ operators, children }: ValidationProviderProps) {
  const methods = useFormContext();
  const manager = useMemo(() => new DefaultValidationManager(methods, operators), [methods, operators]);

  const ctxValue: ValidationContextProps = useMemo(() => ({
    compile: (rules) => manager.compile(rules),
  }), [manager]);

  return (
    <ValidationContext.Provider value={ctxValue}>
      {children}
    </ValidationContext.Provider>
  );
}
