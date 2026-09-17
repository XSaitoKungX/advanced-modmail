# Design Principles

## Product direction

Relaya should feel reliable, calm, fast, modern, and predictable for both users requesting help and staff handling requests.

The project prioritizes operational clarity, Discord-native interaction design, and deep configurability over feature count.

## Core principles

### Privacy by default

Modmail handles potentially sensitive conversations. Collection, retention, transcript visibility, exports, and logs must therefore be explicit and configurable.

### Configuration-first without chaos

The project targets effectively complete configuration of operator-facing behavior. "99.99% configurable" is a product goal: normal customization must not require source edits.

Configuration must remain schema-validated, versionable through migrations, safe by default, and scoped clearly.

Normal configuration should cover, where applicable:

- Discord destinations such as channels, categories, threads, and forums,
- roles, permissions, staff groups, and routing rules,
- modmail entry points and transport modes,
- Components V2 layouts, text, labels, buttons, and presentation options,
- workflow state, limits, cooldowns, naming, notifications, and logging,
- transcript, privacy, retention, export, and moderation behavior,
- language/locale behavior,
- feature toggles and guild-specific defaults.

Security invariants, protocol-level constraints, schema guarantees, and implementation constants that must not be changed by operators are explicit exceptions.

### Strong defaults

A new installation should be secure and useful without requiring dozens of risky toggles.

### Progressive complexity

Simple deployments should remain simple. Optional infrastructure such as Redis, object storage, external telemetry, or a dashboard should not become mandatory without a strong architectural reason.

### Components V2 as the default Discord design system

New bot-generated structured messages and interactions must use Discord Components V2 by default when the target surface supports them.

`Container` is the preferred root component for structured bot UI. Compose it from appropriate Components V2 elements such as `Text Display`, `Section`, `Separator`, `Media Gallery`, `File`, and action components.

Legacy embeds and legacy component layouts are compatibility fallbacks, not the default design language for new features.

Discord UX should:

- use clear labels and error messages,
- avoid relying only on color,
- keep destructive actions explicit,
- provide actionable permission/configuration errors,
- avoid deprecated Discord interaction patterns,
- preserve a consistent visual and interaction language across modmail workflows.

### First-class internationalization

Internationalization is a product requirement from the first usable version.

- German (`de-DE`) and English (`en-US`) are the initial baseline locales.
- User-facing copy must live outside feature/business logic.
- New locales must be addable without rewriting features.
- Locale resolution must have deterministic fallback behavior.
- Guild configuration may choose a default locale.
- User or interaction locale may override guild defaults where the feature explicitly supports user-localized output.
- Configurable message templates must remain localization-aware.

### Discord-native text fidelity

Messages should preserve supported Discord Markdown and message-formatting semantics where safe and technically possible.

The formatting/relay pipeline under `src/discord/formatting/` must understand official Discord markup classes including:

- user mentions: `<@USER_ID>`,
- role mentions: `<@&ROLE_ID>`,
- channel mentions: `<#CHANNEL_ID>`,
- application command mentions: `</COMMAND:COMMAND_ID>`,
- static custom emoji: `<:NAME:ID>`,
- animated custom emoji: `<a:NAME:ID>`,
- timestamps: `<t:TIMESTAMP>` and `<t:TIMESTAMP:STYLE>`,
- supported guild-navigation markup such as `<id:TYPE>`.

Deprecated forms may be recognized for compatibility but must not be emitted as the preferred representation.

Markup rendering and ping permissions are separate concerns. Generated or relayed messages must use explicit `allowed_mentions` policies so user-controlled or configurable text cannot unexpectedly ping users, roles, or everyone/here.

## Staff workflow design

Staff workflows should optimize for:

- obvious thread state,
- minimal accidental cross-thread replies,
- clear actor attribution,
- fast context retrieval,
- explicit closing/reopening behavior,
- safe internal notes that can never be relayed to the user accidentally,
- transport-independent operation regardless of whether the staff destination is a channel, thread, or another supported surface.

## User workflow design

Users should understand:

- which server/support destination they are contacting,
- whether a thread already exists,
- when a message has been accepted,
- when the conversation is closed,
- what transcript/privacy behavior applies when relevant.

The public/user entry point may vary by configuration, including supported DM, guild-message, interaction, channel, or thread-based flows.

## Error design

Do not expose stack traces, raw database errors, internal IDs that are not useful, or secret-bearing configuration.

Operational errors should contain an internal correlation identifier when possible so staff can map a user-visible failure to logs.

## Configuration design

Each configurable option should have:

- a documented purpose,
- a validated type,
- a safe default,
- explicit scope (deployment/global/guild/user where applicable),
- migration behavior if its representation changes,
- localization behavior if it affects user-facing content.

Configuration should prefer declarative schemas over ad-hoc conditionals scattered through feature code.

## Performance design

Prefer correctness and predictable latency over premature micro-optimization. Expensive Discord/API/database operations should be observable before caching is added.

## Compatibility

Backward compatibility matters after the first stable release. Before `v1.0.0`, breaking changes may occur but must be documented clearly in release notes.
