import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import { ValidationContext, ValidationContextProps } from './ValidationContext';

import { DefaultValidationEngine } from '../engine/ValidationEngine';
import { ValidationFactoryFn } from '../types';

interface ValidationProviderProps {
  operators: Record<string, ValidationFactoryFn>;
  children: React.ReactNode;
}

export function ValidationProvider({ operators, children }: ValidationProviderProps) {
  const methods = useFormContext();
  const engine = useMemo(() => new DefaultValidationEngine(methods, operators), [methods, operators]);

  const ctxValue: ValidationContextProps = useMemo(() => ({
    compile: (rules) => engine.compile(rules),
  }), [engine]);

  return (
    <ValidationContext.Provider value={ctxValue}>
      {children}
    </ValidationContext.Provider>
  );
}
