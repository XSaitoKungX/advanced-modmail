# AGENTS.md

This file defines mandatory rules for AI coding agents, automation, and contributors acting with repository write access.

## Source of truth

Read these files before making architectural or implementation changes:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `DESIGN.md`
4. `SECURITY.md`
5. `CONTRIBUTING.md`
6. the issue assigned to the change

When documentation conflicts, security requirements take precedence, followed by architecture, then the scoped issue.

## Workflow

- Never develop directly on `main`.
- Every meaningful change must be traceable to an issue.
- Use a scoped branch: `<type>/<issue>-<short-description>`.
- Keep pull requests small enough to review safely.
- Do not silently expand scope.
- Do not merge unrelated refactors into feature work.
- Prefer squash merging.
- Update documentation when behavior or architecture changes.

## Engineering requirements

- TypeScript must remain strict.
- Prefer explicit types at system boundaries.
- Validate all untrusted external input.
- Treat Discord payloads, HTTP input, environment variables, database data, and integration responses as untrusted until validated.
- Do not use deprecated APIs, packages, Discord patterns, or configuration formats when supported alternatives exist.
- No hidden magic constants for IDs, permissions, timeouts, limits, URLs, or feature behavior.
- User-facing strings must be ready for internationalization instead of being scattered through business logic.
- Keep Discord transport concerns separate from domain logic and persistence.
- Avoid global mutable state.
- Make retry behavior, idempotency, and failure modes explicit for side effects.

## Security

- Never commit secrets, tokens, credentials, private keys, production identifiers, or real user data.
- Never log Discord tokens, OAuth tokens, session secrets, complete authorization headers, or sensitive message content unless explicitly required and safely redacted.
- Apply least privilege to Discord permissions, database roles, CI tokens, and deployment credentials.
- Security-sensitive changes require dedicated tests and documentation.
- Any discovered credential must be treated as compromised and rotated rather than merely removed from Git history.

## Dependencies

- Add dependencies only when they solve a concrete requirement.
- Prefer maintained packages with clear ownership and release history.
- Avoid packages for trivial utilities that can be implemented safely in a few lines.
- Pin runtime/toolchain expectations through project metadata and lockfiles.
- Do not perform mass dependency upgrades inside unrelated pull requests.

## Database changes

- Schema changes require migrations.
- Migrations must be forward-safe and reviewed for data-loss risk.
- Never mutate production schema manually as part of application startup.
- Multi-guild data must always preserve tenant boundaries.

## Tests

Changes are incomplete when important behavior cannot be verified.

At minimum, tests should cover:

- domain/business rules,
- permission and authorization boundaries,
- transcript/privacy behavior,
- parsing and validation,
- failure/retry behavior where applicable,
- regressions for bug fixes.

## Comments and documentation

- Technical code comments should be in English.
- Comments should explain intent, invariants, trade-offs, or non-obvious constraints.
- Do not add comments that merely restate the code.
- Public APIs and architectural decisions should be documented.

## Generated content

Generated files must be reproducible. Do not hand-edit generated artifacts when a source or generator exists.

## Definition of done

A change is done only when:

- its issue scope is satisfied,
- tests and static checks pass,
- security impact was considered,
- docs/config examples are updated when necessary,
- no secrets or local-only artifacts are included,
- the pull request explains what changed and how it was verified.
