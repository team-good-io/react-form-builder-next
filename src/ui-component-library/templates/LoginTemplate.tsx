interface LoginTemplateProps {
  config?: Record<string, unknown>;
  children: React.ReactNode;
}

export function LoginTemplate({ children}: LoginTemplateProps) {
  return (
    <div>
      <h1>Login Form</h1>
      {children}
      <button type="submit">Login</button>
      <button type="button">Forgot password</button>
    </div>
  )
}