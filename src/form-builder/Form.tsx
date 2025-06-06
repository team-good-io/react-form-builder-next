import { FormProvider, useForm } from "react-hook-form";
import { FormConfig } from "./types";
import { Field } from "./Field";
import { templateMap } from "./templates";
import { ValidationProvider } from "./modules/Validation";
import { OptionsProvider} from "./modules/Options";
import { EffectsProvider } from "./modules/Effects";

export function Form({
  template,
  fields,
  defaultValues = {},
  optionsConfig = {},
  effectsConfig = [],
  validationOperators = {},
  onValid = () => {},
  onInvalid = () => {},
}: FormConfig) {
  const instance = useForm({ defaultValues });
  const Template = templateMap[template.name];

  return (
    <FormProvider {...instance}>
      <OptionsProvider config={optionsConfig}>
          <EffectsProvider config={effectsConfig}>
            <ValidationProvider customOperators={validationOperators}>
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