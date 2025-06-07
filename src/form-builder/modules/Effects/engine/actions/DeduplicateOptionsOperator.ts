import { EffectAction, EffectOperator } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class DeduplicateOptionsOperator implements EffectOperator {
  public readonly toolbox: EffectsToolbox;

  constructor(toolbox: EffectsToolbox) {
    this.toolbox = toolbox;
  }

  async execute(action: EffectAction) {
    const values = this.toolbox.form.getValues();
    const options = this.toolbox.options.getOptions();

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

      this.toolbox.state.publish(targetField, { options: updatedOptions });

      // Validate if current value is still valid
      const currentValue = values[targetField];
      const isValid = updatedOptions.data.some(option => option.value === currentValue);

      if (!isValid && currentValue !== undefined && currentValue !== '') {
        this.toolbox.form.setValue(targetField, '');
        this.toolbox.form.clearErrors(targetField);
      }
    });
  }
}