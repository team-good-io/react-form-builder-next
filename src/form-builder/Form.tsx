import { FormProvider, useForm } from "react-hook-form";
import { FormConfig } from "./types";
import { Field } from "./Field";
import { ValidationProvider } from "./modules/Validation";
import { OptionsProvider} from "./modules/Options";
import { EffectsProvider } from "./modules/Effects";
import { DefaultTemplate } from "./templates/Default/DefaultTemplate";

export function Form({
  template,
  templateConfig = {},
  fields,
  defaultValues = {},
  optionsConfig = {},
  effectsConfig = [],
  onValid = () => {},
  onInvalid = () => {},
}: FormConfig) {
  const instance = useForm({ defaultValues });
  const TemplateComponent = template || DefaultTemplate;

  return (
    <FormProvider {...instance}>
      <OptionsProvider config={optionsConfig}>
          <EffectsProvider config={effectsConfig}>
            <ValidationProvider>
              <form onSubmit={instance.handleSubmit(onValid, onInvalid)}>
                <TemplateComponent config={templateConfig}>
                  {fields.map((field) => (
                    <Field key={field.name} {...field} />
                  ))}
                </TemplateComponent>
              </form>
            </ValidationProvider>
          </EffectsProvider>
      </OptionsProvider>
    </FormProvider>
  )
}