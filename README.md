# React Hook Form Builder
A config-driven form builder built on top of React and React Hook Form, offering powerful abstractions for dynamic forms through:

* 🔄 Options Engine – dynamic select/dropdown population
* ⚡ Effects Engine – reactive, condition-based field behavior
* ✅ Validation Engine – declarative and extensible validation

## Features
* ✅ Modular configuration for maintainable forms
* 🔌 Extendable validation and effect actions
* 🔄 Support for static, remote, and dynamic field options
* 🧩 Pluggable into any React + RHF workflow
* ⚙️ Built-in context providers and hooks for flexibility

## Getting Started
Install the package:
```bash
npm install @team-good-io/{TODO}
```

Wrap your form in the required providers:
```tsx
<OptionsProvider config={optionsConfig}>
  <EffectsProvider config={effectsConfig}>
    <ValidationProvider>
      <FormProvider {...methods}>
        <MyForm />
      </FormProvider>
    </ValidationProvider>
  </EffectsProvider>
</OptionsProvider>
```
Use helpers like useFieldOptions and useValidation to bind dynamic logic to fields.

## Documentation
* 🧩 [Options Module](https://github.com/team-good-io/react-form-builder-next/tree/main/docs/OPTIONS.md) – static/remote/dynamic dropdowns
* ⚡ [Effects Module](https://github.com/team-good-io/react-form-builder-next/tree/main/docs/EFFECTS.md) – conditionally show/hide/reset/set fields
* ✅ [Validation Module](https://github.com/team-good-io/react-form-builder-next/tree/main/docs/VALIDATION.md) – reusable, contextual validation logic

## Philosophy
This project is built with the belief that:
* Form logic should be configurable – You shouldn't have to write imperative code to control field behavior, validation, or population.
* Behavior belongs in configuration, not components – Keep UI clean and separate from business rules.
* Configuration should be declarative on the surface, imperative underneath – Complex behaviors should feel simple to declare but remain powerful under the hood.
* Abstractions should be consistent and predictable – Whether working with options, validations, or effects, the structure and mental model stay the same.
* Extensibility is a first-class concern – Operators and actions are easy to extend, override, or enhance without modifying core logic.
* Form logic should be testable and introspectable – Configs can be validated and reasoned about independently of rendering.
* Minimal runtime coupling – Modules like Effects, Options, and Validation can operate independently but interoperate smoothly when combined.
