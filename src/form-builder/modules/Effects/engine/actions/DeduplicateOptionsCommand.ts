import { EffectAction, EffectCommand } from "../../types";
import { EffectsToolbox } from "../EffectsToolbox";

export class DeduplicateOptionsCommand implements EffectCommand {
  public readonly toolbox: EffectsToolbox;
  public readonly action: EffectAction;

  constructor(
    toolbox: EffectsToolbox,
    action: EffectAction
  ) {
    this.toolbox = toolbox;
    this.action = action;
  }

  async execute() {
    const values = this.toolbox.form.getValues();
    const options = this.toolbox.options.getOptions();

    const selectedValues = this.action.targets.map(field => values[field]).filter(Boolean);

    this.action.targets.forEach(targetField => {
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