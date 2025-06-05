# ⚡ Effects Module

The Effects module is a configuration-driven system that enables reactive behavior in your forms based on form state. It allows you to declaratively define rules that conditionally trigger actions such as setting values, hiding fields, or modifying options — all based on user input.

## Features

- Condition-based rule engine
- Supports logical operators (AND, OR, NOT)
- Rich actions: show/hide, reset, set value, deduplicate options, and more
- Executes on form changes and/or initialization
- Built on top of a reactive PubSub + Context architecture

## Configuration: `EffectRule[]`

Each rule has:
- when: condition(s) to evaluate
- actions: actions to execute if condition is true

```ts
type EffectRule = {
  id?: string;
  when: EffectCondition;
  actions: EffectAction[];
};
```

## Conditions
### Simple Conditions
```ts
{
  field: 'age',
  operator: '>',
  value: 18
}
```
#### Supported operators:
* `===`, `!==`, `>`, `<`, `in`
* `length>`, `length<`, `length===`

### Composite Conditions
```ts
{ type: 'AND', conditions: [/* EffectCondition[] */] }
{ type: 'OR', conditions: [/* EffectCondition[] */] }
{ type: 'NOT', condition: /* EffectCondition */ }
```
These can be nested as deeply as needed.

## Actions
| Type                 | Description                          |
| -------------------- | ------------------------------------ |
| `setValue`           | Set value of a field                 |
| `resetField`         | Clear the value and error of a field |
| `clearErrors`        | Clear field validation errors        |
| `showField`          | Make field visible (`hidden: false`) |
| `hideField`          | Hide field (`hidden: true`)          |
| `setFieldProps`      | Inject UI-level props into field     |
| `setRegisterProps`   | Inject props into RHF's `register()` |
| `deduplicateOptions` | De-duplicate options across fields   |

```ts
{ type: 'setValue', target: 'country', value: 'us', skipOnInit: true }
{ type: 'hideField', target: 'ssn' }
{ type: 'deduplicateOptions', targets: ['optionA', 'optionB'] }
```

## Lifecycle & Execution

* On Init: Executes actions, skip actions marked with `skipOnInit: true`
* On Dependency Change: Automatically reevaluates rules and executes matching actions

## Engine Behavior
### Internally:
* Collects all dependent fields (getDependencies)
* Evaluates rules when dependencies change (runEffects)
* Uses microtask-based action queue to batch executions

## Example Rule
```ts
{
  when: {
    type: 'AND',
    conditions: [
      { field: 'country', operator: '===', value: 'us' },
      { field: 'age', operator: '>', value: 21 }
    ]
  },
  actions: [
    { type: 'showField', target: 'ssn' },
    { type: 'setRegisterProps', target: 'ssn', value: { required: true } }
  ]
}
```

## Integration

### `EffectsProvider`
Wrap your form in the provider:
```ts
<EffectsProvider config={effectsConfig}>
  <FormProvider {...methods}>
    <MyForm />
  </FormProvider>
</EffectsProvider>
```

### `useFieldEffects(name)`
Hook into a specific field’s effect state:
```ts
const { fieldProps, registerProps } = useFieldEffects('email');
```
Use this to control visibility, dynamic props, etc.


## Example Use Case
```ts
const effectsConfig: EffectsConfig = [
  {
    when: {
      field: 'subscribe',
      operator: '===',
      value: true
    },
    actions: [
      { type: 'showField', target: 'email' },
      { type: 'setRegisterProps', target: 'email', value: { required: true } }
    ]
  }
];

<EffectsProvider config={effectsConfig}>
  <FormProvider {...methods}>
    <Form />
  </FormProvider>
</EffectsProvider>
```

## Extensibility
You can extend:
* **Actions**: via `createActions.ts`
* **Operators**: via `operators.ts`