# Form Builder — Options Engine Architecture

## Overview

Our Form Builder is designed to be:

* Config-Driven — Options and dependencies are defined via JSON config.
* Headless & Decoupled — Business logic is separate from UI rendering.
* Reactive — Components update automatically when data changes.
* Extensible & Scalable — New sources, caching, transforms, and effects can be added seamlessly.

We follow a pattern inspired by modern frontend architectures (React Hook Form).

## High-Level Flow
```yaml
[ Config JSON ]
       |
       v
[ OptionsProvider (Context + PubSub) ]
       |
       v
[ OptionsEngine (Business Logic) ] <---- Watches Form Values (dependencies)
       |
       v
[ PubSub Cache (Reactive updates) ]
       |
       v
[ Consumer Hooks (useFieldOptions) ]
       |
       v
[ UI Components (Dropdowns, etc.) ]

```

## Components
### 1. Config (Configuration Layer)

All option sources (static, remote, dynamic) are defined in a central JSON config.

### 2. Provider Layer
`OptionsProvider` bridges the config and form context into a reactive system using:
* Context API — for consumers to access.
* PubSub — for efficient, granular updates.
* Initialization — loads initial state based on config.

### 3. Engine Layer (Business Logic)
`createOptionsEngine` reads the config and orchestrates data loading:
* Loads static options.
* Fetches remote options.
* Reacts to changes for remote-dynamic options (e.g., when "country" changes, reload "city").

The engine subscribes to form value changes and triggers updates as needed.

### 4. PubSub Layer (Reactive Bridge)

A lightweight PubSub system caches state and notifies subscribers:
* Efficient granular updates (field-level).
* Cached results prevent duplicate network requests.

### 5. Consumer Hooks
Components use hooks like:
```ts
const { data, loading } = useFieldOptions('country');
```
This gives consumers reactive access to their option state, without needing to know about data sources or engine logic.

### 6. UI Layer
Purely presentational components:

* Render based on hook state.
* No coupling to engine or business logic.
* Easy to test and reuse.

## Benefits
* Scalable — Add new option sources via config only.
* Decoupled — Business logic is cleanly separated from UI.
* Performant — PubSub ensures granular, efficient updates.
*  Extensible — Can add:
   * Field-level effects
   * Custom transformers for response
* Testable — Engine and hooks are easy to unit test.

## Naming Conventions
* Config -	Declarative source of truth
* Provider -	Dependency injection & reactive bridge
* Engine -	Core logic, orchestration
* PubSub -	Reactive state & granular updates
* Consumer - Hook	Subscribe to reactive updates
* UI Component -	Dumb / presentational components