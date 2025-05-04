import { ValidationFactoryFn } from "../../types";
import { availability } from "./availability";
import { email } from "./email";
import { matchValue } from "./matchValue";
import { notContainValue } from "./notContainValue";
import { oneLetter } from "./oneLetter";
import { oneNumber } from "./oneNumber";
import { pattern } from "./pattern";
import { range } from "./range";

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