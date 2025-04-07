import { FormProvider, useForm } from "react-hook-form";
import { FormConfig } from "./types";
import { Field } from "./Field";
import { OptionsProvider, EffectsProvider } from "./providers";
import { templateMap } from "./templates";

export function Form({
  template,
  meta,
  fields,
  defaultValues = {},
  optionsConfig = {},
  effectsConfig = [],
  onValid = () => {},
  onInvalid = () => {},
}: FormConfig) {
  const instance = useForm({ defaultValues });
  const Template = templateMap[template];

  return (
    <FormProvider {...instance}>
      <OptionsProvider config={optionsConfig}>
          <EffectsProvider config={effectsConfig}>
            <form onSubmit={instance.handleSubmit(onValid, onInvalid)}>
              <Template meta={meta}>
                {fields.map((field) => (
                  <Field key={field.name} {...field} />
                ))}
              </Template>
            </form>
          </EffectsProvider>
      </OptionsProvider>
    </FormProvider>
  )
}