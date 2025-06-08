interface DefaultTemplateProps {
  config?: Record<string, unknown>;
  children: React.ReactNode;
}

export function DefaultTemplate({ children }: DefaultTemplateProps) {
  return (
    <div>
      <h1>Default template</h1>
      {children}
      <button type="submit">Submit</button>
    </div>
  )
}