export interface ValidationToolbox {
  getFormValues(): Record<string, unknown>;
}

export class DefaultValidationToolbox implements ValidationToolbox {

  public readonly getFormValues: () => Record<string, unknown>;

  constructor(getFormValues: () => Record<string, unknown>) {
    this.getFormValues = getFormValues;
  }
}