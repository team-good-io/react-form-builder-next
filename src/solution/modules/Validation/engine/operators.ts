import { ValidationFactoryFn } from "../types";
import { availability } from "./operators/availability";
import { email } from "./operators/email";
import { matchValue } from "./operators/matchValue";
import { notContainValue } from "./operators/notContainValue";
import { oneLetter } from "./operators/oneLetter";
import { oneNumber } from "./operators/oneNumber";
import { pattern } from "./operators/pattern";
import { range } from "./operators/range";

const simple = (fn: (value: unknown) => boolean | string): ValidationFactoryFn => () => fn;

export const operators: Record<string, ValidationFactoryFn> = {
  email: simple(email),
  availability: (_toolbox, params) => (value) => availability(value, params),
  matchValue: (toolbox, params) => (value) => matchValue(value, params, toolbox),
  range: (_toolbox, params) => (value) => range(value, params),
  oneNumber: simple(oneNumber),
  oneLetter: simple(oneLetter),
  notContainValue: (toolbox, params) => (value) => notContainValue(value, params, toolbox),
  pattern: (_toolbox, params) => (value) => pattern(value, params),
}