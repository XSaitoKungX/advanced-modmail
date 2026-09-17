# Application

Use-case orchestration (ARCHITECTURE.md → "2. Application").

Coordinates workflows such as opening/closing a modmail thread, resolving
routing, relaying messages, rendering localized output, applying guild
configuration, and recording staff actions. Application services orchestrate
domain rules and the infrastructure ports (interfaces) owned by this layer.

## Dependency rules

- May import `domain` and within this layer.
- Must not import `infrastructure`, `transport`, or `presentation` — external
  concerns are consumed through injected ports, wired at the composition root.
