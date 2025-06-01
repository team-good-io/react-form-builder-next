import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import { ValidationContext, ValidationContextProps } from './ValidationContext';

import { DefaultValidationManager } from '../manager/ValidationManager';
import { ValidationOperatorRegistry } from '../manager/ValidationOperatorRegistry';

interface ValidationProviderProps {
  registry: ValidationOperatorRegistry;
  children: React.ReactNode;
}

export function ValidationProvider({ registry, children }: ValidationProviderProps) {
  const methods = useFormContext();
  const manager = useMemo(() => new DefaultValidationManager(methods, registry), [methods, registry]);

  const ctxValue: ValidationContextProps = useMemo(() => ({
    compile: (rules) => manager.compile(rules),
  }), [manager]);

  return (
    <ValidationContext.Provider value={ctxValue}>
      {children}
    </ValidationContext.Provider>
  );
}
