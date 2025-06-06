export interface ValidationToolbox {
  getValues(): Record<string, unknown>;
}

export class DefaultValidationToolbox implements ValidationToolbox {

  private readonly getSnapshot: () => Record<string, unknown>;

  constructor(getSnapshot: () => Record<string, unknown>) {
    this.getSnapshot = getSnapshot;
  }

  public getValues(): Record<string, unknown> {
    return this.getSnapshot();
  }
}