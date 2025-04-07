interface FieldProps {
  id?: string;
  name?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ id, name, error, children }: FieldProps) {
  return (
    <div data-field-name={name}>
      <label htmlFor={id}>{id}</label>
      <div>{children}</div>
      {error && <div><small>{error}</small></div>}
    </div>
  )
}