import { EffectsToolbox } from "../../types";

export function deduplicateOptions(
  action: { type: 'deduplicateOptions'; targets: string[]; skipOnInit?: boolean },
  toolbox: EffectsToolbox,
) {
  const values = toolbox.getValues();
  const options = toolbox.getOptions();

  const selectedValues = action.targets.map(field => values[field]).filter(Boolean);

  action.targets.forEach(targetField => {
    const fieldOptions = options.get(targetField);

    if (!fieldOptions || !fieldOptions.data) {
      return;
    }

    // Exclude selected values from other fields
    const optionsToExclude = selectedValues.filter(val => val !== values[targetField]);

    const updatedOptions = {
      ...fieldOptions,
      data: fieldOptions.data.filter(option => !optionsToExclude.includes(option.value))
    };

    toolbox.publish(targetField, { options: updatedOptions });

    // Validate if current value is still valid
    const currentValue = values[targetField];
    const isValid = updatedOptions.data.some(option => option.value === currentValue);

    if (!isValid && currentValue !== undefined && currentValue !== '') {
      toolbox.setValue(targetField, '');
      toolbox.clearErrors(targetField);
    }
  });
}