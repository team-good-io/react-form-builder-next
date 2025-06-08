interface BonusStepProps {
  config?: Record<string, unknown>;
  onValid?: (values: Record<string, unknown>) => void;
  onError?: (error?: Error) => void;
}

export function BonusStep(props: BonusStepProps) {
  return (
    <div>Bonus</div>
  )
}