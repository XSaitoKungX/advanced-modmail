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
- Keep Discord transport concerns separate from domain logic and persistence.
- Avoid global mutable state.
- Make retry behavior, idempotency, and failure modes explicit for side effects.

## Discord UI requirements

- Components V2 is the default system for new structured Discord UI where supported.
- Prefer `Container` as the root component for structured bot-generated messages.
- Use `Text Display`, `Section`, `Separator`, `Media Gallery`, `File`, and action components as appropriate.
- Do not introduce legacy embeds or legacy component layouts for new features unless the target surface or Discord API requires a fallback.
- Keep rendering logic centralized in presentation/rendering modules rather than scattered across handlers.
- Do not use deprecated Discord interaction/message patterns when a supported modern alternative exists.

## Configuration requirements

- Design operator-facing behavior to be configurable by default.
- The project target is effectively complete configuration ("99.99% configurable") without source-code edits for normal customization.
- Do not hard-code guild IDs, channel IDs, role IDs, category IDs, forum IDs, message copy, routing destinations, colors, labels, cooldowns, limits, naming schemes, or workflow behavior when those values reasonably belong in configuration.
- Configuration must be schema-validated, safe by default, and scoped explicitly.
- Security invariants, Discord/API protocol constraints, database invariants, and implementation constants that must remain fixed are valid exceptions.

## Internationalization

- User-facing strings must not be scattered through domain or business logic.
- German (`de-DE`) and English (`en-US`) are baseline locales for the first usable release.
- Features must use the shared localization layer.
- New locales must be addable without rewriting business logic.
- Locale fallback behavior must be deterministic.
- Configurable templates must remain localization-aware.

## Discord transport and routing

- Do not assume modmail is always DM-to-channel.
- Domain/application logic must work through transport abstractions that can support DMs, guild messages, channels, public/private threads, forum/thread-style destinations, interactions, and future supported Discord surfaces.
- Surface-specific logic belongs in adapters.
- New routing modes must preserve permission checks, tenant isolation, auditability, and retry/idempotency guarantees.

## Markdown and Discord formatting

- Preserve supported Discord Markdown during relay/rendering where safe and technically possible.
- The shared formatting layer must support current Discord message-formatting forms such as:
  - `<@USER_ID>`
  - `<@&ROLE_ID>`
  - `<#CHANNEL_ID>`
  - `</COMMAND:COMMAND_ID>`
  - `<:EMOJI_NAME:EMOJI_ID>`
  - `<a:EMOJI_NAME:EMOJI_ID>`
  - `<t:TIMESTAMP>`
  - `<t:TIMESTAMP:STYLE>`
  - supported guild-navigation forms such as `<id:TYPE>`
- Deprecated input forms may be recognized for compatibility but must not be generated as preferred output.
- Treat formatting and notification behavior separately.
- Always control ping behavior explicitly through Discord `allowed_mentions` so relayed or configured content cannot unexpectedly notify users, roles, `@everyone`, or `@here`.

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
- locale fallback and translation-key behavior,
- Markdown/Discord-format parsing and safe mention handling,
- routing behavior across supported transport adapters,
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
- configuration impact was considered,
- i18n impact was considered,
- Discord Components V2/formatting behavior was considered where relevant,
- docs/config examples are updated when necessary,
- no secrets or local-only artifacts are included,
- the pull request explains what changed and how it was verified.
