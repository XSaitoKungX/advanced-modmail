# Design Principles

## Product direction

Advanced Modmail should feel reliable, calm, fast, and predictable for both users requesting help and staff handling requests.

The project prioritizes operational clarity over feature count.

## Core principles

### Privacy by default

Modmail handles potentially sensitive conversations. Collection, retention, transcript visibility, exports, and logs must therefore be explicit and configurable.

### Configuration without chaos

Most user-facing behavior should be configurable per guild, but configuration must remain schema-validated, versionable through migrations, and safe by default.

### Strong defaults

A new installation should be secure and useful without requiring dozens of risky toggles.

### Progressive complexity

Simple deployments should remain simple. Optional infrastructure such as Redis, object storage, external telemetry, or a dashboard should not become mandatory without a strong architectural reason.

### Accessible interaction design

Discord interactions should:

- use clear labels and error messages,
- avoid relying only on color,
- keep destructive actions explicit,
- provide actionable permission/configuration errors,
- use Components v2 where appropriate and supported,
- avoid deprecated Discord interaction patterns.

### Internationalization ready

User-facing copy must be separated from domain logic. Initial language support can be limited, but architecture must not make later translations invasive.

## Staff workflow design

Staff workflows should optimize for:

- obvious thread state,
- minimal accidental cross-thread replies,
- clear actor attribution,
- fast context retrieval,
- explicit closing/reopening behavior,
- safe internal notes that can never be relayed to the user accidentally.

## User workflow design

Users should understand:

- which server/support destination they are contacting,
- whether a thread already exists,
- when a message has been accepted,
- when the conversation is closed,
- what transcript/privacy behavior applies when relevant.

## Error design

Do not expose stack traces, raw database errors, internal IDs that are not useful, or secret-bearing configuration.

Operational errors should contain an internal correlation identifier when possible so staff can map a user-visible failure to logs.

## Configuration design

Each configurable option should have:

- a documented purpose,
- a validated type,
- a safe default,
- explicit scope (deployment/global/guild),
- migration behavior if its representation changes.

## Performance design

Prefer correctness and predictable latency over premature micro-optimization. Expensive Discord/API/database operations should be observable before caching is added.

## Compatibility

Backward compatibility matters after the first stable release. Before `v1.0.0`, breaking changes may occur but must be documented clearly in release notes.
