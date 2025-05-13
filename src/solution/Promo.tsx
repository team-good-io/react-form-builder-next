import { useForm } from "react-hook-form";

interface PromoProps {
  defaultValues?: Record<string, unknown>;
  onValid(values?: Record<string, unknown>): void;
  onInvalid?(): void;
}

export function Promo({ defaultValues, onValid, onInvalid }: PromoProps) {
  const instance = useForm({ defaultValues });

  const onOptIn = () => {
    instance.setValue("withPromo", true);
    onValid?.(instance.getValues())
  }

  return (
     <form onSubmit={instance.handleSubmit(onValid, onInvalid)}>
      <h1>Promo</h1>
      <p>Some custom promo content</p>
      <button type="button" onClick={onOptIn}>Opt-in</button>
    </form>
  )
}