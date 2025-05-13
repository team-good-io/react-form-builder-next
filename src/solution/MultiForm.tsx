
import { FormConfig } from "./types";
import { act, useCallback, useMemo, useState } from "react";
import { Form } from "./Form";
import { Promo } from "./Promo";

export interface MultiFormProps {
  defaultValues?: Record<string, unknown>;
  steps: FormConfig[];
  onValid?: (values: Record<string, unknown>) => void;
}

export function MultiForm({
  defaultValues = {},
  steps,
  onValid
}: MultiFormProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, unknown>>(defaultValues);

  const activeStep = useMemo(
    () => steps[activeStepIndex],
    [activeStepIndex, steps],
  );
  const isLastStep = useMemo(
    () => (activeStepIndex === steps.length - 1),
    [activeStepIndex, steps.length],
  );

  const goNextStep = (): void => {
    setActiveStepIndex((index) => {
      const newValue = index + 1
      return newValue;
    });
  };

  const goPrevStep = (): void => {
    setActiveStepIndex((index) => {
      const newValue = index - 1;
      return newValue;
    });
  };


  const handleNextStep = (stepValues: Record<string, unknown>): void => {
    const newValues = { ...values, ...stepValues };
    setValues(newValues);

    if (isLastStep) {
      onValid?.(newValues);
    } else {
      goNextStep();
    }
  };

  const handlePrevStep = useCallback((stepValues: Record<string, unknown>): void => {
    const newValues = { ...values, ...stepValues };
    setValues(newValues);
    goPrevStep();
  }, [values]);

  const stepTemplate = useMemo(() => ({
    name: activeStep.template.name,
    params: {
      ...activeStep.template.params,
      activeStepIndex,
      isFirstStep: activeStepIndex === 0,
      isLastStep,
      onPrevStep: handlePrevStep,
    }
  }), [activeStep, activeStepIndex, isLastStep, handlePrevStep]);

  if (!activeStep) {
    return null;
  }

  if(activeStep.type === "promo") {
    return (
      <Promo onValid={handleNextStep} />
    )
  }

  return (
    <Form
      key={activeStepIndex}
      defaultValues={values}
      optionsConfig={activeStep.optionsConfig}
      effectsConfig={activeStep.effectsConfig}
      onValid={handleNextStep}
      template={stepTemplate}
      fields={activeStep.fields}
    />
  )
}