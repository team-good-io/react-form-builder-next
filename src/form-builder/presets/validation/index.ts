import { ValidationFactoryFn } from "../../modules/Validation";
import { availability } from "./operators/availability";
import { email } from "./operators/email";
import { matchValue } from "./operators/matchValue";
import { notContainValue } from "./operators/notContainValue";
import { oneLetter } from "./operators/oneLetter";
import { oneNumber } from "./operators/oneNumber";
import { pattern } from "./operators/pattern";
import { range } from "./operators/range";

const simple = (fn: (value: unknown) => boolean | string): ValidationFactoryFn => () => fn;

export const validationOperators: Record<string, ValidationFactoryFn> = {
  availability: (_toolbox, params) => (value) => availability(value, params),
  email: simple(email),
  matchValue: (toolbox, params) => (value) => matchValue(value, params, toolbox),
  notContainValue: (toolbox, params) => (value) => notContainValue(value, params, toolbox),
  oneLetter: simple(oneLetter),
  oneNumber: simple(oneNumber),
  pattern: (_toolbox, params) => (value) => pattern(value, params),
  range: (_toolbox, params) => (value) => range(value, params),
}