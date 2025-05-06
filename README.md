# React Form Builder

## Modules
- [Options Engine Architecture](https://github.com/team-good-io/react-form-builder-next/tree/main/src/solution/providers/Options)
- [Effects Engine Architecture](https://github.com/team-good-io/react-form-builder-next/tree/main/src/solution/providers/Effects)

## System Design

### SoC - Keep logic separate from React (React to handle UI)
* A validation function does not need `useEffect` - it just needs inputs and outputs.
* Logic that’s not tied to React can be reused - Different parts, libraries, platforms. Avoid vendor lock-in.
* React components become simpler and more focused - render and interaction, no business logic.
* Business logic changes often - modify it via config.