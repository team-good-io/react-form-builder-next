import { FormProvider, useForm } from "react-hook-form";
import { FormConfig } from "./types";
import { Field } from "./Field";
import { OptionsProvider, EffectsProvider, ValidationProvider } from "./providers";
import { templateMap } from "./templates";

export function Form({
  template,
  fields,
  defaultValues = {},
  optionsConfig = {},
  effectsConfig = [],
  validationConfig = {},
  onValid = () => {},
  onInvalid = () => {},
}: FormConfig) {
  const instance = useForm({ defaultValues });
  const Template = templateMap[template.name];

  return (
    <FormProvider {...instance}>
      <OptionsProvider config={optionsConfig}>
          <EffectsProvider config={effectsConfig}>
            <ValidationProvider config={validationConfig}>
              <form onSubmit={instance.handleSubmit(onValid, onInvalid)}>
                <Template meta={template.params}>
                  {fields.map((field) => (
                    <Field key={field.name} {...field} />
                  ))}
                </Template>
              </form>
            </ValidationProvider>
          </EffectsProvider>
      </OptionsProvider>
    </FormProvider>
  )
}