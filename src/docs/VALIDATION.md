# ✅ Validation Module
✅ Validation Module
The Validation module provides a clean, config-driven interface for attaching both synchronous and asynchronous custom validations to form fields. It is built to work seamlessly with react-hook-form and promotes reusability, dynamic evaluation, and extensibility.

## Key Concepts
* Declarative validation rule configuration
* Extensible set of validation operators
* Composable rules via compile()
* React hooks for seamless integration

## Configuration
Validation rules are defined using a compact tuple format:
```ts
type ValidationRuleConfig =
  | [fn: string]
  | [fn: string, params: Record<string, unknown>];
```
Examples:
```ts
['email']
['range', { min: 3, max: 10 }]
['matchValue', { field: 'password' }]
```

## Example Rule Array
```ts
const rules: ValidationRuleConfig[] = [
  ['email'],
  ['range', { min: 5, max: 20 }],
  ['notContainValue', { field: 'username' }],
];
```

## Engine Design
### `createValidationEngine`
Compiles your rule array into validation functions using provided operators:
```ts
const { compile } = createValidationEngine(toolbox, operators);
const compiledRules = compile(rules);
```
returns:
```ts
{
  email: (value) => boolean | string,
  range: (value) => boolean | string,
}
```

## Operators
| Operator          | Description                                  |
| ----------------- | -------------------------------------------- |
| `email`           | Validates email format                       |
| `range`           | Min/max range for number or string length    |
| `oneNumber`       | Requires at least one numeric character      |
| `oneLetter`       | Requires at least one alphabetical character |
| `pattern`         | Validates regex pattern                      |
| `availability`    | Async check for availability (e.g. username) |
| `matchValue`      | Match value of another field                 |
| `notContainValue` | Value must not contain another field’s value |

## Integration
### `ValidationProvider`
Injects the validation engine into your form context:
```tsx
<ValidationProvider>
  <FormProvider {...methods}>
    <MyForm />
  </FormProvider>
</ValidationProvider>
```

### `useValidation(rules)`
Compiles and returns validation functions for your field:
```ts
const rules: ValidationRuleConfig[] = [['range', { min: 5, max: 15 }]];
const validate = useValidation(rules);
```
Use in a field:
```tsx
<input {...register('username', { validate })} />
```