interface MultiFormTemplateProps {
  children: React.ReactNode;
  meta?: Record<string, unknown>;
}

export function MultiFormTemplate({ children, meta }: MultiFormTemplateProps) {
  const activeStepIndex = meta?.activeStepIndex;
  const isFirstStep = meta?.isFirstStep;
  const isLastStep = meta?.isLastStep;
  const onPrevStep = meta?.onPrevStep as () => void;

  console.log(onPrevStep)
  return (
    <div className="multiform-tpl">
      <div className="signup-tpl__fields">
        {children}
      </div>
      <div className="signup-tpl__footer">
        {!isFirstStep && <button type="button" onClick={() => onPrevStep?.()}>Previous</button>}
        <button type="submit">Submit</button>
      </div>
    </div>
  )
}