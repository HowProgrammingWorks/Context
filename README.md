# Context Patterns

Context used to provide an efficient way of sharing data between different components (abstractions, modules, layers) having no shared environment without coupling them.

## Examples index

- [1-closure.js](JavaScript/1-closure.js) — Context with closure
  - Partially applied function with bound context; simple AccessPolicy and user auth
- [2-oop.js](JavaScript/2-oop.js) — Context in OOP
  - Context passed to constructor; AccessPolicy, User, and AccountService as classes
- [3-factory.js](JavaScript/3-factory.js) — Context factory
  - Factory creates services with shared context; dependency injection
- [4-pipeline.js](JavaScript/4-pipeline.js) — Context in middleware pipeline
  - Async pipeline with context propagation; tracing and request IDs
- [5-async.js](JavaScript/5-async.js) — Async context (AsyncLocalStorage)
  - Context preserved across async boundaries without passing it explicitly
- [6-immutable.js](JavaScript/6-immutable.js) — Immutable context
  - Frozen context and derived contexts via helpers; no mutation
