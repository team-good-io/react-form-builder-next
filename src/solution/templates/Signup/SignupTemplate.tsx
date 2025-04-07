import './styles.css';

interface SignupTemplateProps {
  children: React.ReactNode;
  meta?: Record<string, unknown>
}

export function SignupTemplate({ children }: SignupTemplateProps) {
  return (
    <div className="signup-tpl">
      <div className="signup-tpl__header">
        <h1>Signup</h1>
      </div>
      <div className="signup-tpl__fields">
        {children}
      </div>
      <div className="signup-tpl__footer">
        <button type="submit">Submit</button>
      </div>
    </div>
  )
}