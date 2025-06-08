interface SignupTemplateProps {
  config?: Record<string, unknown>;
  children: React.ReactNode;
}

export function SignupTemplate({ children}: SignupTemplateProps) {
  return (
    <div>
      <h1>Signup Form</h1>
      {children}
      <button type="submit">Submit</button>
    </div>
  )
}