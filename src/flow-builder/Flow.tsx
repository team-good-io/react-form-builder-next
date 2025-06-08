import { useState } from "react";

interface FlowProps {
  config: {
    steps: Array<{
      name: string;
      component: React.ComponentType<unknown>;
      config: Record<string, unknown>;
    }>;
  };
}

export function Flow({ config }: FlowProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);


  const StepComponent = config.steps[activeStepIndex]?.component;

  if (!StepComponent) {
    return null
  }

  return (
    <StepComponent />
  )
}