# Form Builder - Effects Engine Architecture

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
[ EffectsProvider (Context + PubSub) ]
       |
       v
[ EffectsEngine (Business Logic) ] <---- Watches Form Values (dependencies)
       |
       v
[ PubSub Cache (Reactive updates) ]
       |
       v
[ Consumer Hooks (useFieldEffects) ]
       |
       v
[ UI Components (Dropdowns, etc.) ]
```

## Components
### 1. Config (Configuration Layer)

### 2. Provider Layer

### 3. Engine Layer (Business Logic)

### 4. PubSub Layer (Reactive Bridge)

### 5. Consumer Hooks

### 6. UI Layer