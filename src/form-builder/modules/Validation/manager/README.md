# ValidationManager

The `ValidationEngine` is a core component of the validation system. It’s responsible for compiling declarative validation rules into executable functions. It uses a registry of validation operators to resolve each rule into a specific validator function.

## `compile`

Compiles an array of validation rules into a map of validation functions, where each key corresponds to the rule name.

## `compileSignleValidator`

Creates a single validation function that runs all provided rules in order, stopping at the first failing rule.

# ValidationOperatorRegistry

Todo