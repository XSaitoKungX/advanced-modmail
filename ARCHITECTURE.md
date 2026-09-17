# Architecture

## Purpose

Advanced Modmail is designed as a modular Discord support platform rather than a collection of command handlers. The architecture must preserve clear boundaries between Discord transport, business rules, persistence, rendering, configuration, integrations, and operational concerns.

## Architectural goals

- Multi-guild support without cross-guild data leakage.
- Horizontal scalability without redesigning domain logic.
- Reliable delivery and idempotent processing of external events.
- Auditable moderation and configuration changes.
- Replaceable infrastructure adapters.
- Testable domain behavior without requiring a live Discord connection.
- Safe self-hosting with explicit migrations and configuration validation.
- Configuration-first operation without source edits for normal customization.
- First-class internationalization.
- Transport-independent modmail flows across supported Discord surfaces.

## Initial runtime baseline

- Runtime: Node.js 24 LTS
- Language: TypeScript 7 in strict mode
- Package manager: pnpm 12
- Discord library: discord.js 14
- Primary database: PostgreSQL

Redis is not a mandatory dependency at project start. It should be introduced only when queues, distributed locks, rate-limit coordination, caching, or multi-process coordination require it.

## Logical layers

### 1. Transport

Adapters that receive or send external data:

- Discord direct messages,
- Discord guild messages,
- text channels,
- private/public threads,
- forum/thread-style destinations where supported,
- Discord interactions,
- REST/webhook endpoints where applicable,
- future dashboard/API transport.

Transport code converts external payloads into validated application commands/events. It must not contain core modmail policy.

A transport adapter must expose normalized capabilities rather than leaking channel/thread-specific behavior into the domain. This allows supported routes such as DM-to-thread, DM-to-channel, guild-message-to-thread, and other configured combinations to reuse the same application use cases.

### 2. Application

Coordinates use cases such as:

- opening a modmail thread,
- resolving configured routing,
- routing a user message,
- sending a staff reply,
- closing/reopening a thread,
- generating a transcript,
- applying guild configuration,
- rendering localized Discord output,
- recording moderation actions.

Application services orchestrate domain rules and infrastructure ports.

### 3. Domain

Contains framework-independent rules and models. Planned concepts include:

- Guild/Tenant
- ModmailThread
- Participant
- MessageRelay
- ThreadState
- StaffAction
- Transcript
- GuildConfiguration
- PermissionPolicy
- RoutingPolicy
- LocalePolicy

Domain objects must not depend on discord.js, database clients, HTTP frameworks, environment variables, or Discord-specific component builder classes.

### 4. Infrastructure

Implements external concerns:

- PostgreSQL repositories,
- Discord adapters,
- Components V2 rendering,
- localization catalogs/loaders,
- object/file storage for transcript assets if required,
- queue/cache implementations,
- logging and telemetry exporters.

Infrastructure implementations must satisfy interfaces owned by application/domain layers rather than the reverse.

## Discord rendering architecture

Bot-generated structured Discord UI uses Components V2 by default where supported.

`Container` is the preferred root layout for structured responses. Rendering must be centralized behind a presentation layer so features do not construct unrelated one-off layouts throughout business code.

The renderer should support official Components V2 elements as applicable, including `Text Display`, `Section`, `Separator`, `Media Gallery`, `File`, and action components.

Legacy embeds/components remain adapter-level fallbacks for unsupported surfaces or compatibility cases.

## Text and formatting pipeline

Discord text must pass through a dedicated formatting/rendering boundary rather than being manipulated ad hoc in feature handlers.

Responsibilities include:

- preserve supported Markdown when relaying content,
- preserve/normalize supported Discord message-formatting tokens,
- understand user/role/channel mentions,
- understand command mentions,
- understand static and animated custom emoji markup,
- understand Discord timestamp markup,
- understand supported guild-navigation markup,
- recognize deprecated forms for input compatibility when useful,
- never assume that markup implies notification permission.

Outgoing notification behavior must be controlled explicitly with `allowed_mentions`. User-generated or configurable content must not be allowed to trigger unintended mass mentions or role/user notifications.

## Internationalization architecture

