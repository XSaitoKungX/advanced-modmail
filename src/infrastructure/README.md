# Infrastructure

Implementations of external concerns (ARCHITECTURE.md → "4. Infrastructure").

Planned contents include PostgreSQL repositories, Discord adapters, Components
V2 rendering implementations, localization catalog loaders, object/file
storage, queue/cache implementations, and logging/telemetry exporters.

## Dependency rules

- May import `domain` and `application` — implementations satisfy interfaces
  owned by those layers, not the reverse.
- Must not import `transport` or `presentation`.
