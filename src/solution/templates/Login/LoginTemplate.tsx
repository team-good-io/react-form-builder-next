interface LoginTemplateProps {
  children: React.ReactNode;
}

export function LoginTemplate({ children }: LoginTemplateProps) {
  return (
    <div>
      <h1>Login</h1>
      {children}
      <button type="submit">Submit</button>
    </div>
  )
}