User-facing strings must be obtained from locale resources rather than embedded in domain/application logic.

Initial baseline locales:

- `de-DE`
- `en-US`

Locale resolution order must be deterministic. Exact precedence may vary by surface, but should support:

1. explicit user/interaction locale when the feature allows personalized output,
2. guild-configured default locale,
3. application fallback locale.

Configuration-defined templates must be localization-aware. Adding a new locale should require catalog/resource changes, not feature rewrites.

## Configuration architecture

The project targets effectively complete configuration of operator-facing behavior. The practical "99.99% configurable" goal means source edits are not part of normal setup/customization.

Configuration domains may include:

- routing and entry-point modes,
- channels/categories/threads/forums and staff destinations,
- roles and permission policies,
- Components V2 presentation settings and message templates,
- labels, buttons, limits, cooldowns, naming, notifications, and feature toggles,
- transcript/privacy/retention/export behavior,
- logging/audit behavior,
- locales and language defaults.

Configuration must be schema-validated, versioned/migratable, tenant-scoped where appropriate, and safe by default.

Security invariants, API/protocol constraints, database invariants, and internal implementation constants are not required to be configurable.

## Multi-tenancy

Guild ID is the primary tenant boundary.

Rules:

- every tenant-owned database record must be attributable to a guild,
- repository queries must include tenant scope when accessing tenant-owned data,
- caches and locks must include tenant identity in keys,
- authorization must never rely only on a Discord channel/thread identifier,
- tests must include cross-tenant isolation cases.

## Modmail lifecycle

A typical lifecycle is expected to be:

1. User initiates contact through an approved/configured Discord entry point.
2. System resolves guild routing, transport mode, locale, and configuration.
3. Application checks limits, block state, existing open thread, and permissions.
4. Thread is created transactionally.
5. A configured staff-side Discord representation is provisioned.
6. User and staff messages are relayed and persisted according to configured privacy policy.
7. Content rendering preserves supported Markdown/Discord formatting while enforcing safe mention behavior.
8. Staff actions are auditable.
9. Closing a thread finalizes metadata and transcript state.
10. Retention policies determine later deletion/anonymization.

Exact UX and supported route combinations are defined in implementation issues.

## Reliability

External side effects can fail independently. Implementations must account for:

- Discord API rate limits,
- duplicate gateway events,
- process restarts,
- partial database/Discord success,
- stale interactions,
- unavailable external integrations.

Where a use case can be retried, it should have an idempotency strategy. Durable work that cannot safely be lost should eventually use a persistent job/queue mechanism rather than in-memory timers.

## Persistence

PostgreSQL is the system of record for durable application state.

Requirements:

- versioned migrations,
- foreign-key constraints where appropriate,
- unique constraints for invariants,
- transactional state transitions when multiple records must change together,
- timestamps stored in UTC,
- Discord snowflakes stored without numeric precision loss.

## Configuration categories

### Deployment configuration

Secrets and infrastructure values supplied through environment variables or mounted secret mechanisms.

### Guild configuration

Tenant-specific behavior stored in the database and changed through validated commands/dashboard flows.

Do not mix secrets into guild configuration.

## Observability

The runtime should eventually provide:

- structured logs,
- correlation/request IDs,
- health and readiness signals,
- metrics for thread/message/error behavior,
- audit events for privileged actions.

Logs must respect privacy and redaction requirements from `SECURITY.md`.

## Dashboard/API

A dashboard is an intended extension, but it must use the same application/domain services rather than duplicating business rules. Authentication and guild authorization must be enforced server-side.

No dashboard framework is selected in this architecture phase.

## Scaling path

The system should begin as a deployable single application where practical, while keeping boundaries that allow later extraction.

Potential scaling stages:

1. Single process + PostgreSQL.
2. Multiple bot processes/shards with shared PostgreSQL.
3. Redis/queue coordination when justified.
4. Separately deployed web/API workers if operational scale requires it.

Avoid distributed-system complexity before it solves a measured problem.

## Architectural decision records

Material architecture changes should eventually be documented under `docs/adr/` using numbered ADRs. The directory should be introduced with the first decision that needs a durable trade-off record.
