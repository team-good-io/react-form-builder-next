interface FormStepProps {
  config?: Record<string, unknown>;
  onValid?: (values: Record<string, unknown>) => void;
  onError?: (error?: Error) => void;
}

export function FormStep(props: FormStepProps) {
  return (
    <div>Form</div>
  )
}