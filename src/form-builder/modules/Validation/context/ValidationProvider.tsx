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
  const validationManager = useMemo(
    () => new DefaultValidationManager(methods, registry),
    [methods, registry]
  );

  const validationContextValue: ValidationContextProps = useMemo(() => ({
    compile: (rules) => validationManager.compile(rules),
  }), [validationManager]);

  return (
    <ValidationContext.Provider value={validationContextValue}>
      {children}
    </ValidationContext.Provider>
  );
}
